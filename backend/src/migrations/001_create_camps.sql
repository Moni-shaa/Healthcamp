-- 001_create_camps.sql
CREATE TABLE IF NOT EXISTS camps (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP NOT NULL,
  total_slots INTEGER NOT NULL CHECK (total_slots >= 0),
  created_at TIMESTAMP DEFAULT now()
);
