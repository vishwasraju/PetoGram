/*
  # Add public registration policy

  1. Security Changes
    - Add policy to allow unauthenticated users to register (insert into users table)
    - This enables the signup functionality without requiring authentication
*/

-- Allow public registration by permitting unauthenticated users to insert into users table
CREATE POLICY "Allow public registration"
  ON users
  FOR INSERT
  WITH CHECK (true);