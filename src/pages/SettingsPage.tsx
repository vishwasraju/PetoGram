import React, { useState } from 'react'
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
  Trash2
} from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true
  })

  const settingsCategories = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Information', description: 'Update your personal details', action: 'navigate' },
        { icon: Lock, label: 'Password & Security', description: 'Change your password', action: 'navigate' },
        { icon: CreditCard, label: 'Billing & Payments', description: 'Manage payment methods', action: 'navigate' },
        { icon: Download, label: 'Download Data', description: 'Export your account data', action: 'button' }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences', action: 'navigate' },
        { icon: Eye, label: 'Privacy', description: 'Control who can see your content', action: 'navigate' },
        { icon: Globe, label: 'Language & Region', description: 'Change language and location settings', action: 'navigate' },
        { icon: darkMode ? Moon : Sun, label: 'Dark Mode', description: 'Toggle dark/light theme', action: 'toggle', value: darkMode, onChange: setDarkMode }
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', description: 'Get help and support', action: 'navigate' },
        { icon: Mail, label: 'Contact Support', description: 'Send us a message', action: 'navigate' },
        { icon: Smartphone, label: 'Report a Problem', description: 'Report bugs or issues', action: 'navigate' }
      ]
    },
    {
      title: 'Danger Zone',
      items: [
        { icon: Trash2, label: 'Delete Account', description: 'Permanently delete your account', action: 'button', danger: true },
        { icon: LogOut, label: 'Sign Out', description: 'Sign out of your account', action: 'button', danger: true }
      ]
    }
  ]

  const handleToggle = (onChange: any, currentValue: boolean) => {
    onChange(!currentValue)
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
    } else if (item.action === 'navigate') {
      if (item.label === 'Profile Information') {
        navigate('/profile');
        return;
      }
      if (item.label === 'Password & Security') {
        navigate('/password-security');
        return;
      }
      // Add more navigation cases as needed
    }
  }

  const navigate = useNavigate();

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
        padding: '24px',
      }}>
        {/* Profile Summary */}
        <div
          style={{ backgroundColor: '#111', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid #333', cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <img 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
              alt="Profile"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366F1',
              }}
            />
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: '24px',
                fontWeight: '700',
                color: '#fff',
              }}>
                John Doe
              </h2>
              <p style={{
                margin: '0 0 8px 0',
                fontSize: '16px',
                color: '#9CA3AF',
              }}>
                john.doe@example.com
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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
            <button style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #6366F1',
              borderRadius: '8px',
              color: '#6366F1',
              fontSize: '14px',
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
            }}>
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
    </div>
  )
}