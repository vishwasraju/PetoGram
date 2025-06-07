/*
  # Remove custom users table and use Supabase Auth

  This migration removes the custom users table since we're switching to use Supabase's built-in authentication system.

  1. Changes
    - Drop the custom users table
    - Update user_profiles table to reference auth.users instead
    - Update user_pets table to reference auth.users instead
    - Update RLS policies to work with Supabase Auth

  2. Security
    - All RLS policies updated to use auth.uid() instead of custom user ID
*/

-- Drop existing foreign key constraints
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_user_id_fkey;
ALTER TABLE user_pets DROP CONSTRAINT IF EXISTS user_pets_user_id_fkey;

-- Update user_profiles table to reference auth.users
ALTER TABLE user_profiles 
ALTER COLUMN user_id SET DATA TYPE uuid;

-- Update user_pets table to reference auth.users  
ALTER TABLE user_pets 
ALTER COLUMN user_id SET DATA TYPE uuid;

-- Add foreign key constraints to reference auth.users
ALTER TABLE user_profiles 
ADD CONSTRAINT user_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_pets 
ADD CONSTRAINT user_pets_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the custom users table
DROP TABLE IF EXISTS users CASCADE;

-- Update RLS policies for user_profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;

CREATE POLICY "Profiles are viewable by everyone"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update RLS policies for user_pets
DROP POLICY IF EXISTS "Pets are viewable by everyone" ON user_pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON user_pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON user_pets;
DROP POLICY IF EXISTS "Users can update own pets" ON user_pets;

CREATE POLICY "Pets are viewable by everyone"
  ON user_pets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own pets"
  ON user_pets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
  ON user_pets
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
  ON user_pets
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);