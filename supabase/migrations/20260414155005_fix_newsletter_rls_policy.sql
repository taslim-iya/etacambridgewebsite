/*
  # Fix newsletter subscribers RLS policy

  1. Security
    - Update INSERT policy to allow anonymous users (unauthenticated) to subscribe
    - This is needed because the mailing-list edge function uses the anon key, not a service role
*/

DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe to newsletter"
  ON newsletter_subscribers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
