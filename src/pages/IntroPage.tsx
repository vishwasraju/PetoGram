import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validateLogin, setAuthenticationState, registerUser } from '../utils/auth'

export default function IntroPage() {
  const navigate = useNavigate()
  const [isSignupMode, setIsSignupMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
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

    if (isSignupMode && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (isSignupMode && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (isSignupMode && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (isSignupMode && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      if (isSignupMode) {
        // Handle signup
        const { user, error } = await registerUser({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
        
        if (error || !user) {
          setErrors({ general: error || 'Registration failed. Please try again.' })
          setIsLoading(false)
          return
        }
        
        // Store temporary user data for profile creation
        localStorage.setItem('tempUserData', JSON.stringify({
          userId: user.id,
          fullName: formData.fullName,
          email: formData.email,
        }))
        
        setIsLoading(false)
        navigate('/create-profile')
      } else {
        // Handle login
        const { user, error } = await validateLogin(formData.email, formData.password)
        
        if (error || !user) {
          setErrors({ general: error || 'Login failed. Please try again.' })
          setIsLoading(false)
          return
        }
        
        setAuthenticationState(user)
        setIsLoading(false)
        
        setTimeout(() => {
          navigate('/home', { replace: true })
        }, 100)
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Auth error:', error)
      setErrors({ general: 'An error occurred. Please try again.' })
    }
  }

  const toggleMode = () => {
    setIsSignupMode(!isSignupMode)
    setFormData({ fullName: '', email: '', password: '', confirmPassword: '' })
    setErrors({})
    setIsLogoGlowing(!isLogoGlowing)
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '36px',
          fontWeight: 'normal',
          fontFamily: '"Billabong", cursive',
          color: '#fff',
        }}>
          <img 
            src="/images/logoo.jpg" 
            alt="PetoGram Logo" 
            style={{
              height: '69px',
              width: 'auto',
              filter: 'invert(1)',
              ...(isLogoGlowing && { animation: 'glow 1.5s infinite alternate' }),
            }}
          />
        </h1>
      </header>

      <main style={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        flexWrap: 'wrap',
      }}>
        {/* Left Column: Image Display */}
        <div className="intro-image-column" style={{
          width: '350px',
          height: '350px',
          backgroundColor: '#000',
          borderRadius: '8px',
          marginRight: '40px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          color: '#8e8e8e',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
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

        {/* Right Column: Auth Form */}
        <div className="intro-login-column" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          width: '300px',
          maxWidth: 'calc(100% - 40px)',
          boxSizing: 'border-box',
        }}>
          {/* Auth Box */}
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
              fontFamily: '"Billabong", cursive',
              color: '#fff',
            }}>
              PetoGram
            </h1>

            {/* Full Name - Only for signup */}
            {isSignupMode && (
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
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
            )}

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
                marginBottom: isSignupMode ? '6px' : '14px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #363636',
                borderRadius: '3px',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
              }}
            />

            {/* Confirm Password - Only for signup */}
            {isSignupMode && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
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
            )}

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
                opacity: isLoading ? 0.5 : 1,
              }}
            >
              {isLoading ? (isSignupMode ? 'Signing up...' : 'Logging in...') : (isSignupMode ? 'Sign up' : 'Log in')}
            </button>

            {errors.general && (
              <p style={{
                color: 'red',
                fontSize: '12px',
                marginTop: '10px',
                textAlign: 'center',
              }}>{errors.general}</p>
            )}

            {/* Toggle between login/signup */}
            <div style={{
              backgroundColor: '#000',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              fontSize: '14px',
              marginTop: '10px',
            }}>
              {isSignupMode ? "Already have an account? " : "Don't have an account? "}
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); toggleMode(); }} 
                style={{
                  color: '#0095f6',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                {isSignupMode ? 'Log in' : 'Sign up'}
              </a>
            </div>

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
                    height: 320px !important;
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
    </div>
  )
}