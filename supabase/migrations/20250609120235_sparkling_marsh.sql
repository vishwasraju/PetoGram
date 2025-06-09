/*
  # Remove unnecessary users table policy

  This migration file has been updated to remove the policy creation
  that was referencing a non-existent 'users' table.
  
  Supabase handles user registration through its built-in auth.users table
  and doesn't require custom policies for public registration.
*/

-- No SQL statements needed - Supabase handles user registration automatically
-- through its built-in authentication system