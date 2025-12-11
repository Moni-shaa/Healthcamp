/**
 * routes/camps.js
 * Routes for camp creation and listing.
 *
 * Mounted as:
 *  - POST /api/admin/camps      -> createCamp
 *  - GET  /api/camps            -> listCamps
 *  - GET  /api/camps/:id        -> getCamp
 */

const express = require("express");
const router = express.Router();
const {
  createCamp,
  listCamps,
  getCamp,
} = require("../controllers/campController");

// Admin create (POST /api/admin/camps)
router.post("/", createCamp);

// Public list (GET /api/camps)
router.get("/", listCamps);

// Detail (GET /api/camps/:id)
router.get("/:id", getCamp);

module.exports = router;
