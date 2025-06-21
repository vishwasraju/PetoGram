import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Eye, 
  Globe, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock,
  CreditCard,
  Download,
  Trash2,
  Check,
  EyeOff,
  X
} from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import Modal from '../components/ui/Modal'
import { supabase } from '../utils/supabase'
import { clearAuthenticationState, getUserProfile } from '../utils/auth'

export default function SettingsPage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
      }
    };
    fetchCurrentUser();
  }, []);

  const settingsCategories = [
    {
      title: 'Account',
      items: [
        { icon: Lock, label: 'Password & Security', description: 'Change your password', action: 'navigate' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support', action: 'popup' },
      ]
    },
    {
      title: 'Account Actions',
      items: [
        { icon: LogOut, label: 'Sign Out', description: 'Sign out of your account', action: 'logout', danger: true },
      ]
    },
  ]

  const handleToggle = (onChange: any, currentValue: boolean) => {
    onChange(!currentValue)
  }

  const handleLogout = async () => {
    try {
      await clearAuthenticationState()
      navigate('/')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const handleAction = (item: any) => {
    if (item.action === 'toggle') {
      handleToggle(item.onChange, item.value)
    } else if (item.action === 'button') {
      if (item.label === 'Sign Out') {
        // Handle sign out
        console.log('Signing out...')
      } else if (item.label === 'Delete Account') {
        // Handle account deletion
        console.log('Deleting account...')
      } else if (item.label === 'Download Data') {
        // Handle data download
        console.log('Downloading data...')
      }
    } else if (item.action === 'logout') {
      handleLogout()
      return
    } else if (item.action === 'navigate') {
      if (item.label === 'Profile Information') {
        navigate('/profile');
        return;
      }
      if (item.label === 'Password & Security') {
        setShowPasswordModal(true)
        return
      }
      // Add more navigation cases as needed
    } else if (item.action === 'popup' && item.label === 'Help Center') {
      alert('Send your query to vishwasmraju2003@gmail.com');
      return;
    }
  }

  const navigate = useNavigate();

  const handlePasswordInputChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const passwordRequirements = [
    { text: 'At least 8 characters', check: (pwd: string) => pwd.length >= 8 },
    { text: 'Contains lowercase letter', check: (pwd: string) => /[a-z]/.test(pwd) },
    { text: 'Contains number', check: (pwd: string) => /\d/.test(pwd) },
    { text: 'Contains special character', check: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) }
  ]

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {}
    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    if (!passwordForm.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else {
      const failedRequirements = passwordRequirements.filter(req => !req.check(passwordForm.newPassword))
      if (failedRequirements.length > 0) {
        newErrors.newPassword = 'Password does not meet requirements'
      }
    }
    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      newErrors.newPassword = 'New password must be different from current password'
    }
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePasswordForm()) return
    setPasswordLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.email) throw new Error('User not found')
      // Try to re-authenticate (Supabase does not require current password for updateUser, but you may want to verify)
      // Update password
      const { error } = await supabase.auth.updateUser({ password: passwordForm.newPassword })
      if (error) {
        setPasswordErrors({ general: error.message })
        return
      }
      setPasswordSuccess(true)
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      }, 2000)
    } catch (error) {
      setPasswordErrors({ general: 'An error occurred while changing password' })
    } finally {
      setPasswordLoading(false)
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
        justifyContent: 'space-between',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/home" 
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
            <Settings size={24} color="#9CA3AF" />
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Settings
            </h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '24px',
      }}>
        {/* Profile Summary */}
        <div
          style={{ 
            backgroundColor: '#111', 
            borderRadius: '16px', 
            padding: isMobile ? '16px' : '24px', 
            marginBottom: '32px', 
            border: '1px solid #333', 
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '12px' : '16px',
            flexDirection: isMobile ? 'column' : 'row',
            textAlign: isMobile ? 'center' : 'left',
          }}>
            <img 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
              alt="Profile"
              style={{
                width: isMobile ? '60px' : '80px',
                height: isMobile ? '60px' : '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366F1',
                marginBottom: isMobile ? '12px' : '0',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/profile')}
            />
            <div style={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/edit-profile')}>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: isMobile ? '20px' : '24px',
                fontWeight: '700',
                color: '#fff',
              }}>
                {userProfile?.username || 'User'}
              </h2>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: isMobile ? '14px' : '16px',
                color: '#9CA3AF',
              }}>
                {currentUser?.email}
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: isMobile ? 'center' : 'flex-start',
              }}>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: '#6366F1',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: '600',
                }}>
                  Pro Member
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: '#10B981',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#000',
                  fontWeight: '600',
                }}>
                  Verified
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/profile')}
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                width: isMobile ? '100%' : 'auto',
                marginTop: isMobile ? '16px' : '0',
                backgroundColor: 'transparent',
                border: '1px solid #6366F1',
                borderRadius: '8px',
                color: '#6366F1',
                fontSize: isMobile ? '14px' : '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginLeft: isMobile ? '0' : 'auto',
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
              Edit Profile
            </button>
          </div>
        </div>

        {/* Settings Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {settingsCategories.map((category) => (
            <div
              key={category.title}
              style={{
                backgroundColor: '#111',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #333',
              }}
            >
              <h3 style={{
                margin: '0 0 20px 0',
                fontSize: '18px',
                fontWeight: '700',
                color: '#fff',
              }}>
                {category.title}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {category.items.map((item) => {
                  const IconComponent = item.icon
                  
                  return (
                    <div
                      key={item.label}
                      onClick={() => handleAction(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        padding: '16px',
                        backgroundColor: 'transparent',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: 'none',
                        width: '100%',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#222'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div style={{
                        padding: '8px',
                        backgroundColor: item.danger ? '#EF4444' : '#333',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <IconComponent 
                          size={20} 
                          color={item.danger ? '#fff' : '#9CA3AF'} 
                        />
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 4px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: item.danger ? '#EF4444' : '#fff',
                        }}>
                          {item.label}
                        </h4>
                        <p style={{
                          margin: 0,
                          fontSize: '14px',
                          color: '#9CA3AF',
                        }}>
                          {item.description}
                        </p>
                      </div>
                      
                      {item.action === 'toggle' ? (
                        <div style={{
                          width: '48px',
                          height: '24px',
                          backgroundColor: item.value ? '#6366F1' : '#333',
                          borderRadius: '12px',
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease',
                        }}>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: '#fff',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '2px',
                            left: item.value ? '26px' : '2px',
                            transition: 'left 0.2s ease',
                          }} />
                        </div>
                      ) : (
                        <ChevronRight size={20} color="#9CA3AF" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* App Info */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginTop: '24px',
          border: '1px solid #333',
          textAlign: 'center',
        }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
          }}>
            PetoGram
          </h3>
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#9CA3AF',
          }}>
            Version 2.1.0 • Build 2024.12.09
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            fontSize: '14px',
            color: '#9CA3AF',
          }}>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Privacy Policy</a>
            <span>•</span>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Terms of Service</a>
            <span>•</span>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none' }}>About</a>
          </div>
        </div>
      </div>

      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password" size="md">
        {passwordSuccess ? (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <div style={{ width: 60, height: 60, backgroundColor: '#10B981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={32} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Password Changed Successfully!</h2>
            <p style={{ color: '#9CA3AF', fontSize: 15 }}>Your password has been updated.</p>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            {passwordErrors.general && <div style={{ color: '#EF4444', marginBottom: 12 }}>{passwordErrors.general}</div>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF', fontWeight: 600 }}>Current Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={e => handlePasswordInputChange('currentPassword', e.target.value)}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', backgroundColor: '#222', border: `1px solid ${passwordErrors.currentPassword ? '#EF4444' : '#444'}`, borderRadius: 8, color: '#fff', fontSize: 16, outline: 'none', transition: 'border-color 0.2s ease' }}
                />
                <button type="button" onClick={() => togglePasswordVisibility('current')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.currentPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passwordErrors.currentPassword}</p>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF', fontWeight: 600 }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={e => handlePasswordInputChange('newPassword', e.target.value)}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', backgroundColor: '#222', border: `1px solid ${passwordErrors.newPassword ? '#EF4444' : '#444'}`, borderRadius: 8, color: '#fff', fontSize: 16, outline: 'none', transition: 'border-color 0.2s ease' }}
                />
                <button type="button" onClick={() => togglePasswordVisibility('new')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.newPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passwordErrors.newPassword}</p>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, color: '#9CA3AF', fontWeight: 600 }}>Confirm New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={e => handlePasswordInputChange('confirmPassword', e.target.value)}
                  style={{ width: '100%', padding: '12px 40px 12px 12px', backgroundColor: '#222', border: `1px solid ${passwordErrors.confirmPassword ? '#EF4444' : '#444'}`, borderRadius: 8, color: '#fff', fontSize: 16, outline: 'none', transition: 'border-color 0.2s ease' }}
                />
                <button type="button" onClick={() => togglePasswordVisibility('confirm')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}>
                  {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <p style={{ color: '#EF4444', fontSize: 12, marginTop: 4 }}>{passwordErrors.confirmPassword}</p>}
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 8, color: '#9CA3AF', fontWeight: 600 }}>Password Requirements</div>
              <ul style={{ paddingLeft: 18, color: '#9CA3AF', fontSize: 13, margin: 0 }}>
                {passwordRequirements.map((req, idx) => (
                  <li key={idx} style={{ color: req.check(passwordForm.newPassword) ? '#10B981' : '#9CA3AF' }}>
                    {req.check(passwordForm.newPassword) ? <Check size={14} /> : <X size={14} />} {req.text}
                  </li>
                ))}
              </ul>
            </div>
            <button type="submit" disabled={passwordLoading} style={{ width: '100%', padding: '12px', backgroundColor: passwordLoading ? '#666' : '#6366F1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 16, fontWeight: 600, cursor: passwordLoading ? 'not-allowed' : 'pointer', transition: 'background 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onMouseEnter={e => { if (!passwordLoading) e.currentTarget.style.backgroundColor = '#4F46E5' }} onMouseLeave={e => { if (!passwordLoading) e.currentTarget.style.backgroundColor = '#6366F1' }}>
              <Lock size={16} /> {passwordLoading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>
        )}
      </Modal>
    </div>
  )
}