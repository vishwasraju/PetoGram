/*
  # Remove all tables and dependencies

  This migration removes all custom tables and their dependencies from the database:
  
  1. Drop Tables
     - user_profiles
     - user_pets
  
  2. Drop Functions
     - update_updated_at_column()
  
  3. Drop Indexes
     - All custom indexes
  
  4. Drop Policies
     - All RLS policies on custom tables
*/

-- Drop all policies first
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

DROP POLICY IF EXISTS "Pets are viewable by everyone" ON user_pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON user_pets;
DROP POLICY IF EXISTS "Users can update own pets" ON user_pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON user_pets;

-- Drop triggers
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TRIGGER IF EXISTS update_user_pets_updated_at ON user_pets;

-- Drop indexes
DROP INDEX IF EXISTS idx_user_profiles_user_id;
DROP INDEX IF EXISTS idx_user_profiles_username;
DROP INDEX IF EXISTS idx_user_pets_user_id;

-- Drop tables (CASCADE will remove foreign key constraints)
DROP TABLE IF EXISTS user_pets CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;