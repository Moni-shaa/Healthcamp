/**
 * controllers/bookingController.js
 *
 * HTTP handlers for booking operations.
 * Uses bookingService.attemptBooking for the transaction-safe booking.
 */

const pool = require("../services/dbPool");
const { attemptBooking } = require("../services/bookingService");

/**
 * POST /api/camps/:campId/book
 * Body: { user_name, user_contact, num_slots }
 */
async function attemptBookingHandler(req, res) {
  const campId = parseInt(req.params.campId, 10);
  const { user_name, user_contact, num_slots } = req.body;

  if (!campId || !user_name || !num_slots) {
    return res
      .status(400)
      .json({ error: "Missing required fields: campId, user_name, num_slots" });
  }

  try {
    const result = await attemptBooking(
      campId,
      user_name,
      user_contact,
      parseInt(num_slots, 10)
    );
    // result: { status: 'CONFIRMED'|'FAILED', bookingId, message? }
    return res.json(result);
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/bookings/:id
 * Return booking row (for status check)
 */
async function getBookingHandler(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: "Invalid booking id" });

  try {
    const { rows } = await pool.query("SELECT * FROM bookings WHERE id = $1", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "Booking not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("Get booking error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { attemptBookingHandler, getBookingHandler };
