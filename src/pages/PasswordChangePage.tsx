import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Eye, EyeOff, Shield, Check, X } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'

export default function PasswordChangePage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const passwordRequirements = [
    { text: 'At least 8 characters', check: (pwd: string) => pwd.length >= 8 },
    { text: 'Contains uppercase letter', check: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: 'Contains lowercase letter', check: (pwd: string) => /[a-z]/.test(pwd) },
    { text: 'Contains number', check: (pwd: string) => /\d/.test(pwd) },
    { text: 'Contains special character', check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.check(formData.newPassword))
      if (failedRequirements.length > 0) {
        newErrors.newPassword = 'Password does not meet requirements'
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      // First verify current password by attempting to sign in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) {
        throw new Error('User not found')
      }

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ currentPassword: 'Current password is incorrect' })
        } else {
          setErrors({ general: error.message })
        }
        return
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/settings-page')
      }, 2000)

    } catch (error) {
      console.error('Password change error:', error)
      setErrors({ general: 'An error occurred while changing password' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#10B981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
        }}>
          <Check size={40} color="#fff" />
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          marginBottom: '12px',
        }}>
          Password Changed Successfully!
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#9CA3AF',
          marginBottom: '24px',
        }}>
          Your password has been updated. Redirecting to settings...
        </p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link 
          to="/settings-page" 
          style={{
            color: '#9CA3AF',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
        >
          <ArrowLeft size={24} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={24} color="#EF4444" />
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Change Password
          </h1>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Security Notice */}
        <div style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #6366F1',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '12px',
          }}>
            <Shield size={20} color="#6366F1" />
            <h3 style={{
              margin: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
            }}>
              Security Notice
            </h3>
          </div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.5',
          }}>
            Choose a strong password that you haven't used elsewhere. After changing your password, 
            you'll remain signed in on this device but may need to sign in again on other devices.
          </p>
        </div>

        {/* Password Change Form */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #333',
        }}>
          {errors.general && (
            <div style={{
              padding: '12px',
              backgroundColor: '#EF4444',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center',
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Current Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    backgroundColor: '#222',
                    border: `1px solid ${errors.currentPassword ? '#EF4444' : '#444'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    if (!errors.currentPassword) e.currentTarget.style.borderColor = '#6366F1'
                  }}
                  onBlur={(e) => {
                    if (!errors.currentPassword) e.currentTarget.style.borderColor = '#444'
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                  }}
                >
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '12px',
                  marginTop: '4px',
                }}>
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    backgroundColor: '#222',
                    border: `1px solid ${errors.newPassword ? '#EF4444' : '#444'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    if (!errors.newPassword) e.currentTarget.style.borderColor = '#6366F1'
                  }}
                  onBlur={(e) => {
                    if (!errors.newPassword) e.currentTarget.style.borderColor = '#444'
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                  }}
                >
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '12px',
                  marginTop: '4px',
                }}>
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div style={{
                marginBottom: '20px',
                padding: '16px',
                backgroundColor: '#222',
                borderRadius: '8px',
              }}>
                <h4 style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                }}>
                  Password Requirements
                </h4>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                }}>
                  {passwordRequirements.map((req, index) => {
                    const isValid = req.check(formData.newPassword)
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '12px',
                          color: isValid ? '#10B981' : '#9CA3AF',
                        }}
                      >
                        {isValid ? <Check size={14} /> : <X size={14} />}
                        <span>{req.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Confirm New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 12px',
                    backgroundColor: '#222',
                    border: `1px solid ${errors.confirmPassword ? '#EF4444' : '#444'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) e.currentTarget.style.borderColor = '#6366F1'
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword) e.currentTarget.style.borderColor = '#444'
                  }}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                  }}
                >
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{
                  color: '#EF4444',
                  fontSize: '12px',
                  marginTop: '4px',
                }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#666' : '#6366F1',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#4F46E5'
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = '#6366F1'
              }}
            >
              <Lock size={16} />
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}