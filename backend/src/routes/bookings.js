/**
 * routes/bookings.js
 *
 * Routes for booking endpoints.
 *
 * Mount these in app.js like:
 *    const bookingsRouter = require('./routes/bookings');
 *    app.use('/api', bookingsRouter);
 *
 * It exposes:
 *  - POST /api/camps/:campId/book
 *  - GET  /api/bookings/:id
 */

const express = require("express");
const router = express.Router();
const {
  attemptBookingHandler,
  getBookingHandler,
} = require("../controllers/bookingController");

// Attempt to book slots at a camp
router.post("/camps/:campId/book", attemptBookingHandler);

// Get booking by id
router.get("/bookings/:id", getBookingHandler);

module.exports = router;
