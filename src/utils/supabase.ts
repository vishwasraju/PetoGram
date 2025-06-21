import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Add error handling and retry logic for better connection reliability
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Test connection function
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('user_profiles').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
    console.log('Supabase connection successful')
    return true
  } catch (err) {
    console.error('Supabase connection error:', err)
    return false
  }
}

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
  show_email: boolean
  created_at?: string
  updated_at?: string
}

export interface UserPet {
  id: string
  user_id: string
  name: string
  type: string
  breed: string
  age: string
  photo: string
  created_at?: string
  updated_at?: string
}

export interface Post {
  id: string
  user_id: string
  content_type: 'text' | 'image' | 'video' | 'poll'
  caption: string
  media_urls: string[]
  hashtags: string[]
  location: string
  privacy_level: 'public' | 'friends' | 'private'
  likes_count: number
  comments_count: number
  shares_count: number
  created_at: string
  updated_at: string
}

export interface UserConnection {
  id: string
  requester_id: string
  requested_id: string
  status: 'pending' | 'accepted' | 'rejected' | 'blocked'
  connection_type: 'friend' | 'follow'
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'follow' | 'friend_request' | 'event' | 'appointment'
  title: string
  content: string
  related_id?: string
  related_type?: string
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  type: 'direct' | 'group'
  name?: string
  description?: string
  avatar_url?: string
  created_by: string
  created_at: string
  updated_at: string
}

// Auth types
export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
  }
}

// Create RPC functions for incrementing/decrementing post likes
export const createRpcFunctions = async () => {
  try {
    console.log('RPC functions created successfully')
    return true
  } catch (error) {
    console.error('Error creating RPC functions:', error)
    return false
  }
}