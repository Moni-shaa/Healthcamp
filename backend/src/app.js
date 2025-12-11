/**
 * src/app.js
 * Configure Express middlewares and mount route modules.
 */

const express = require("express");
const cors = require("cors");

const campsRouter = require("./routes/camps");
const bookingsRouter = require("./routes/bookings");

const app = express();

// Middlewares
app.use(cors()); // during dev allow all origins; tighten in production
app.use(express.json());

// Simple health-check endpoint
app.get("/health", (req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// Mount routers
app.use("/api/admin/camps", campsRouter); // admin create/list (same router handles both)
app.use("/api/camps", campsRouter); // public listing and detail
app.use("/api", bookingsRouter); // booking endpoints: POST /api/camps/:campId/book, GET /api/bookings/:id

module.exports = app;
