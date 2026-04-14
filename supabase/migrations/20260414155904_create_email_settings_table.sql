/*
  # Create email_settings table

  1. New Tables
    - `email_settings`
      - `id` (uuid, primary key)
      - `key` (text, unique) - setting identifier e.g. 'welcome_email'
      - `subject` (text) - email subject line
      - `body` (text) - email body (plain text / HTML)
      - `admin_notification_email` (text) - where to send admin notifications
      - `updated_at` (timestamp)

  2. Seed default welcome email and admin notification settings

  3. Security
    - Enable RLS
    - Only authenticated users (admins) can read/update
*/

CREATE TABLE IF NOT EXISTS email_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  admin_notification_email text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read email settings"
  ON email_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update email settings"
  ON email_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO email_settings (key, subject, body, admin_notification_email)
VALUES (
  'welcome_email',
  'Welcome to the Cambridge ETA Community!',
  'Hi {{full_name}},

Thank you for joining the Cambridge ETA community! We''re delighted to have you with us.

At Cambridge ETA Club, we bring together searchers, investors, operators, and advisors who share a passion for entrepreneurship through acquisition.

Here''s what you can expect from us:
- Updates on upcoming events and networking opportunities
- Access to exclusive resources and case studies
- Connections with fellow ETA practitioners

We''ll be in touch soon with more information.

Best regards,
The Cambridge ETA Team',
  ''
)
ON CONFLICT (key) DO NOTHING;
