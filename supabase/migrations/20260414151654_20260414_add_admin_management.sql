/*
  # Enable admin API and add admin user deletion policy

  1. Security
    - Add DELETE policy for admin users (only admins can delete)
    - Enable admin API for user management

  2. Important Notes
    - The admin API allows creation and management of auth users
    - Only authenticated admins can delete admin users
*/

CREATE POLICY "Only admins can delete admin users"
  ON admin_users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = auth.jwt() ->> 'email'
      AND admin_users.role = 'admin'
    )
  );
