/**
 * src/services/bookingService.js
 *
 * Core booking logic using PostgreSQL transactions and row-level locking.
 * - Uses SELECT ... FOR UPDATE on camp_allocations to serialize updates for a given camp.
 * - Inserts a bookings row with status CONFIRMED or FAILED.
 *
 * Returns an object:
 *   { status: 'CONFIRMED'|'FAILED', bookingId: number, message?: string }
 *
 * Notes:
 * - This implementation is simple, robust and suitable for the assessment.
 * - In heavy production you may add retry-on-deadlock, exponential backoff,
 *   observability (logs/metrics) and distributed locking if sharding DBs.
 */

const pool = require("./dbPool");

async function attemptBooking(campId, userName, userContact, numSlots) {
  if (!campId || !userName || !numSlots) {
    throw new Error("Missing required booking fields");
  }

  const client = await pool.connect();
  try {
    // Start transaction
    await client.query("BEGIN");

    // 1) Get camp and its capacity
    const campRes = await client.query(
      "SELECT id, total_slots FROM camps WHERE id = $1",
      [campId]
    );

    if (campRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return { status: "FAILED", message: "Camp not found" };
    }

    const totalSlots = campRes.rows[0].total_slots;

    // 2) Lock allocation row for this camp (create it if missing)
    // Try selecting allocation row with FOR UPDATE
    let allocRes = await client.query(
      "SELECT allocated_slots FROM camp_allocations WHERE camp_id = $1 FOR UPDATE",
      [campId]
    );

    let allocated = 0;
    if (allocRes.rowCount === 0) {
      // No allocation row yet: create it (0) and then re-select FOR UPDATE
      await client.query(
        "INSERT INTO camp_allocations (camp_id, allocated_slots) VALUES ($1, 0)",
        [campId]
      );
      allocRes = await client.query(
        "SELECT allocated_slots FROM camp_allocations WHERE camp_id = $1 FOR UPDATE",
        [campId]
      );
      allocated = allocRes.rows[0].allocated_slots;
    } else {
      allocated = allocRes.rows[0].allocated_slots;
    }

    // 3) Check availability
    if (allocated + numSlots <= totalSlots) {
      // Enough space: confirm booking and increase allocation
      const insertRes = await client.query(
        `INSERT INTO bookings (camp_id, user_name, user_contact, num_slots, status)
         VALUES ($1, $2, $3, $4, 'CONFIRMED') RETURNING id`,
        [campId, userName, userContact || null, numSlots]
      );
      const bookingId = insertRes.rows[0].id;

      await client.query(
        "UPDATE camp_allocations SET allocated_slots = allocated_slots + $1 WHERE camp_id = $2",
        [numSlots, campId]
      );

      await client.query("COMMIT");
      return { status: "CONFIRMED", bookingId };
    } else {
      // Not enough capacity: record failed booking (for audit) and return FAILED
      const failRes = await client.query(
        `INSERT INTO bookings (camp_id, user_name, user_contact, num_slots, status)
         VALUES ($1, $2, $3, $4, 'FAILED') RETURNING id`,
        [campId, userName, userContact || null, numSlots]
      );
      await client.query("COMMIT");
      return {
        status: "FAILED",
        bookingId: failRes.rows[0].id,
        message: "Not enough slots available",
      };
    }
  } catch (err) {
    // rollback on any error
    try {
      await client.query("ROLLBACK");
    } catch (e) {
      /* ignore */
    }
    // Re-throw so controller can log/return 500 if needed
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { attemptBooking };
