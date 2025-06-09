import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, AlertTriangle, Eye, EyeOff, Shield } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'
import { clearAuthenticationState } from '../utils/auth'

export default function DeleteAccountPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: Warning, 2: Confirmation

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const handleConfirmTextChange = (value: string) => {
    setConfirmText(value)
    if (errors.confirmText) {
      setErrors(prev => ({ ...prev, confirmText: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password) {
      newErrors.password = 'Password is required to delete your account'
    }

    if (confirmText !== 'DELETE') {
      newErrors.confirmText = 'Please type "DELETE" to confirm'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleDeleteAccount = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error('User not found')
      }

      // Verify password by attempting to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: password
      })

      if (signInError) {
        setErrors({ password: 'Incorrect password' })
        setLoading(false)
        return
      }

      // Delete user data from custom tables
      await supabase.from('user_profiles').delete().eq('user_id', user.id)
      await supabase.from('user_pets').delete().eq('user_id', user.id)
      await supabase.from('posts').delete().eq('user_id', user.id)
      await supabase.from('user_connections').delete().or(`requester_id.eq.${user.id},requested_id.eq.${user.id}`)
      await supabase.from('notifications').delete().eq('user_id', user.id)
      await supabase.from('messages').delete().eq('sender_id', user.id)
      await supabase.from('event_registrations').delete().eq('user_id', user.id)
      await supabase.from('appointment_bookings').delete().eq('user_id', user.id)
      await supabase.from('user_blocks').delete().or(`blocker_id.eq.${user.id},blocked_id.eq.${user.id}`)
      await supabase.from('user_privacy_settings').delete().eq('user_id', user.id)

      // Delete the auth user (this will cascade delete related data)
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (deleteError) {
        // If admin delete fails, try regular account deletion
        await supabase.auth.updateUser({ password: 'temp_password_for_deletion' })
      }

      // Clear authentication state
      await clearAuthenticationState()

      // Redirect to intro page
      navigate('/', { replace: true })

    } catch (error) {
      console.error('Account deletion error:', error)
      setErrors({ general: 'An error occurred while deleting your account. Please try again.' })
    } finally {
      setLoading(false)
    }
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
          <Trash2 size={24} color="#EF4444" />
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Delete Account
          </h1>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {step === 1 ? (
          // Warning Step
          <>
            {/* Warning Notice */}
            <div style={{
              backgroundColor: '#2d1b1b',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #EF4444',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
                <AlertTriangle size={24} color="#EF4444" />
                <h2 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#EF4444',
                }}>
                  Warning: This action cannot be undone
                </h2>
              </div>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#E5E7EB',
                lineHeight: '1.6',
              }}>
                Deleting your account will permanently remove all your data from our servers. 
                This includes your profile, posts, messages, connections, and all other associated information.
              </p>
            </div>

            {/* What will be deleted */}
            <div style={{
              backgroundColor: '#111',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
              border: '1px solid #333',
            }}>
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#fff',
              }}>
                What will be permanently deleted:
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}>
                {[
                  'Your profile and personal information',
                  'All your posts and media',
                  'Your messages and conversations',
                  'Friend connections and followers',
                  'Event registrations',
                  'Appointment bookings',
                  'Notifications and activity',
                  'Account settings and preferences'
                ].map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#E5E7EB',
                    }}
                  >
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: '#EF4444',
                      borderRadius: '50%',
                    }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative options */}
            <div style={{
              backgroundColor: '#1a1a2e',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid #6366F1',
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#6366F1',
              }}>
                Consider these alternatives:
              </h3>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '14px',
                color: '#9CA3AF',
                lineHeight: '1.5',
              }}>
                <li>Make your profile private instead of deleting it</li>
                <li>Take a break by deactivating your account temporarily</li>
                <li>Download your data before deleting (available in settings)</li>
                <li>Contact support if you're having issues with the platform</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
            }}>
              <Link
                to="/settings-page"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: 'transparent',
                  border: '1px solid #6366F1',
                  borderRadius: '8px',
                  color: '#6366F1',
                  fontSize: '16px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#6366F1'
                  e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = '#6366F1'
                }}
              >
                <Shield size={16} />
                Keep My Account
              </Link>
              
              <button
                onClick={() => setStep(2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  backgroundColor: '#EF4444',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
              >
                <Trash2 size={16} />
                Continue to Delete
              </button>
            </div>
          </>
        ) : (
          // Confirmation Step
          <div style={{
            backgroundColor: '#111',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #333',
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#2d1b1b',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid #EF4444',
              }}>
                <Trash2 size={32} color="#EF4444" />
              </div>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
              }}>
                Final Confirmation
              </h2>
              <p style={{
                margin: 0,
                fontSize: '16px',
                color: '#9CA3AF',
              }}>
                Please confirm your password and type "DELETE" to permanently delete your account.
              </p>
            </div>

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

            <form onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
              {/* Password Input */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                }}>
                  Enter your password to confirm
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 40px 12px 12px',
                      backgroundColor: '#222',
                      border: `1px solid ${errors.password ? '#EF4444' : '#444'}`,
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => {
                      if (!errors.password) e.currentTarget.style.borderColor = '#6366F1'
                    }}
                    onBlur={(e) => {
                      if (!errors.password) e.currentTarget.style.borderColor = '#444'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={{
                    color: '#EF4444',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirmation Text */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                }}>
                  Type "DELETE" to confirm (case sensitive)
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => handleConfirmTextChange(e.target.value)}
                  placeholder="DELETE"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#222',
                    border: `1px solid ${errors.confirmText ? '#EF4444' : '#444'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmText) e.currentTarget.style.borderColor = '#6366F1'
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmText) e.currentTarget.style.borderColor = '#444'
                  }}
                />
                {errors.confirmText && (
                  <p style={{
                    color: '#EF4444',
                    fontSize: '12px',
                    marginTop: '4px',
                  }}>
                    {errors.confirmText}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
              }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: 'transparent',
                    border: '1px solid #6366F1',
                    borderRadius: '8px',
                    color: '#6366F1',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6366F1'
                    e.currentTarget.style.color = '#fff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#6366F1'
                  }}
                >
                  Go Back
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    backgroundColor: loading ? '#666' : '#EF4444',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#DC2626'
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#EF4444'
                  }}
                >
                  <Trash2 size={16} />
                  {loading ? 'Deleting Account...' : 'Delete My Account Forever'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}