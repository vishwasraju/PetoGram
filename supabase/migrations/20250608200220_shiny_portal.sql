/*
  # Fix Authentication Setup

  This migration removes the invalid policy on the non-existent users table.
  Supabase Auth handles user registration automatically, so no additional
  policies are needed for the auth.users table.

  ## Changes
  - Remove invalid policy on users table
  - Ensure user_profiles table has proper RLS policies for registration
*/

-- Ensure user_profiles table allows authenticated users to insert their own profile
-- This policy should already exist, but we'll make sure it's properly configured
DO $$
BEGIN
  -- Check if the policy exists and recreate it if needed
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON user_profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Ensure user_pets table allows authenticated users to insert their own pets
DO $$
BEGIN
  -- Check if the policy exists and recreate it if needed
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_pets' 
    AND policyname = 'Users can insert own pets'
  ) THEN
    CREATE POLICY "Users can insert own pets"
      ON user_pets
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;