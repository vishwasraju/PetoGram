import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateLogin, setAuthenticationState } from '../utils/auth'
import SignupModal from '../components/SignupModal'

interface IntroPageProps {
  onSignupStart: () => void;
  onSignupComplete: () => void;
}

export default function IntroPage({ onSignupStart, onSignupComplete }: IntroPageProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isLogoGlowing, setIsLogoGlowing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      const { user, error } = await validateLogin(formData.email, formData.password)
      
      if (error || !user) {
        setErrors({ general: error || 'Login failed. Please try again.' })
        setIsLoading(false)
        return
      }
      
      setAuthenticationState(user)
      
      setIsLoading(false)
      
      // Introduce a small delay to allow App.tsx to update auth state
      setTimeout(() => {
        navigate('/home', { replace: true })
      }, 100); // 100ms delay
      
    } catch (error) {
      setIsLoading(false)
      console.error('Login error:', error)
      setErrors({ general: 'An error occurred during login. Please try again.' })
    }
  }

  const handleSignupClick = () => {
    setIsSignupModalOpen(true)
    setIsLogoGlowing(true)
    onSignupStart()
  }

  const handleSignupModalClose = () => {
    setIsSignupModalOpen(false)
    setIsLogoGlowing(false)
    onSignupComplete()
  }

  const handleSignupConfirm = () => {
    setIsSignupModalOpen(false)
    setIsLogoGlowing(false)
    onSignupComplete()
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000', // Black background
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>
      {/* Minimal Header */}
      <header style={{
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1 style={{
          margin: 0,
          // Original font family for PetoGram logo
          fontSize: '36px',
          fontWeight: 'normal',
          fontFamily: '"Billabong", cursive',
          color: '#fff',
        }}>
          <img 
            src="/images/logoo.jpg" 
            alt="PetoGram Logo" 
            style={{
              height: '69px', // Adjust size as needed
              width: 'auto',
              filter: 'invert(1)', // To make it white on dark background if needed
              ...(isLogoGlowing && { animation: 'glow 1.5s infinite alternate' }),
            }}
          />
        </h1>
      </header>

      <main style={{
        flexGrow: 100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        flexWrap: 'wrap', // Allow items to wrap on smaller screens
      }}>
        {/* Left Column: Image Display Placeholder */}
        <div className="intro-image-column" style={{
          width: '350px', // Fixed width for desktop
          height: '350px',
          backgroundColor: '#000',
          borderRadius: '8px',
          marginRight: '40px', // Margin for desktop view
          marginBottom: '20px', // Add margin-bottom for spacing when stacked
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          color: '#8e8e8e',
          // Responsive adjustments
          maxWidth: '100%', // Ensure it doesn't exceed 100% width on smaller screens
          boxSizing: 'border-box',
          
        }}>
          {/* This will eventually be an image carousel/display */}
          <img 
            src="/images/intro.png" 
            alt="PetoGram Intro Display" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
          />
        </div>

        {/* Right Column: Login/Signup Form */}
        <div className="intro-login-column" style={{
          display: 'flex',
          
          flexDirection: 'column',
          gap: '2px',
          width: '300px', // Fixed width for desktop
          // Responsive adjustments
          maxWidth: 'calc(100% - 40px)', // Ensure it doesn't exceed 100% width on smaller screens, accounting for padding
          boxSizing: 'border-box',
          
        }}>
          {/* Login Box */}
          <div style={{
            backgroundColor: '#000',
            padding: '40px 30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <h1 style={{
              margin: '0 0 20px 0',
              fontSize: '36px',
              fontWeight: 'normal',
              fontFamily: '"Billabong", cursive', // Placeholder for Instagram-like font
              color: '#fff',
            }}>
              PetoGram
            </h1>
            <input
              type="text"
              name="email"
              placeholder="Phone number, username, or email"
              value={formData.email}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '6px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #363636',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #363636',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '8px 16px',
                backgroundColor: '#0095f6',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                opacity: isLoading ? 0.5 : 1, // Instagram-like disabled state initially
              }}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>

            {errors.general && (
              <p style={{
                color: 'red',
                fontSize: '12px',
                marginTop: '10px',
              }}>{errors.general}</p>
            )}

            {/* Sign Up Box */}
            <div style={{
              backgroundColor: '#000',
              
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              fontSize: '14px',
              marginTop: '10px',
            }}>
              Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleSignupClick(); }} style={{
                color: '#0095f6',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}>Sign up</a>
            </div>

            {/* Add global styles for glow effect and responsive adjustments */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes glow {
                  0% { box-shadow: 0 0 5px #0095f6; }
                  50% { box-shadow: 0 0 20px #0095f6, 0 0 30px #0095f6; }
                  100% { box-shadow: 0 0 5px #0095f6; }
                }
                .logo-glow {
                  animation: glow 1.5s infinite alternate;
                }

                @media (max-width: 768px) {
                  main {
                    padding: 10px !important;
                  }
                  .intro-image-column {
                    margin-right: 0 !important;
                    width: calc(100% - 20px) !important;
                    height: 320px !important; /* Adjusted height for larger image */
                  }
                  .intro-login-column {
                    width: calc(100% - 20px) !important;
                  }
                }
              ` }} />
          </div>
        </div>
      </main>

      <footer style={{
        padding: '20px',
        fontSize: '12px',
        textAlign: 'center',
        color: '#8e8e8e',
        marginTop: '20px',
      }}>
        <nav>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: '0 0 10px 0',
            display: 'flex',
            justifyContent: 'center',
            gap: '15px',
          }}>
            <li><a href="/about" style={{ color: '#8e8e8e', textDecoration: 'none' }}>About</a></li>
            <li><a href="/privacy" style={{ color: '#8e8e8e', textDecoration: 'none' }}>Privacy</a></li>
            <li><a href="/terms" style={{ color: '#8e8e8e', textDecoration: 'none' }}>Terms</a></li>
          </ul>
        </nav>
        <p>© 2024 PetoGram from Meta</p>
      </footer>

      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={handleSignupModalClose} 
        onConfirm={handleSignupConfirm}
      />

    </div>
  )
}