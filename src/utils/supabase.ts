import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  user_id: string
  username?: string
  bio: string
  profile_picture: string
  location: string
  birth_date?: string
  phone: string
  website: string
  social_media: {
    instagram: string
    twitter: string
    facebook: string
  }
  interests: string[]
  is_public: boolean
  allow_messages: boolean
  show_email: boolean
  created_at: string
  updated_at: string
}

export interface UserPet {
  id: string
  user_id: string
  name: string
  type: string
  breed: string
  age: string
  photo: string
  created_at: string
  updated_at: string
}

// Auth types
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}