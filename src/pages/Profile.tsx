import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Calendar, 
  MoreHorizontal,
  Grid3X3,
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  UserPlus,
  Camera,
  Edit3,
  Shield,
  Star,
  Award,
  Users,
  Image as ImageIcon,
  Video,
  Tag
} from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import { designTokens } from '../design-system/tokens'

const profilePosts = [
  {
    id: '1',
    type: 'image',
    url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 234,
    comments: 12,
  },
  {
    id: '2',
    type: 'video',
    url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 189,
    comments: 8,
  },
  {
    id: '3',
    type: 'image',
    url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 156,
    comments: 5,
  },
  {
    id: '4',
    type: 'image',
    url: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 298,
    comments: 15,
  },
  {
    id: '5',
    type: 'video',
    url: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 167,
    comments: 9,
  },
  {
    id: '6',
    type: 'image',
    url: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 203,
    comments: 7,
  },
]

const highlights = [
  { id: '1', title: 'Max', image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '2', title: 'Luna', image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '3', title: 'Adventures', image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '4', title: 'Training', image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100' },
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  const tabs = [
    { id: 'posts', name: 'Posts', icon: Grid3X3, count: 42 },
    { id: 'tagged', name: 'Tagged', icon: Tag, count: 18 },
    { id: 'saved', name: 'Saved', icon: Bookmark, count: 156 },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: designTokens.colors.gray[50],
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: designTokens.colors.white,
        borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
        position: 'sticky',
        top: 0,
        zIndex: designTokens.zIndex.sticky,
        padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[4] }}>
            <Link 
              to="/" 
              style={{
                color: designTokens.colors.gray[600],
                transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = designTokens.colors.primary[600]}
              onMouseLeave={(e) => e.currentTarget.style.color = designTokens.colors.gray[600]}
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize['2xl'],
                fontWeight: designTokens.typography.fontWeight.bold,
                color: designTokens.colors.gray[900],
                fontFamily: designTokens.typography.fontFamily.display.join(', '),
              }}>
                John Doe
              </h1>
              <p style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize.sm,
                color: designTokens.colors.gray[500],
              }}>
                @johndoe
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
            <Button variant="ghost" size="sm">
              <Share size={20} />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: designTokens.spacing[6],
      }}>
        {/* Profile Header Section */}
        <Card style={{ marginBottom: designTokens.spacing[6] }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr auto',
            gap: designTokens.spacing[8],
            alignItems: 'start',
          }}>
            {/* Profile Picture */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <img 
                  src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2"
                  alt="John Doe"
                  style={{
                    width: '142px',
                    height: '142px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid ${designTokens.colors.white}`,
                  }}
                />
              </div>
              
              {/* Verification Badge */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '32px',
                height: '32px',
                backgroundColor: designTokens.colors.primary[500],
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `3px solid ${designTokens.colors.white}`,
                boxShadow: designTokens.boxShadow.md,
              }}>
                <Shield size={16} color={designTokens.colors.white} />
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: designTokens.spacing[3],
                marginBottom: designTokens.spacing[4],
              }}>
                <h2 style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize['3xl'],
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.gray[900],
                  fontFamily: designTokens.typography.fontFamily.display.join(', '),
                }}>
                  John Doe
                </h2>
                <Badge variant="primary" size="md">
                  <Star size={14} />
                  <span style={{ marginLeft: designTokens.spacing[1] }}>Pro</span>
                </Badge>
                <Badge variant="success" size="md">
                  <Award size={14} />
                  <span style={{ marginLeft: designTokens.spacing[1] }}>Verified</span>
                </Badge>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                gap: designTokens.spacing[8],
                marginBottom: designTokens.spacing[4],
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.gray[900],
                  }}>
                    42
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.gray[500],
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Posts
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.gray[900],
                  }}>
                    1.2K
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.gray[500],
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: designTokens.colors.gray[900],
                  }}>
                    389
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: designTokens.colors.gray[500],
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Following
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: designTokens.spacing[4] }}>
                <p style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.base,
                  color: designTokens.colors.gray[700],
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  marginBottom: designTokens.spacing[2],
                }}>
                  Proud pet parent to Max 🐕 and Luna 🐱. Love sharing their adventures and connecting with fellow pet lovers! 
                  <br />
                  📍 New York, NY • 🎂 Joined March 2023
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing[4],
                  fontSize: designTokens.typography.fontSize.sm,
                  color: designTokens.colors.gray[500],
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                    <MapPin size={16} />
                    <span>New York, NY</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                    <Calendar size={16} />
                    <span>Joined March 2023</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: designTokens.spacing[3],
              minWidth: '200px',
            }}>
              <Button variant="primary" size="lg" style={{ width: '100%' }}>
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </Button>
              
              <div style={{ display: 'flex', gap: designTokens.spacing[2] }}>
                <Button variant="secondary" size="md" style={{ flex: 1 }}>
                  <MessageCircle size={16} />
                </Button>
                <Button variant="secondary" size="md" style={{ flex: 1 }}>
                  <UserPlus size={16} />
                </Button>
                <Button variant="secondary" size="md" style={{ flex: 1 }}>
                  <Settings size={16} />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Story Highlights */}
        <Card style={{ marginBottom: designTokens.spacing[6] }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: designTokens.spacing[2],
            marginBottom: designTokens.spacing[4],
          }}>
            <h3 style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.lg,
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: designTokens.colors.gray[900],
            }}>
              Story Highlights
            </h3>
            <Badge variant="info" size="sm">
              {highlights.length}
            </Badge>
          </div>
          
          <div style={{
            display: 'flex',
            gap: designTokens.spacing[4],
            overflowX: 'auto',
            paddingBottom: designTokens.spacing[2],
          }}>
            {/* Add New Highlight */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: designTokens.spacing[2],
              minWidth: '80px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: `2px dashed ${designTokens.colors.gray[300]}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = designTokens.colors.primary[500]
                e.currentTarget.style.backgroundColor = designTokens.colors.primary[50]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = designTokens.colors.gray[300]
                e.currentTarget.style.backgroundColor = 'transparent'
              }}>
                <Camera size={24} color={designTokens.colors.gray[400]} />
              </div>
              <span style={{
                fontSize: designTokens.typography.fontSize.xs,
                color: designTokens.colors.gray[500],
                textAlign: 'center',
              }}>
                New
              </span>
            </div>

            {/* Existing Highlights */}
            {highlights.map((highlight) => (
              <div key={highlight.id} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: designTokens.spacing[2],
                minWidth: '80px',
                cursor: 'pointer',
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, ${designTokens.colors.primary[500]}, ${designTokens.colors.primary[600]})`,
                  padding: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img 
                    src={highlight.image}
                    alt={highlight.title}
                    style={{
                      width: '74px',
                      height: '74px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `2px solid ${designTokens.colors.white}`,
                    }}
                  />
                </div>
                <span style={{
                  fontSize: designTokens.typography.fontSize.xs,
                  color: designTokens.colors.gray[700],
                  fontWeight: designTokens.typography.fontWeight.medium,
                  textAlign: 'center',
                }}>
                  {highlight.title}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Content Tabs */}
        <Card>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
            marginBottom: designTokens.spacing[6],
          }}>
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              const isActive = activeTab === tab.id
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: designTokens.spacing[2],
                    padding: `${designTokens.spacing[4]} ${designTokens.spacing[6]}`,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: `3px solid ${isActive ? designTokens.colors.primary[500] : 'transparent'}`,
                    color: isActive ? designTokens.colors.primary[600] : designTokens.colors.gray[500],
                    fontWeight: isActive ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
                    fontSize: designTokens.typography.fontSize.base,
                    cursor: 'pointer',
                    transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = designTokens.colors.gray[700]
                      e.currentTarget.style.backgroundColor = designTokens.colors.gray[50]
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = designTokens.colors.gray[500]
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <IconComponent size={20} />
                  <span>{tab.name}</span>
                  <Badge variant={isActive ? 'primary' : 'default'} size="sm">
                    {tab.count}
                  </Badge>
                </button>
              )
            })}
          </div>

          {/* Posts Grid */}
          {activeTab === 'posts' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: designTokens.spacing[4],
            }}>
              {profilePosts.map((post) => (
                <div key={post.id} style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: designTokens.borderRadius.xl,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: `transform ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                }}>
                  <img 
                    src={post.url}
                    alt={`Post ${post.id}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  
                  {/* Post Type Indicator */}
                  {post.type === 'video' && (
                    <div style={{
                      position: 'absolute',
                      top: designTokens.spacing[3],
                      right: designTokens.spacing[3],
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: designTokens.colors.white,
                      padding: designTokens.spacing[1],
                      borderRadius: designTokens.borderRadius.md,
                    }}>
                      <Video size={16} />
                    </div>
                  )}
                  
                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: designTokens.spacing[6],
                    opacity: 0,
                    transition: `opacity ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing[1],
                      color: designTokens.colors.white,
                      fontWeight: designTokens.typography.fontWeight.semibold,
                    }}>
                      <Heart size={20} fill="currentColor" />
                      <span>{post.likes}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing[1],
                      color: designTokens.colors.white,
                      fontWeight: designTokens.typography.fontWeight.semibold,
                    }}>
                      <MessageCircle size={20} fill="currentColor" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State for Other Tabs */}
          {activeTab !== 'posts' && (
            <div style={{
              textAlign: 'center',
              padding: `${designTokens.spacing[16]} ${designTokens.spacing[8]}`,
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: designTokens.colors.gray[100],
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: `0 auto ${designTokens.spacing[4]}`,
              }}>
                {activeTab === 'tagged' && <Tag size={32} color={designTokens.colors.gray[400]} />}
                {activeTab === 'saved' && <Bookmark size={32} color={designTokens.colors.gray[400]} />}
              </div>
              <h3 style={{
                margin: `0 0 ${designTokens.spacing[2]} 0`,
                fontSize: designTokens.typography.fontSize.xl,
                fontWeight: designTokens.typography.fontWeight.semibold,
                color: designTokens.colors.gray[900],
              }}>
                No {activeTab} yet
              </h3>
              <p style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize.base,
                color: designTokens.colors.gray[500],
                lineHeight: designTokens.typography.lineHeight.relaxed,
              }}>
                {activeTab === 'tagged' && "Posts you're tagged in will appear here."}
                {activeTab === 'saved' && "Posts you've saved will appear here."}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}