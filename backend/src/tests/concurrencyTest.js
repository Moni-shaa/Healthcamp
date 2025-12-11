/**
 * concurrencyTest.js
 *
 * Sends many parallel booking requests to test concurrency safety.
 * Expected: allocated_slots should never exceed total_slots.
 */

const axios = require("axios");

const CAMP_ID = 1; // change if your camp id is different
const REQUESTS = 100; // 100 users trying to book at the same time
const SLOTS_PER_REQUEST = 1;

async function runTest() {
  console.log(`🚀 Sending ${REQUESTS} parallel booking requests...`);

  const promises = [];

  for (let i = 0; i < REQUESTS; i++) {
    promises.push(
      axios
        .post(`http://localhost:4000/api/camps/${CAMP_ID}/book`, {
          user_name: `User_${i}`,
          user_contact: `+91-00000${i}`,
          num_slots: SLOTS_PER_REQUEST,
        })
        .catch((err) => {
          // capture failed requests safely
          return { data: { status: "FAILED", error: err.message } };
        })
    );
  }

  const results = await Promise.all(promises);

  const confirmed = results.filter((r) => r.data.status === "CONFIRMED").length;
  const failed = results.filter((r) => r.data.status === "FAILED").length;

  console.log("\n===== TEST RESULTS =====");
  console.log("Confirmed bookings:", confirmed);
  console.log("Failed bookings:", failed);
  console.log("========================\n");

  console.log("✔ If confirmed <= total_slots (50), concurrency is correct.");
}

runTest();
