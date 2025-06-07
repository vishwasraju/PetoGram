import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
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
import { supabase } from './utils/supabase'

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

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuth(!!session?.user)
        
        if (event === 'SIGNED_OUT') {
          // Clear any local storage when user signs out
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('userEmail')
          localStorage.removeItem('currentUserId')
          localStorage.removeItem('userProfile')
          localStorage.removeItem('tempUserData')
        }
      }
    )

    return () => subscription.unsubscribe()
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
        element={isAuth ? <Navigate to="/home\" replace /> : <IntroPage />} 
      />
      <Route 
        path="/create-profile" 
        element={isAuth ? <Navigate to="/home\" replace /> : <CreateProfilePage />} 
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
        element={isAuth ? <EnhancedHome /> : <Navigate to="/\" replace />} 
      />
      <Route 
        path="/profile" 
        element={isAuth ? <Profile /> : <Navigate to="/\" replace />} 
      />
      <Route 
        path="/messages" 
        element={isAuth ? <Messages /> : <Navigate to="/\" replace />} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App