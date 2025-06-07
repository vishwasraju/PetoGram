import { supabase } from './supabase'
import type { User, UserProfile, UserPet } from './supabase'

// Hash password (simple implementation - in production use proper hashing)
export const hashPassword = (password: string): string => {
  // Simple base64 encoding for demo purposes
  // In production, use proper password hashing like bcrypt
  return btoa(password + 'salt_key_petogram')
}

// Verify password
export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword
}

// Register a new user
export const registerUser = async (userData: {
  fullName: string
  email: string
  password: string
}): Promise<User> => {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', userData.email.toLowerCase())
      .single()

    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash the password
    const hashedPassword = hashPassword(userData.password)

    // Insert new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email: userData.email.toLowerCase(),
        password_hash: hashedPassword,
        full_name: userData.fullName
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return newUser
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An error occurred during registration')
  }
}

// Validate login credentials
export const validateLogin = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return null
    }

    // Verify password
    const isPasswordValid = verifyPassword(password, user.password_hash)
    
    if (!isPasswordValid) {
      return null
    }

    return user
  } catch (error) {
    console.error('Login validation error:', error)
    return null
  }
}

// Get current authenticated user from localStorage
export const getCurrentUser = async (): Promise<User | null> => {
  const userId = localStorage.getItem('currentUserId')
  if (!userId) return null

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Set authentication state
export const setAuthenticationState = (user: User): void => {
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userEmail', user.email)
  localStorage.setItem('currentUserId', user.id)
}

// Clear authentication state
export const clearAuthenticationState = (): void => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('currentUserId')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('tempUserData')
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authStatus = localStorage.getItem('isAuthenticated')
  const userId = localStorage.getItem('currentUserId')
  
  return authStatus === 'true' && userId !== null
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