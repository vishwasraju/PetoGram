import { supabase } from './supabase'
import type { UserProfile, UserPet, AuthUser } from './supabase'

// Register a new user using Supabase Auth
export const registerUser = async (userData: {
  fullName: string
  email: string
  password: string
}): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
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
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: 'Failed to create user account' }
    }

    return { user: data.user as AuthUser, error: null }
  } catch (error) {
    console.error('Registration error:', error)
    return { user: null, error: 'An error occurred during registration' }
  }
}

// Login user using Supabase Auth
export const validateLogin = async (email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: 'Login failed' }
    }

    return { user: data.user as AuthUser, error: null }
  } catch (error) {
    console.error('Login validation error:', error)
    return { user: null, error: 'An error occurred during login' }
  }
}

// Get current authenticated user from Supabase Auth
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user as AuthUser
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

// Set authentication state
export const setAuthenticationState = (user: AuthUser): void => {
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userEmail', user.email || '')
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
    console.error('Create profile error:', error)
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

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return profile
  } catch (error) {
    console.error('Update profile error:', error)
    return null
  }
}

// Create user pets
export const createUserPets = async (userId: string, pets: Array<{
  name: string;
  type: string;
  breed?: string;
  age?: string;
  photo?: string;
}>): Promise<UserPet[]> => {
  try {
    const petsWithUserId = pets.map(pet => ({
      ...pet,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('user_pets')
      .insert(petsWithUserId)
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Create pets error:', error)
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

// Friend request functions
export const sendFriendRequest = async (requesterId: string, requestedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_connections')
      .insert({
        requester_id: requesterId,
        requested_id: requestedId,
        status: 'pending',
        connection_type: 'friend'
      })

    if (error) throw error

    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: requestedId,
        type: 'friend_request',
        title: 'New Friend Request',
        content: 'Someone sent you a friend request',
        related_id: requesterId,
        related_type: 'user'
      })

    return true
  } catch (error) {
    console.error('Send friend request error:', error)
    return false
  }
}

export const acceptFriendRequest = async (requesterId: string, requestedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_connections')
      .update({ status: 'accepted' })
      .eq('requester_id', requesterId)
      .eq('requested_id', requestedId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Accept friend request error:', error)
    return false
  }
}

export const removeFriend = async (userId1: string, userId2: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_connections')
      .delete()
      .or(`and(requester_id.eq.${userId1},requested_id.eq.${userId2}),and(requester_id.eq.${userId2},requested_id.eq.${userId1})`)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Remove friend error:', error)
    return false
  }
}

// Post functions
export const createPost = async (postData: {
  user_id: string
  content_type: string
  caption: string
  media_urls?: string[]
  hashtags?: string[]
  location?: string
  privacy_level?: string
  poll_question?: string
  poll_options?: any
  poll_expires_at?: string
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('posts')
      .insert(postData)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Create post error:', error)
    return false
  }
}

export const likePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: userId
      })

    if (error) throw error

    // Update likes count
    await supabase.rpc('increment_post_likes', { post_id: postId })
    
    return true
  } catch (error) {
    console.error('Like post error:', error)
    return false
  }
}

export const unlikePost = async (postId: string, userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId)

    if (error) throw error

    // Update likes count
    await supabase.rpc('decrement_post_likes', { post_id: postId })
    
    return true
  } catch (error) {
    console.error('Unlike post error:', error)
    return false
  }
}

// Event registration
export const registerForEvent = async (userId: string, eventId: string, email: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('event_registrations')
      .insert({
        user_id: userId,
        event_id: eventId,
        email,
        status: 'registered'
      })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Event registration error:', error)
    return false
  }
}

// Appointment booking
export const bookAppointment = async (appointmentData: {
  user_id: string
  appointment_type: string
  veterinarian_name: string
  appointment_date: string
  appointment_time: string
  pet_name: string
  pet_type: string
  notes?: string
}): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('appointment_bookings')
      .insert(appointmentData)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Book appointment error:', error)
    return false
  }
}

// Block user
export const blockUser = async (blockerId: string, blockedId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_blocks')
      .insert({
        blocker_id: blockerId,
        blocked_id: blockedId
      })

    if (error) throw error

    // Remove any existing connections
    await supabase
      .from('user_connections')
      .delete()
      .or(`and(requester_id.eq.${blockerId},requested_id.eq.${blockedId}),and(requester_id.eq.${blockedId},requested_id.eq.${blockerId})`)

    return true
  } catch (error) {
    console.error('Block user error:', error)
    return false
  }
}

// Delete account
export const deleteUserAccount = async (userId: string): Promise<boolean> => {
  try {
    // Delete user data from custom tables
    await supabase.from('user_profiles').delete().eq('user_id', userId)
    await supabase.from('user_pets').delete().eq('user_id', userId)
    await supabase.from('posts').delete().eq('user_id', userId)
    await supabase.from('user_connections').delete().or(`requester_id.eq.${userId},requested_id.eq.${userId}`)
    await supabase.from('notifications').delete().eq('user_id', userId)
    await supabase.from('event_registrations').delete().eq('user_id', userId)
    await supabase.from('appointment_bookings').delete().eq('user_id', userId)
    await supabase.from('user_blocks').delete().or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)
    await supabase.from('user_privacy_settings').delete().eq('user_id', userId)

    return true
  } catch (error) {
    console.error('Delete account error:', error)
    return false
  }
}