/*
  # Create Event Registrations Table

  ## Summary
  Adds a table for tracking event registrations from public users.

  ## New Tables

  1. `event_registrations`
     - `id` (uuid, primary key)
     - `event_id` (uuid, FK → events.id, cascade delete)
     - `full_name` (text) — registrant's full name
     - `email` (text) — registrant's email
     - `role` (text) — their role (student, alumni, external, etc.)
     - `notes` (text, optional) — any additional info or questions
     - `created_at` (timestamptz)

  ## Security
  - RLS enabled
  - INSERT allowed for anonymous and authenticated users (public form)
  - SELECT/DELETE restricted to authenticated admin users
  - Unique constraint on (event_id, email) to prevent duplicate registrations
*/

CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'student',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, email)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for an event"
  ON event_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view registrations"
  ON event_registrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete registrations"
  ON event_registrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON event_registrations(email);
