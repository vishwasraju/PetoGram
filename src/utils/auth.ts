import { supabase } from './supabase'
import type { User, UserProfile, UserPet } from './supabase'

// Register a new user using Supabase Auth
export const registerUser = async (userData: {
  fullName: string
  email: string
  password: string
}): Promise<{ user: any; error: any }> => {
  try {
    // Use Supabase Auth to create user
    const { data, error } = await supabase.auth.signUp({
      email: userData.email.toLowerCase(),
      password: userData.password,
      options: {
        data: {
          full_name: userData.fullName
        }
      }
    })

    if (error) {
      throw new Error(error.message)
    }

    return { user: data.user, error: null }
  } catch (error) {
    if (error instanceof Error) {
      return { user: null, error: error.message }
    }
    return { user: null, error: 'An error occurred during registration' }
  }
}

// Login user using Supabase Auth
export const validateLogin = async (email: string, password: string): Promise<{ user: any; error: any }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (error) {
    console.error('Login validation error:', error)
    return { user: null, error: 'An error occurred during login' }
  }
}

// Get current authenticated user from Supabase Auth
export const getCurrentUser = async (): Promise<any> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Set authentication state (now handled by Supabase Auth automatically)
export const setAuthenticationState = (user: any): void => {
  // Supabase Auth handles session management automatically
  // We can still store some user info in localStorage if needed
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userEmail', user.email)
  localStorage.setItem('currentUserId', user.id)
}

// Clear authentication state and sign out
export const clearAuthenticationState = async (): Promise<void> => {
  await supabase.auth.signOut()
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('currentUserId')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('tempUserData')
}

// Check if user is authenticated using Supabase Auth
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user !== null
  } catch (error) {
    return false
  }
}

// Create user profile
export const createUserProfile = async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .insert(profileData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return profile
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An error occurred while creating profile')
  }
}

// Get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return null
    }

    return profile
  } catch (error) {
    console.error('Get user profile error:', error)
    return null
  }
}

// Create user pets
export const createUserPets = async (pets: Omit<UserPet, 'id' | 'created_at' | 'updated_at'>[]): Promise<UserPet[]> => {
  try {
    const { data: createdPets, error } = await supabase
      .from('user_pets')
      .insert(pets)
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return createdPets
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An error occurred while creating pets')
  }
}

// Get user pets
export const getUserPets = async (userId: string): Promise<UserPet[]> => {
  try {
    const { data: pets, error } = await supabase
      .from('user_pets')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      throw new Error(error.message)
    }

    return pets || []
  } catch (error) {
    console.error('Get user pets error:', error)
    return []
  }
}