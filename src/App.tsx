import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import CreateProfilePage from './pages/CreateProfilePage'
import EnhancedHome from './pages/EnhancedHome'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem('isAuthenticated')
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem('isAuthenticated')
      setIsAuthenticated(authStatus === 'true')
    }

    // Listen for storage changes (for logout functionality)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for changes within the same tab
    const interval = setInterval(() => {
      const authStatus = localStorage.getItem('isAuthenticated')
      setIsAuthenticated(authStatus === 'true')
    }, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #E5E7EB',
          borderTop: '4px solid #8B5CF6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <IntroPage />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <SignupPage />} 
      />
      <Route 
        path="/create-profile" 
        element={isAuthenticated ? <Navigate to="/home" replace /> : <CreateProfilePage />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/home" 
        element={isAuthenticated ? <EnhancedHome /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuthenticated ? <Profile /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/messages" 
        element={isAuthenticated ? <Messages /> : <Navigate to="/" replace />} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App