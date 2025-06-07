import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, ArrowLeft, Mail, Lock, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { designTokens } from '../design-system/tokens'

export default function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
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
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, any valid email/password combination works
      if (formData.email && formData.password.length >= 6) {
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('userEmail', formData.email)
        navigate('/')
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: `linear-gradient(135deg, ${designTokens.colors.primary[50]} 0%, ${designTokens.colors.white} 50%, ${designTokens.colors.success[50]} 100%)`,
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: designTokens.spacing[8],
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background Decoration */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: `linear-gradient(45deg, ${designTokens.colors.primary[200]}, ${designTokens.colors.primary[300]})`,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: `linear-gradient(135deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: `0 auto ${designTokens.spacing[8]}`,
            boxShadow: designTokens.boxShadow.xl,
          }}>
            <Heart size={48} color={designTokens.colors.white} fill="currentColor" />
          </div>

          <h1 style={{
            margin: `0 0 ${designTokens.spacing[4]} 0`,
            fontSize: designTokens.typography.fontSize['4xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
            background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Welcome Back!
          </h1>

          <p style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.xl,
            color: designTokens.colors.gray[600],
            lineHeight: designTokens.typography.lineHeight.relaxed,
            maxWidth: '400px',
          }}>
            Sign in to continue sharing precious moments with your pet community.
          </p>

          {/* Sample Pet Images */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: designTokens.spacing[4],
            marginTop: designTokens.spacing[12],
          }}>
            {[
              'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
              'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
              'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
            ].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Pet ${index + 1}`}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `4px solid ${designTokens.colors.white}`,
                  boxShadow: designTokens.boxShadow.lg,
                  animation: `float ${4 + index}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: designTokens.spacing[8],
        backgroundColor: designTokens.colors.white,
        boxShadow: designTokens.boxShadow.xl,
      }}>
        <div style={{ maxWidth: '400px', width: '100%', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: designTokens.spacing[8] }}>
            <Link 
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: designTokens.spacing[2],
                color: designTokens.colors.gray[600],
                textDecoration: 'none',
                marginBottom: designTokens.spacing[6],
                transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = designTokens.colors.primary[600]}
              onMouseLeave={(e) => e.currentTarget.style.color = designTokens.colors.gray[600]}
            >
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </Link>

            <h2 style={{
              margin: `0 0 ${designTokens.spacing[2]} 0`,
              fontSize: designTokens.typography.fontSize['3xl'],
              fontWeight: designTokens.typography.fontWeight.bold,
              color: designTokens.colors.gray[900],
              fontFamily: designTokens.typography.fontFamily.display.join(', '),
            }}>
              Sign In
            </h2>
            <p style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.base,
              color: designTokens.colors.gray[600],
            }}>
              Enter your credentials to access your account
            </p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div style={{
              padding: designTokens.spacing[4],
              backgroundColor: designTokens.colors.error[50],
              border: `1px solid ${designTokens.colors.error[200]}`,
              borderRadius: designTokens.borderRadius.xl,
              marginBottom: designTokens.spacing[6],
              display: 'flex',
              alignItems: 'center',
              gap: designTokens.spacing[2],
            }}>
              <AlertCircle size={20} color={designTokens.colors.error[500]} />
              <span style={{
                fontSize: designTokens.typography.fontSize.sm,
                color: designTokens.colors.error[700],
              }}>
                {errors.general}
              </span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[6] }}>
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              leftIcon={<Mail size={20} />}
              error={errors.email}
              fullWidth
              inputSize="lg"
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                leftIcon={<Lock size={20} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: designTokens.colors.gray[400],
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
                error={errors.password}
                fullWidth
                inputSize="lg"
              />
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: designTokens.spacing[3],
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing[2],
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.gray[600],
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: designTokens.colors.primary[500],
                    }}
                  />
                  Remember me
                </label>
                
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.primary[600],
                    textDecoration: 'none',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={isLoading}
              style={{
                padding: designTokens.spacing[4],
                fontSize: designTokens.typography.fontSize.lg,
                fontWeight: designTokens.typography.fontWeight.semibold,
              }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing[4],
            margin: `${designTokens.spacing[8]} 0`,
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: designTokens.colors.gray[200],
            }} />
            <span style={{
              fontSize: designTokens.typography.fontSize.sm,
              color: designTokens.colors.gray[500],
              fontWeight: designTokens.typography.fontWeight.medium,
            }}>
              OR
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: designTokens.colors.gray[200],
            }} />
          </div>

          {/* Social Login */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[3] }}>
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              style={{
                padding: designTokens.spacing[4],
                fontSize: designTokens.typography.fontSize.base,
                fontWeight: designTokens.typography.fontWeight.medium,
                border: `1px solid ${designTokens.colors.gray[200]}`,
              }}
            >
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwIDIwQzE1LjUyMjggMjAgMjAgMTUuNTIyOCAyMCAxMEMyMCA0LjQ3NzE1IDE1LjUyMjggMCAxMCAwQzQuNDc3MTUgMCAwIDQuNDc3MTUgMCAxMEMwIDE1LjUyMjggNC40NzcxNSAyMCAxMCAyMFoiIGZpbGw9IiM0Mjg1RjQiLz4KPHBhdGggZD0iTTE2LjMwNzYgMTAuMjI3MkMxNi4zMDc2IDkuNTE4MTYgMTYuMjUgOC44NDA4OCAxNi4xNDc2IDguMTgxODFIMTBWMTIuMDQ1NEgxMy42NTIyQzEzLjQ3MjYgMTMuMDY4MSAxMi45MjM5IDEzLjg5NzYgMTIuMDk3NiAxNC40MzE4VjE2LjY5MDlIMTQuMjg0MUMxNS4zOTc2IDE1LjY1OTEgMTYuMzA3NiAxMy4wNzk1IDE2LjMwNzYgMTAuMjI3MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMCAxOC45OTk5QzEyLjY5NzYgMTguOTk5OSAxNC45NjU5IDE4LjEwMjIgMTYuMjE1OSAxNi42OTA5TDE0LjAyOTUgMTQuNDMxOEMxMy4zNjM2IDE0Ljg2MzYgMTIuNDc3MiAxNS4xMzYzIDEwIDE1LjEzNjNDNy4zOTc3MiAxNS4xMzYzIDUuMTkzMTggMTQuMDkwOSA0LjQwNDU0IDEyLjUwMDFIMi4xNTkwOVYxNC44NDA5QzMuNDMxODEgMTcuMzc3MiA2LjQ3NzI2IDE4Ljk5OTkgMTAgMTguOTk5OVoiIGZpbGw9IiMzNEE4NTMiLz4KPHBhdGggZD0iTTQuNDA0NTQgMTIuNTAwMUM0LjIyNzI2IDEyLjA2ODIgNC4xMjUgMTEuNTkwOSA0LjEyNSAxMC45OTk5QzQuMTI1IDEwLjQwODkgNC4yMjcyNiA5LjkzMTc5IDQuNDA0NTQgOS40OTk5OFY3LjE1OTA4SDIuMTU5MDlDMS41NjgxOCA4LjM0MDg4IDEuMjUgOS42MzYzNSAxLjI1IDEwLjk5OTlDMS4yNSAxMi4zNjM1IDEuNTY4MTggMTMuNjU5IDIuMTU5MDkgMTQuODQwOUw0LjQwNDU0IDEyLjUwMDFaIiBmaWxsPSIjRkJCQzA0Ii8+CjxwYXRoIGQ9Ik0xMCA1Ljg2MzYzQzExLjY5MzEgNS44NjM2MyAxMy4yMDQ1IDYuNDc3MjYgMTQuMzk3NiA3LjU2ODE2TDE2LjMwNzYgNS42NTkwOEMxNC45NjU5IDQuNDMxODEgMTIuNjk3NiAzLjc1IDEwIDMuNzVDNi40NzcyNiAzLjc1IDMuNDMxODEgNS4zNzI3MiAyLjE1OTA5IDcuOTA5MDhMNC40MDQ1NCA5LjQ5OTk4QzUuMTkzMTggNy45MDkwOCA3LjM5NzcyIDUuODYzNjMgMTAgNS44NjM2M1oiIGZpbGw9IiNFQTQzMzUiLz4KPC9zdmc+"
                alt="Google"
                style={{ width: '20px', height: '20px' }}
              />
              Continue with Google
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              style={{
                padding: designTokens.spacing[4],
                fontSize: designTokens.typography.fontSize.base,
                fontWeight: designTokens.typography.fontWeight.medium,
                border: `1px solid ${designTokens.colors.gray[200]}`,
                backgroundColor: '#1877F2',
                color: designTokens.colors.white,
              }}
            >
              <span style={{
                width: '20px',
                height: '20px',
                backgroundColor: designTokens.colors.white,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1877F2',
              }}>
                f
              </span>
              Continue with Facebook
            </Button>
          </div>

          {/* Sign Up Link */}
          <div style={{
            textAlign: 'center',
            marginTop: designTokens.spacing[8],
            fontSize: designTokens.typography.fontSize.base,
            color: designTokens.colors.gray[600],
          }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: designTokens.colors.primary[600],
                textDecoration: 'none',
                fontWeight: designTokens.typography.fontWeight.semibold,
              }}
            >
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}