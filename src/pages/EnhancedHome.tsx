import React, { useState, useEffect } from 'react'
import EnhancedSidebar from '../components/layout/EnhancedSidebar'
import EnhancedHeader from '../components/layout/EnhancedHeader'
import Post from '../components/feed/Post'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { TrendingUp, Users, Calendar, MapPin, Star, Plus, Search, Mic, Heart, MessageCircle, Bookmark, MoreHorizontal, UserPlus, X, Clock, Siren as Fire, Hash } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

interface PostData {
  id: string
  user: {
    name: string
    avatar: string
    pets: string
    verified?: boolean
  }
  content: {
    type: 'image' | 'video'
    url: string
    caption: string
    hashtags: string[]
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    liked: boolean
    saved?: boolean
  }
  timestamp: string
}

const mockPosts: PostData[] = [
  {
    id: '1',
    user: {
      name: 'Robert Fox',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@alexsamdrovonzi',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'While Corfu give us the ability to shoot by the sea with amazing blue background full of light of the sky. Florina give us its gentle side. The humble atmosphere and Light of Florina which comes... read more',
      hashtags: ['#landscape', '#flora', '#nature'],
    },
    engagement: {
      likes: 1600,
      comments: 2300,
      shares: 23,
      liked: false,
      saved: false,
    },
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      name: 'Dianne Russell',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@amandadasilva',
      verified: false,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Beautiful sunset over the mountains with amazing colors and peaceful atmosphere.',
      hashtags: ['#sunset', '#mountains', '#nature'],
    },
    engagement: {
      likes: 892,
      comments: 45,
      shares: 12,
      liked: true,
      saved: true,
    },
    timestamp: '4h',
  },
]

