import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Heart, ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { designTokens } from '../design-system/tokens'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters'
    }

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getPasswordStrength = () => {
    const password = formData.password
    let strength = 0
    
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    
    return strength
  }

  const getPasswordStrengthLabel = () => {
    const strength = getPasswordStrength()
    if (strength <= 1) return { label: 'Weak', color: designTokens.colors.error[500] }
    if (strength <= 3) return { label: 'Medium', color: designTokens.colors.warning[500] }
    return { label: 'Strong', color: designTokens.colors.success[500] }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Store user data and redirect to profile creation
      localStorage.setItem('tempUserData', JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
      }))
      navigate('/create-profile')
    }, 1500)
  }

  const passwordStrength = getPasswordStrengthLabel()

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
          right: '-100px',
          width: '300px',
          height: '300px',
          background: `linear-gradient(45deg, ${designTokens.colors.success[200]}, ${designTokens.colors.success[300]})`,
          borderRadius: '50%',
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite',
        }} />

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: `linear-gradient(135deg, ${designTokens.colors.success[500]}, ${designTokens.colors.success[600]})`,
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
            background: `linear-gradient(135deg, ${designTokens.colors.success[600]}, ${designTokens.colors.primary[600]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Join PetoGram!
          </h1>

          <p style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.xl,
            color: designTokens.colors.gray[600],
            lineHeight: designTokens.typography.lineHeight.relaxed,
            maxWidth: '400px',
          }}>
            Create your account and start sharing amazing moments with your pets and connect with fellow pet lovers.
          </p>

          {/* Benefits List */}
          <div style={{
            textAlign: 'left',
            marginTop: designTokens.spacing[12],
            maxWidth: '350px',
          }}>
            {[
              'Share unlimited pet photos and videos',
              'Connect with pet lovers worldwide',
              'Get expert veterinary advice',
              'Join local pet events and meetups',
              'Access premium pet care resources',
            ].map((benefit, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: designTokens.spacing[3],
                marginBottom: designTokens.spacing[3],
              }}>
                <CheckCircle size={20} color={designTokens.colors.success[500]} />
                <span style={{
                  fontSize: designTokens.typography.fontSize.base,
                  color: designTokens.colors.gray[700],
                }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: designTokens.spacing[8],
        backgroundColor: designTokens.colors.white,
        boxShadow: designTokens.boxShadow.xl,
        overflowY: 'auto',
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
              Create Account
            </h2>
            <p style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.base,
              color: designTokens.colors.gray[600],
            }}>
              Fill in your details to get started
            </p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[6] }}>
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              leftIcon={<User size={20} />}
              error={errors.fullName}
              fullWidth
              inputSize="lg"
            />

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
                placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div style={{ marginTop: designTokens.spacing[2] }}>
                  <div style={{
                    display: 'flex',
                    gap: designTokens.spacing[1],
                    marginBottom: designTokens.spacing[1],
                  }}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          backgroundColor: level <= getPasswordStrength() 
                            ? passwordStrength.color 
                            : designTokens.colors.gray[200],
                          transition: `background-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                        }}
                      />
                    ))}
                  </div>
                  <span style={{
                    fontSize: designTokens.typography.fontSize.xs,
                    color: passwordStrength.color,
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Password strength: {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              leftIcon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: designTokens.colors.gray[400],
                    padding: 0,
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={errors.confirmPassword}
              fullWidth
              inputSize="lg"
            />

            {/* Terms and Conditions */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: designTokens.spacing[3],
                fontSize: designTokens.typography.fontSize.sm,
                color: designTokens.colors.gray[600],
                cursor: 'pointer',
                lineHeight: designTokens.typography.lineHeight.relaxed,
              }}>
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: designTokens.colors.primary[500],
                    marginTop: '2px',
                  }}
                />
                <span>
                  I agree to the{' '}
                  <Link
                    to="/terms"
                    style={{
                      color: designTokens.colors.primary[600],
                      textDecoration: 'none',
                      fontWeight: designTokens.typography.fontWeight.medium,
                    }}
                  >
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link
                    to="/privacy"
                    style={{
                      color: designTokens.colors.primary[600],
                      textDecoration: 'none',
                      fontWeight: designTokens.typography.fontWeight.medium,
                    }}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.agreeToTerms && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing[1],
                  marginTop: designTokens.spacing[1],
                }}>
                  <AlertCircle size={16} color={designTokens.colors.error[500]} />
                  <span style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.error[500],
                  }}>
                    {errors.agreeToTerms}
                  </span>
                </div>
              )}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
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

          {/* Social Signup */}
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
              Sign up with Google
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
              Sign up with Facebook
            </Button>
          </div>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            marginTop: designTokens.spacing[8],
            fontSize: designTokens.typography.fontSize.base,
            color: designTokens.colors.gray[600],
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: designTokens.colors.primary[600],
                textDecoration: 'none',
                fontWeight: designTokens.typography.fontWeight.semibold,
              }}
            >
              Sign in
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