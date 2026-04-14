/*
  # Cambridge ETA Club — Community Tables

  ## New Tables

  1. `newsletter_subscribers`
     - `id` (uuid, primary key)
     - `email` (text, unique) — subscriber email
     - `source` (text) — where they signed up (events, community, etc.)
     - `created_at` (timestamptz)

  2. `contact_submissions`
     - `id` (uuid, primary key)
     - `name` (text)
     - `email` (text)
     - `message` (text)
     - `submission_type` (text)
     - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - INSERT allowed for all (anonymous) users — public facing forms
  - SELECT/UPDATE/DELETE restricted to authenticated (admin) users only
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  submission_type text DEFAULT 'contact_form',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