const stories = [
  { id: '1', name: 'Your story', avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', isAdd: true },
  { id: '2', name: 'Sarah', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '3', name: 'Mike', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '4', name: 'Emma', avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '5', name: 'David', avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '6', name: 'Lisa', avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
]

const contacts = [
  { id: '1', name: 'Julie Mendez', location: 'Memphis, TN, US', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
  { id: '2', name: 'Marian Montgomery', location: 'Newark, NJ, US', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: false },
  { id: '3', name: 'Joyce Reid', location: 'Fort Worth, TX, US', avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
  { id: '4', name: 'Alice Franklin', location: 'Springfield, MA, US', avatar: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: false },
  { id: '5', name: 'Domingo Flores', location: 'Honolulu, HI, US', avatar: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2', online: true },
]

const requests = [
  { id: '1', name: 'Lauralee Quintero', action: 'wants to add you to friends', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
  { id: '2', name: 'Brittni Landom', action: 'wants to add you to friends', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Pet Adoption Fair',
    date: 'Tomorrow',
    time: '10:00 AM',
    location: 'Central Park',
    attendees: 234,
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: '2',
    title: 'Dog Training Workshop',
    date: 'This Weekend',
    time: '2:00 PM',
    location: 'Community Center',
    attendees: 89,
    image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  },
  {
    id: '3',
    title: 'Cat Cafe Meetup',
    date: 'Next Monday',
    time: '6:00 PM',
    location: 'Whiskers Cafe',
    attendees: 156,
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2'
  }
]

const trendingTopics = [
  {
    id: '1',
    hashtag: '#PuppyLove',
    posts: '45.2K',
    growth: '+12%',
    category: 'Trending in Pets'
  },
  {
    id: '2',
    hashtag: '#CatsOfInstagram',
    posts: '38.9K',
    growth: '+8%',
    category: 'Trending in Social'
  },
  {
    id: '3',
    hashtag: '#DogTraining',
    posts: '23.1K',
    growth: '+15%',
    category: 'Trending in Education'
  },
  {
    id: '4',
    hashtag: '#PetPhotography',
    posts: '19.8K',
    growth: '+5%',
    category: 'Trending in Art'
  },
  {
    id: '5',
    hashtag: '#AdoptDontShop',
    posts: '16.7K',
    growth: '+20%',
    category: 'Trending in Advocacy'
  }
]

export default function EnhancedHome() {
  const [posts, setPosts] = useState(mockPosts)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('Popular')

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                liked: !post.engagement.liked,
                likes: post.engagement.liked 
                  ? post.engagement.likes - 1 
                  : post.engagement.likes + 1,
              },
            }
          : post
      )
    )
  }

  const handleSave = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                saved: !post.engagement.saved,
              },
            }
          : post
      )
    )
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#2A2D3A',
      color: '#FFFFFF',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            zIndex: designTokens.zIndex.overlay,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div style={{
        width: isMobile ? '280px' : '280px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: designTokens.zIndex.modal,
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
        backgroundColor: '#2A2D3A',
        borderRight: '1px solid #3A3D4A',
        padding: '24px',
        overflowY: 'auto',
      }}>
        {/* Profile Section */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <img 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=2"
              alt="Cyndy Lillibridge"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #4F46E5',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '20px',
              height: '20px',
              backgroundColor: '#10B981',
              borderRadius: '50%',
              border: '3px solid #2A2D3A',
            }} />
          </div>
          <h3 style={{
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
          }}>
            Cyndy Lillibridge
          </h3>
          <p style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: '#9CA3AF',
          }}>
            Torrance, CA, United States
          </p>
          
          {/* Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '16px 0',
            borderTop: '1px dotted #4B5563',
            borderBottom: '1px dotted #4B5563',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>368</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>184.3K</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF' }}>1.04M</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Following</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ marginBottom: '32px' }}>
          {[
            { icon: '🏠', label: 'Feed', active: true },
            { icon: '🔍', label: 'Explore' },
            { icon: '❤️', label: 'My favorites' },
            { icon: '💬', label: 'Direct' },
            { icon: '📊', label: 'Stats' },
            { icon: '⚙️', label: 'Settings' },
          ].map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '12px',
              backgroundColor: item.active ? '#4F46E5' : 'transparent',
              color: item.active ? '#FFFFFF' : '#9CA3AF',
              cursor: 'pointer',
              marginBottom: '4px',
              transition: 'all 0.2s ease',
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Contacts */}
        <div>
          <h4 style={{
            margin: '0 0 16px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#FFFFFF',
            borderTop: '1px dotted #4B5563',
            paddingTop: '24px',
          }}>
            Contacts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contacts.slice(0, 5).map((contact) => (
              <div key={contact.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={contact.avatar}
                    alt={contact.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  {contact.online && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#10B981',
                      borderRadius: '50%',
                      border: '2px solid #2A2D3A',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#FFFFFF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {contact.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {contact.location}
                  </div>
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: contact.online ? '#10B981' : '#6B7280',
                  borderRadius: '50%',
                }} />
              </div>
            ))}
          </div>
          <button style={{
            width: '100%',
            padding: '8px',
            marginTop: '16px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6366F1',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            View All
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '280px',
        marginRight: isMobile ? 0 : '320px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: '1px solid #3A3D4A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#2A2D3A',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              >
                ☰
              </button>
            )}
            
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '400px',
            }}>
              <Search 
                size={20} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 44px',
                  backgroundColor: '#374151',
                  border: '1px solid #4B5563',
                  borderRadius: '24px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <Mic 
                size={20} 
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                }}
              />
            </div>
          </div>
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#6366F1',
            border: 'none',
            borderRadius: '24px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
          }}>
            <Plus size={16} />
            Create new post
          </button>
        </header>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Stories */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Stories
              </h2>
              <button style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#6366F1',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
                Watch all
              </button>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}>
              {stories.map((story) => (
                <div key={story.id} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: '70px',
                  cursor: 'pointer',
                }}>
                  <div style={{
                    position: 'relative',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: story.isAdd ? 'none' : 'linear-gradient(45deg, #6366F1, #8B5CF6)',
                    padding: story.isAdd ? '0' : '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {story.isAdd ? (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        border: '2px dashed #6B7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#374151',
                      }}>
                        <Plus size={24} color="#9CA3AF" />
                      </div>
                    ) : (
                      <img 
                        src={story.avatar}
                        alt={story.name}
                        style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #2A2D3A',
                        }}
                      />
                    )}
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    textAlign: 'center',
                    maxWidth: '70px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {story.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Feeds Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Feeds
              </h2>
              
              <div style={{
                display: 'flex',
                backgroundColor: '#374151',
                borderRadius: '24px',
                padding: '4px',
              }}>
                {['Popular', 'Latest'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: activeTab === tab ? '#6366F1' : 'transparent',
                      border: 'none',
                      borderRadius: '20px',
                      color: activeTab === tab ? '#FFFFFF' : '#9CA3AF',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {posts.map((post) => (
                <div key={post.id} style={{
                  backgroundColor: '#374151',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid #4B5563',
                }}>
                  {/* Post Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={post.user.avatar}
                        alt={post.user.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#FFFFFF',
                        }}>
                          {post.user.name}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#9CA3AF',
                        }}>
                          {post.user.pets}
                        </div>
                      </div>
                    </div>
                    <button style={{
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                    }}>
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Post Image */}
                  <div style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                  }}>
                    <img 
                      src={post.content.url}
                      alt="Post content"
                      style={{
                        width: '100%',
                        height: '300px',
                        objectFit: 'cover',
                      }}
                    />
                  </div>

                  {/* Post Content */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '14px',
                      color: '#E5E7EB',
                      lineHeight: '1.5',
                    }}>
                      {post.content.caption}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {post.content.hashtags.map((tag, index) => (
                        <span key={index} style={{
                          fontSize: '14px',
                          color: '#6366F1',
                          cursor: 'pointer',
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '16px',
                    borderTop: '1px solid #4B5563',
                  }}>
                    <div style={{ display: 'flex', gap: '24px' }}>
                      <button
                        onClick={() => handleLike(post.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          color: post.engagement.liked ? '#EF4444' : '#9CA3AF',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        <Heart size={18} fill={post.engagement.liked ? 'currentColor' : 'none'} />
                        {post.engagement.likes.toLocaleString()}
                      </button>
                      <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}>
                        <MessageCircle size={18} />
                        {post.engagement.comments.toLocaleString()}
                      </button>
                    </div>
                    <button
                      onClick={() => handleSave(post.id)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: post.engagement.saved ? '#6366F1' : '#9CA3AF',
                        cursor: 'pointer',
                      }}
                    >
                      <Bookmark size={18} fill={post.engagement.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      {!isMobile && (
        <div style={{
          width: '320px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          right: 0,
          backgroundColor: '#2A2D3A',
          borderLeft: '1px solid #3A3D4A',
          padding: '24px',
          overflowY: 'auto',
        }}>
          {/* Requests */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Requests
              </h3>
              <div style={{
                backgroundColor: '#6366F1',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
              }}>
                2
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {requests.map((request) => (
                <div key={request.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  <img 
                    src={request.avatar}
                    alt={request.name}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#FFFFFF',
                      marginBottom: '2px',
                    }}>
                      {request.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#9CA3AF',
                    }}>
                      {request.action}
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '8px',
                      marginTop: '8px',
                    }}>
                      <button style={{
                        padding: '4px 12px',
                        backgroundColor: '#6366F1',
                        border: 'none',
                        borderRadius: '16px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}>
                        Accept
                      </button>
                      <button style={{
                        padding: '4px 12px',
                        backgroundColor: '#374151',
                        border: 'none',
                        borderRadius: '16px',
                        color: '#9CA3AF',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}>
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <Calendar size={20} color="#6366F1" />
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Upcoming Events
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {upcomingEvents.slice(0, 3).map((event) => (
                <div key={event.id} style={{
                  backgroundColor: '#374151',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #4B5563',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#404756'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#374151'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img 
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#FFFFFF',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {event.title}
                      </h4>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '4px',
                      }}>
                        <Clock size={12} color="#9CA3AF" />
                        <span style={{
                          fontSize: '12px',
                          color: '#9CA3AF',
                        }}>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginBottom: '8px',
                      }}>
                        <MapPin size={12} color="#9CA3AF" />
                        <span style={{
                          fontSize: '12px',
                          color: '#9CA3AF',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {event.location}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Users size={12} color="#6366F1" />
                        <span style={{
                          fontSize: '12px',
                          color: '#6366F1',
                          fontWeight: '500',
                        }}>
                          {event.attendees} attending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button style={{
              width: '100%',
              padding: '8px',
              marginTop: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6366F1',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}>
              View All Events
            </button>
          </div>

          {/* Trending Topics */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <TrendingUp size={20} color="#EF4444" />
              <h3 style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Trending
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trendingTopics.slice(0, 4).map((topic) => (
                <div key={topic.id} style={{
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '4px',
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                        marginBottom: '2px',
                      }}>
                        {topic.category}
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6366F1',
                        marginBottom: '2px',
                      }}>
                        {topic.hashtag}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#9CA3AF',
                      }}>
                        {topic.posts} posts
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}>
                      <TrendingUp size={10} />
                      {topic.growth}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button style={{
              width: '100%',
              padding: '8px',
              marginTop: '16px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#6366F1',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}>
              Show More
            </button>
          </div>

          {/* Footer Links */}
          <div style={{
            borderTop: '1px dotted #4B5563',
            paddingTop: '16px',
            fontSize: '12px',
            color: '#6B7280',
            lineHeight: '1.5',
          }}>
            <div style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '12px' }}>About</a>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '12px' }}>Accessibility</a>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Help Center</a>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '12px' }}>Privacy and Terms</a>
              <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Advertising</a>
            </div>
            <div>Business Services</div>
          </div>
        </div>
      )}
    </div>
  )
}