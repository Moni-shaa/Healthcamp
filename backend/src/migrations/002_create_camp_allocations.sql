-- 002_create_camp_allocations.sql
CREATE TABLE IF NOT EXISTS camp_allocations (
  camp_id INTEGER PRIMARY KEY REFERENCES camps(id) ON DELETE CASCADE,
  allocated_slots INTEGER NOT NULL DEFAULT 0,
  CHECK (allocated_slots >= 0)
);
