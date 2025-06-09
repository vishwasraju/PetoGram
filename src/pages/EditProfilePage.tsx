import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera, Save, User, Mail, MapPin, Calendar, Globe, Lock, Eye, EyeOff } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'

interface UserProfile {
  id: string
  user_id: string
  username: string
  bio: string
  profile_picture: string
  location: string
  birth_date: string
  phone: string
  website: string
  social_media: {
    instagram: string
    twitter: string
    facebook: string
  }
  interests: string[]
  is_public: boolean
  allow_messages: boolean
  show_email: boolean
}

export default function EditProfilePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [newInterest, setNewInterest] = useState('')

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile()
    }
  }, [currentUser])

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUser(user)
  }

  const fetchUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        if (profile) {
          setProfile({ ...profile, profile_picture: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (profile) {
      setProfile({ ...profile, [field]: value })
    }
  }

  const handleSocialMediaChange = (platform: string, value: string) => {
    if (profile) {
      setProfile({
        ...profile,
        social_media: {
          ...profile.social_media,
          [platform]: value
        }
      })
    }
  }

  const addInterest = () => {
    if (newInterest.trim() && profile && !profile.interests.includes(newInterest.trim())) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest.trim()]
      })
      setNewInterest('')
    }
  }

  const removeInterest = (interest: string) => {
    if (profile) {
      setProfile({
        ...profile,
        interests: profile.interests.filter(i => i !== interest)
      })
    }
  }

  const handleSave = async () => {
    if (!profile || !currentUser) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          username: profile.username,
          bio: profile.bio,
          profile_picture: profile.profile_picture,
          location: profile.location,
          birth_date: profile.birth_date,
          phone: profile.phone,
          website: profile.website,
          social_media: profile.social_media,
          interests: profile.interests,
          is_public: profile.is_public,
          allow_messages: profile.allow_messages,
          show_email: profile.show_email
        })
        .eq('user_id', currentUser.id)

      if (error) throw error

      navigate('/profile')
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#000',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #333',
          borderTop: '4px solid #6366F1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    )
  }

  if (!profile) {
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
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>Profile Not Found</h1>
        <Link to="/home" style={{ color: '#6366F1', textDecoration: 'none' }}>
          Go back to home
        </Link>
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
        justifyContent: 'space-between',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/profile" 
            style={{
              color: '#9CA3AF',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Edit Profile
          </h1>
        </div>
        
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: saving ? '#666' : '#6366F1',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!saving) e.currentTarget.style.backgroundColor = '#4F46E5'
          }}
          onMouseLeave={(e) => {
            if (!saving) e.currentTarget.style.backgroundColor = '#6366F1'
          }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Profile Picture Section */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #333',
          textAlign: 'center',
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Profile Picture
          </h3>
          
          <div style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '16px',
          }}>
            <img 
              src={previewImage || profile.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt="Profile"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366F1',
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: 'absolute',
                bottom: '8px',
                right: '8px',
                width: '32px',
                height: '32px',
                backgroundColor: '#6366F1',
                border: 'none',
                borderRadius: '50%',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
            >
              <Camera size={16} />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          
          <p style={{
            margin: 0,
            fontSize: '14px',
            color: '#9CA3AF',
          }}>
            Click the camera icon to change your profile picture
          </p>
        </div>

        {/* Basic Information */}
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
            Basic Information
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Username
              </label>
              <input
                type="text"
                value={profile.username || ''}
                onChange={(e) => handleInputChange('username', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Bio
              </label>
              <textarea
                value={profile.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Location
              </label>
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Birth Date
              </label>
              <input
                type="date"
                value={profile.birth_date || ''}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Phone
              </label>
              <input
                type="tel"
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#E5E7EB',
              }}>
                Website
              </label>
              <input
                type="url"
                value={profile.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
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
            Social Media
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '16px',
          }}>
            {Object.entries(profile.social_media || {}).map(([platform, value]) => (
              <div key={platform}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                  textTransform: 'capitalize',
                }}>
                  {platform}
                </label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={(e) => handleSocialMediaChange(platform, e.target.value)}
                  placeholder={`Your ${platform} username`}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#222',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Interests */}
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
            Interests
          </h3>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '16px',
          }}>
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addInterest()
                }
              }}
              placeholder="Add an interest..."
              style={{
                flex: 1,
                padding: '10px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
            />
            <button
              onClick={addInterest}
              style={{
                padding: '10px 16px',
                backgroundColor: '#6366F1',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
            >
              Add
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {profile.interests.map((interest) => (
              <div
                key={interest}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: '#6366F1',
                  borderRadius: '16px',
                  fontSize: '14px',
                  color: '#fff',
                }}
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '16px',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy Settings */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #333',
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Privacy Settings
          </h3>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#222',
              borderRadius: '8px',
            }}>
              <div>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  Public Profile
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  Allow anyone to see your profile and posts
                </p>
              </div>
              <button
                onClick={() => handleInputChange('is_public', !profile.is_public)}
                style={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: profile.is_public ? '#6366F1' : '#333',
                  borderRadius: '12px',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: profile.is_public ? '26px' : '2px',
                  transition: 'left 0.2s ease',
                }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#222',
              borderRadius: '8px',
            }}>
              <div>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  Allow Messages
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  Let others send you direct messages
                </p>
              </div>
              <button
                onClick={() => handleInputChange('allow_messages', !profile.allow_messages)}
                style={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: profile.allow_messages ? '#6366F1' : '#333',
                  borderRadius: '12px',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: profile.allow_messages ? '26px' : '2px',
                  transition: 'left 0.2s ease',
                }} />
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: '#222',
              borderRadius: '8px',
            }}>
              <div>
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  Show Email
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  Display your email address on your profile
                </p>
              </div>
              <button
                onClick={() => handleInputChange('show_email', !profile.show_email)}
                style={{
                  width: '48px',
                  height: '24px',
                  backgroundColor: profile.show_email ? '#6366F1' : '#333',
                  borderRadius: '12px',
                  border: 'none',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
              >
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: '#fff',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: profile.show_email ? '26px' : '2px',
                  transition: 'left 0.2s ease',
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}