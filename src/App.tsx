import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, Link, Navigate } from 'react-router-dom'
import IntroPage from './pages/IntroPage'
import EnhancedHome from './pages/EnhancedHome'
import Profile from './pages/Profile'
import Events from './pages/Events'
import Appointment from './pages/Appointment'

import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import CareersPage from './pages/CareersPage'
import BlogPage from './pages/BlogPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import EditProfilePage from './pages/EditProfilePage'
import PasswordChangePage from './pages/PasswordChangePage'
import DeleteAccountPage from './pages/DeleteAccountPage'
import UserProfilePage from './pages/UserProfilePage'
// Import new pages
import EventsPage from './pages/EventsPage'
import AppointmentPage from './pages/AppointmentPage'
import SettingsPage from './pages/SettingsPage'
import CreatePostPage from './pages/CreatePostPage'
import ProfileInfoCardPage from './pages/ProfileInfoCardPage'
import ChatPage from './pages/ChatPage'
import { isAuthenticated } from './utils/auth'
import { supabase } from './utils/supabase'

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSigningUp, setIsSigningUp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      setIsAuth(authenticated)
      
      setLoading(false)
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuth(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Programmatic navigation based on authentication status
  useEffect(() => {
    if (!loading && !isSigningUp) { 
      if (isAuth) {
        // Only navigate to /home if not already on /home or other protected routes
        const protectedRoutes = [
          '/home', '/feed', '/events-page', '/appointment-page', 
          '/settings', '/create-post', '/profile', '/events', '/appointment', 
          
          '/chat'
        ]
        if (!protectedRoutes.some(route => window.location.pathname.startsWith(route))) {
          setTimeout(() => {
            navigate('/home', { replace: false })
          }, 0); // Use setTimeout with 0ms to defer navigation
        }
      } else {
        const publicRoutes = ['/', '/about', '/careers', '/blog', '/terms']
        if (!publicRoutes.includes(window.location.pathname)) {
          setTimeout(() => {
            navigate('/', { replace: false })
          }, 0); // Use setTimeout with 0ms to defer navigation
        }
      }
    }
  }, [isAuth, loading, navigate, isSigningUp])

  if (loading) {
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
    <div>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={<IntroPage onSignupStart={() => setIsSigningUp(true)} onSignupComplete={() => setIsSigningUp(false)} />} 
        />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        
        {/* Protected Routes - Original */}
        <Route 
          path="/home" 
          element={<EnhancedHome />} 
        />
        <Route 
          path="/profile" 
          element={<Profile />} 
        />
        <Route 
          path="/events" 
          element={<Events />} 
        />
        <Route 
          path="/appointment" 
          element={<Appointment />} 
        />
       
        
        {/* New dedicated pages */}
        <Route 
          path="/events-page" 
          element={<EventsPage />} 
        />
        <Route 
          path="/appointment-page" 
          element={<AppointmentPage />} 
        />
        <Route 
          path="/settings" 
          element={<SettingsPage />} 
        />
        <Route 
          path="/create-post" 
          element={<CreatePostPage />} 
        />
        
        {/* User Profile and Account Management */}
        <Route 
          path="/user-profile/:userId" 
          element={<UserProfilePage />} 
        />
        <Route 
          path="/edit-profile" 
          element={<EditProfilePage />} 
        />
        <Route 
          path="/change-password" 
          element={<PasswordChangePage />} 
        />
        <Route 
          path="/delete-account" 
          element={<DeleteAccountPage />} 
        />
        
        {/* New dedicated profile card page */}
        <Route 
          path="/profile-info" 
          element={<ProfileInfoCardPage />} 
        />
        
        {/* New chat page */}
        <Route 
          path="/chat" 
          element={<ChatPage />} 
        />
        
        {/* Catch all for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App