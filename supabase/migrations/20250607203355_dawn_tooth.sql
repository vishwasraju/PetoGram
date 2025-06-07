-- PetoGram Database Schema
-- Run this in your Supabase SQL Editor

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text UNIQUE,
  bio text DEFAULT '',
  profile_picture text DEFAULT '',
  location text DEFAULT '',
  birth_date date,
  phone text DEFAULT '',
  website text DEFAULT '',
  social_media jsonb DEFAULT '{"instagram": "", "twitter": "", "facebook": ""}',
  interests text[] DEFAULT '{}',
  is_public boolean DEFAULT true,
  allow_messages boolean DEFAULT true,
  show_email boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Pets Table
CREATE TABLE IF NOT EXISTS user_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  breed text DEFAULT '',
  age text DEFAULT '',
  photo text DEFAULT '',
  about text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Public profiles are viewable" ON user_profiles
  FOR SELECT USING (is_public = true);

-- RLS Policies for user_pets
CREATE POLICY "Users can read own pets" ON user_pets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets" ON user_pets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets" ON user_pets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets" ON user_pets
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_pets_user_id ON user_pets(user_id);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_pets_updated_at
  BEFORE UPDATE ON user_pets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();