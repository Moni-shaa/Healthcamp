/**
 * src/services/dbPool.js
 * Central pg Pool used across the backend.
 *
 * Usage:
 *   const pool = require('../services/dbPool');
 *   const { rows } = await pool.query('SELECT ...');
 *
 * The pool reads the DATABASE_URL from your .env file.
 */

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error(
    "ERROR: DATABASE_URL not set. Copy .env.example -> .env and set DATABASE_URL."
  );
  // Don't exit so the server can still run without DB while you develop other parts.
  // If you want the process to stop when DB is missing, uncomment the next line:
  // process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional tuning:
  // max: 10,
  // idleTimeoutMillis: 30000,
  // connectionTimeoutMillis: 2000,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle pg client", err);
  // Optionally exit the process if you want the server to crash on DB errors:
  // process.exit(-1);
});

module.exports = pool;
