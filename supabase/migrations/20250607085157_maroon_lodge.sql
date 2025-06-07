/*
  # User Management Schema

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `username` (text, unique)
      - `bio` (text)
      - `profile_picture` (text)
      - `location` (text)
      - `birth_date` (date)
      - `phone` (text)
      - `website` (text)
      - `social_media` (jsonb)
      - `interests` (text array)
      - `is_public` (boolean)
      - `allow_messages` (boolean)
      - `show_email` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_pets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `type` (text)
      - `breed` (text)
      - `age` (text)
      - `photo` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Allow public read access to profiles and pets (for social features)

  3. Performance
    - Add indexes on frequently queried columns
    - Add triggers for automatic timestamp updates
*/

-- Create user_profiles table
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

-- Create user_pets table
CREATE TABLE IF NOT EXISTS user_pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text NOT NULL,
  breed text DEFAULT '',
  age text DEFAULT '',
  photo text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pets ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles table
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

-- Create policies for user_pets table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_pets_user_id ON user_pets(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_pets_updated_at BEFORE UPDATE ON user_pets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();