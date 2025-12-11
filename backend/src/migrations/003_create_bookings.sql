-- 003_create_bookings.sql
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
    CREATE TYPE booking_status AS ENUM ('PENDING','CONFIRMED','FAILED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  camp_id INTEGER REFERENCES camps(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_contact TEXT,
  num_slots INTEGER NOT NULL CHECK (num_slots > 0),
  status booking_status NOT NULL DEFAULT 'PENDING',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_camp_id ON bookings(camp_id);
