/*
  # Fix admin_users recursive RLS policy

  ## Problem
  The SELECT policy on admin_users was self-referential: it queried admin_users
  to check if the requester is an admin, but that subquery itself triggers the
  SELECT policy, causing infinite recursion that always resolves to false.

  This meant the events UPDATE/INSERT/DELETE policies (which SELECT from admin_users
  to verify admin status) always failed with a permission error.

  ## Fix
  Replace the recursive SELECT policy with one that reads directly from auth.jwt()
  app_metadata, or simply allows any authenticated user to read admin_users rows
  where their own email matches — breaking the recursion.
*/

DROP POLICY IF EXISTS "Only admins can manage admin users" ON admin_users;

CREATE POLICY "Admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
