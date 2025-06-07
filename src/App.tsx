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
import { isAuthenticated } from './utils/auth'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const authStatus = isAuthenticated()
      setIsAuth(authStatus)
      setIsLoading(false)
    }
    
    checkAuth()
  }, [])

  // Listen for authentication changes
  useEffect(() => {
    const handleStorageChange = () => {
      const authStatus = isAuthenticated()
      setIsAuth(authStatus)
    }

    // Listen for storage changes (for logout functionality)
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for changes within the same tab
    const interval = setInterval(() => {
      const authStatus = isAuthenticated()
      setIsAuth(authStatus)
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
        element={isAuth ? <Navigate to="/home" replace /> : <IntroPage />} 
      />
      <Route 
        path="/login" 
        element={isAuth ? <Navigate to="/home" replace /> : <LoginPage />} 
      />
      <Route 
        path="/signup" 
        element={isAuth ? <Navigate to="/home" replace /> : <SignupPage />} 
      />
      <Route 
        path="/create-profile" 
        element={isAuth ? <Navigate to="/home" replace /> : <CreateProfilePage />} 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/home" 
        element={isAuth ? <EnhancedHome /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuth ? <Profile /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/messages" 
        element={isAuth ? <Messages /> : <Navigate to="/" replace />} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App