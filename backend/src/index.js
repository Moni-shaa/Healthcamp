/**
 * src/index.js
 * Entry point for the backend server.
 * Loads environment variables and starts the Express app.
 *
 * Note: `src/app.js` will be created in the next step.
 */

require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `🚀 HealthCamp backend listening on http://localhost:${PORT} (env PORT=${PORT})`
  );
});
