import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import SignupPage from './pages/SignupPage'
import CreateProfilePage from './pages/CreateProfilePage'
import EnhancedHome from './pages/EnhancedHome'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import CareersPage from './pages/CareersPage'
import BlogPage from './pages/BlogPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import HelpCenterPage from './pages/HelpCenterPage'
import { getCurrentUser } from './utils/auth'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial authentication status
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser()
        setIsAuth(!!user)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuth(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()

    // Listen for auth state changes via localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        setIsAuth(e.newValue === 'true')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
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
        path="/signup" 
        element={isAuth ? <Navigate to="/home" replace /> : <SignupPage />} 
      />
      <Route 
        path="/create-profile" 
        element={isAuth ? <Navigate to="/home" replace /> : <CreateProfilePage />} 
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/careers" element={<CareersPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/help" element={<HelpCenterPage />} />
      
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