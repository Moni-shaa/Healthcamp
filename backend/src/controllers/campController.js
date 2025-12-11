/**
 * controllers/campController.js
 * Handlers for creating and listing camps.
 */

const pool = require("../services/dbPool");

/**
 * POST /api/admin/camps
 * Body: { name, description, location, start_time, total_slots }
 */
async function createCamp(req, res) {
  const { name, description, location, start_time, total_slots } = req.body;
  if (!name || !start_time || !total_slots) {
    return res.status(400).json({
      error: "Missing required fields: name, start_time, total_slots",
    });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO camps (name, description, location, start_time, total_slots)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, description || null, location || null, start_time, total_slots]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    console.error("createCamp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/camps
 * List camps with allocated_slots included
 */
async function listCamps(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, COALESCE(a.allocated_slots, 0) AS allocated_slots
       FROM camps c
       LEFT JOIN camp_allocations a ON c.id = a.camp_id
       ORDER BY c.start_time`
    );
    return res.json(rows);
  } catch (err) {
    console.error("listCamps error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * GET /api/camps/:id
 * Get camp detail (with allocated_slots)
 */
async function getCamp(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id) return res.status(400).json({ error: "Invalid camp id" });

  try {
    const { rows } = await pool.query(
      `SELECT c.*, COALESCE(a.allocated_slots, 0) AS allocated_slots
       FROM camps c
       LEFT JOIN camp_allocations a ON c.id = a.camp_id
       WHERE c.id = $1`,
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Camp not found" });
    return res.json(rows[0]);
  } catch (err) {
    console.error("getCamp error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createCamp, listCamps, getCamp };
