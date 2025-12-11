/**
 * runMigrations.js
 * Executes all .sql files inside src/migrations in alphabetical order.
 */

const fs = require("fs");
const path = require("path");
const pool = require("../services/dbPool");

async function run() {
  const migrationsDir = path.join(__dirname, "..", "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.error("❌ Migrations folder not found:", migrationsDir);
    process.exit(1);
  }

  // Read .sql files and sort by name
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("⚠️ No migration files found.");
    return;
  }

  const client = await pool.connect();
  try {
    console.log(`🚀 Running ${files.length} migration(s)...`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`\n📄 Executing: ${file}`);
      await client.query(sql);
      console.log(`✔ Completed: ${file}`);
    }

    console.log("\n🎉 All migrations completed successfully!\n");
  } catch (err) {
    console.error("❌ Migration failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
