// Mock authentication utilities without Supabase
export interface AuthUser {
  id: string
  email: string
  user_metadata: {
    full_name?: string
  }
}

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

// Mock user data
const mockUsers: Record<string, { user: AuthUser; profile: UserProfile; pets: UserPet[] }> = {
  'john@example.com': {
    user: {
      id: 'user-1',
      email: 'john@example.com',
      user_metadata: {
        full_name: 'John Doe'
      }
    },
    profile: {
      id: 'profile-1',
      user_id: 'user-1',
      username: 'johndoe',
      bio: 'Proud pet parent to Max 🐕 and Luna 🐱. Love sharing their adventures!',
      profile_picture: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2',
      location: 'New York, NY',
      birth_date: '1990-05-15',
      phone: '+1234567890',
      website: 'https://johndoe.com',
      social_media: {
        instagram: '@johndoe',
        twitter: '@johndoe',
        facebook: 'john.doe'
      },
      interests: ['Pet Photography', 'Dog Training', 'Cat Care'],
      is_public: true,
      allow_messages: true,
      show_email: false,
      created_at: '2023-03-01T00:00:00Z',
      updated_at: '2023-03-01T00:00:00Z'
    },
    pets: [
      {
        id: 'pet-1',
        user_id: 'user-1',
        name: 'Max',
        type: 'dog',
        breed: 'Golden Retriever',
        age: '3 years',
        photo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-03-01T00:00:00Z'
      },
      {
        id: 'pet-2',
        user_id: 'user-1',
        name: 'Luna',
        type: 'cat',
        breed: 'Persian',
        age: '2 years',
        photo: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
        created_at: '2023-03-01T00:00:00Z',
        updated_at: '2023-03-01T00:00:00Z'
      }
    ]
  }
}

// Register a new user (mock implementation)
export const registerUser = async (userData: {
  fullName: string
  email: string
  password: string
}): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if user already exists
    if (mockUsers[userData.email.toLowerCase()]) {
      return { user: null, error: 'This email is already registered. Please try logging in or use a different email.' }
    }

    // Create new user
    const newUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: userData.email.toLowerCase(),
      user_metadata: {
        full_name: userData.fullName
      }
    }

    // Store in mock database
    mockUsers[userData.email.toLowerCase()] = {
      user: newUser,
      profile: {} as UserProfile, // Will be created later
      pets: []
    }

    return { user: newUser, error: null }
  } catch (error) {
    console.error('Registration error:', error)
    return { user: null, error: 'An error occurred during registration' }
  }
}

// Login user (mock implementation)
export const validateLogin = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = mockUsers[email.toLowerCase()]
    
    if (!userData) {
      return { user: null, error: 'Invalid email or password' }
    }

    // In a real app, you'd verify the password here
    // For demo purposes, we'll accept any password
    
    return { user: userData.user, error: null }
  } catch (error) {
    console.error('Login validation error:', error)
    return { user: null, error: 'An error occurred during login' }
  }
}

// Get current authenticated user
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const userEmail = localStorage.getItem('userEmail')
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    
    if (!userEmail || !isAuth) {
      return null
    }

    const userData = mockUsers[userEmail]
    return userData ? userData.user : null
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Set authentication state
export const setAuthenticationState = (user: AuthUser): void => {
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userEmail', user.email)
  localStorage.setItem('currentUserId', user.id)
}

// Clear authentication state
export const clearAuthenticationState = async (): Promise<void> => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('currentUserId')
  localStorage.removeItem('userProfile')
  localStorage.removeItem('tempUserData')
}

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true'
    const userEmail = localStorage.getItem('userEmail')
    return isAuth && userEmail !== null
  } catch (error) {
    return false
  }
}

// Create user profile (mock implementation)
export const createUserProfile = async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail || !mockUsers[userEmail]) {
      throw new Error('User not found')
    }

    const profile: UserProfile = {
      ...profileData,
      id: `profile-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Store in mock database
    mockUsers[userEmail].profile = profile

    return profile
  } catch (error) {
    console.error('Create profile error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An error occurred while creating profile')
  }
}

// Get user profile (mock implementation)
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail || !mockUsers[userEmail]) {
      return null
    }

    return mockUsers[userEmail].profile || null
  } catch (error) {
    console.error('Get user profile error:', error)
    return null
  }
}

// Create user pets (mock implementation)
export const createUserPets = async (pets: Omit<UserPet, 'id' | 'created_at' | 'updated_at'>[]): Promise<UserPet[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail || !mockUsers[userEmail]) {
      throw new Error('User not found')
    }

    const createdPets: UserPet[] = pets.map(pet => ({
      ...pet,
      id: `pet-${Date.now()}-${Math.random()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    // Store in mock database
    mockUsers[userEmail].pets = createdPets

    return createdPets
  } catch (error) {
    console.error('Create pets error:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('An error occurred while creating pets')
  }
}

// Get user pets (mock implementation)
export const getUserPets = async (userId: string): Promise<UserPet[]> => {
  try {
    const userEmail = localStorage.getItem('userEmail')
    if (!userEmail || !mockUsers[userEmail]) {
      return []
    }

    return mockUsers[userEmail].pets || []
  } catch (error) {
    console.error('Get user pets error:', error)
    return []
  }
}