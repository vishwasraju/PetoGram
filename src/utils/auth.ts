// Authentication utility functions
export interface User {
  id: string
  fullName: string
  email: string
  password: string
  createdAt: string
}

export interface UserProfile {
  profilePicture: string
  username: string
  bio: string
  location: string
  birthDate: string
  phone: string
  website: string
  socialMedia: {
    instagram: string
    twitter: string
    facebook: string
  }
  pets: Array<{
    id: string
    name: string
    type: string
    breed: string
    age: string
    photo: string
  }>
  interests: string[]
  isPublic: boolean
  allowMessages: boolean
  showEmail: boolean
}

// Get all registered users from localStorage
export const getRegisteredUsers = (): User[] => {
  const users = localStorage.getItem('registeredUsers')
  return users ? JSON.parse(users) : []
}

// Save users to localStorage
export const saveRegisteredUsers = (users: User[]): void => {
  localStorage.setItem('registeredUsers', JSON.stringify(users))
}

// Register a new user
export const registerUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getRegisteredUsers()
  
  // Check if user already exists
  const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase())
  if (existingUser) {
    throw new Error('User with this email already exists')
  }
  
  // Create new user
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }
  
  // Add to users array and save
  users.push(newUser)
  saveRegisteredUsers(users)
  
  return newUser
}

// Validate login credentials
export const validateLogin = (email: string, password: string): User | null => {
  const users = getRegisteredUsers()
  const user = users.find(user => 
    user.email.toLowerCase() === email.toLowerCase() && 
    user.password === password
  )
  return user || null
}

// Get current authenticated user
export const getCurrentUser = (): User | null => {
  const userEmail = localStorage.getItem('userEmail')
  if (!userEmail) return null
  
  const users = getRegisteredUsers()
  return users.find(user => user.email === userEmail) || null
}

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
  const userEmail = localStorage.getItem('userEmail')
  
  if (authStatus !== 'true' || !userEmail) {
    return false
  }
  
  // Verify user still exists in registered users
  const currentUser = getCurrentUser()
  return currentUser !== null
}