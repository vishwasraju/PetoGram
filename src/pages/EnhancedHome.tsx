import React, { useState, useEffect } from 'react'
import EnhancedSidebar from '../components/layout/EnhancedSidebar'
import EnhancedHeader from '../components/layout/EnhancedHeader'
import Post from '../components/feed/Post'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import NotificationPopup from '../components/ui/NotificationPopup'
import { SkeletonCard } from '../components/ui/Skeleton'
import { TrendingUp, Users, Calendar, MapPin, Star, Plus, Search, Mic, Heart, MessageCircle, Bookmark, MoreHorizontal, UserPlus, X, Clock, Siren as Fire, Hash, Bell, Stethoscope } from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { useNavigate, Link } from 'react-router-dom'
import { clearAuthenticationState } from '../utils/auth'

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
  {
    id: '3',
    user: {
      name: 'Jane Doe',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@janedoe_pets',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1741477/pexels-photo-1741477.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'My lovely cat enjoying the sun today! #catlife #sunnyday',
      hashtags: ['#catlife', '#sunnyday', '#petsofinstagram'],
    },
    engagement: {
      likes: 500,
      comments: 75,
      shares: 10,
      liked: false,
      saved: true,
    },
    timestamp: '1h',
  },
  {
    id: '4',
    user: {
      name: 'John Smith',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@john_pets',
      verified: false,
    },
    content: {
      type: 'video',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-dog-running-in-the-snow-1406-large.mp4',
      caption: 'Winter fun with my dog! He loves the snow. #dogsofinstagram #winterfun',
      hashtags: ['#dogsofinstagram', '#winterfun', '#playtime'],
    },
    engagement: {
      likes: 1200,
      comments: 150,
      shares: 20,
      liked: true,
      saved: false,
    },
    timestamp: '3h',
  },
  {
    id: '5',
    user: {
      name: 'Emily White',
      avatar: 'https://images.pexels.com/photos/1036620/pexels-photo-1036620.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@emily_animals',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/3331505/pexels-photo-3331505.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Morning walk with my best friend! Such a beautiful day. #dogwalk #naturelover',
      hashtags: ['#dogwalk', '#naturelover', '#goldenretriever'],
    },
    engagement: {
      likes: 950,
      comments: 110,
      shares: 15,
      liked: false,
      saved: false,
    },
    timestamp: '6h',
  },
  {
    id: '6',
    user: {
      name: 'David Brown',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: '@david_wildlife',
      verified: false,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1660721/pexels-photo-1660721.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Enjoying the serene view with my parrot. He loves to sit by the window. #parrotlife #birdwatching',
      hashtags: ['#parrotlife', '#birdwatching', '#exoticpets'],
    },
    engagement: {
      likes: 720,
      comments: 80,
      shares: 8,
      liked: true,
      saved: true,
    },
    timestamp: '8h',
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
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

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

  const handleLogout = () => {
    clearAuthenticationState()
    navigate('/')
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
      {/* {isMobile && isSidebarOpen && (
        <div
          className="mobile-overlay active"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )} */}

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

        {/* Notifications and Messages */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '40px', marginBottom: '28px' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#9CA3AF', 
              padding: 0,
              position: 'relative',
              transition: 'color 0.2s ease',
            }} 
            title="Notifications"
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <Bell size={22} />
            {/* Notification badge */}
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '16px',
              height: '16px',
              backgroundColor: '#EF4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#fff',
              fontWeight: '600',
            }}>
              3
            </div>
          </button>
          <Link to="/messages-page">
            <button style={{ 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              color: '#9CA3AF', 
              padding: 0,
              transition: 'color 0.2s ease',
            }} 
            title="Messages"
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
              <MessageCircle size={22} />
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <nav style={{ marginBottom: '4px' }}>
          {[ 
            { icon: '🏠', label: 'Feed', path: '/feed', active: false },
            { icon: '🔍', label: 'Explore', path: '/explore-page' },
            { icon: <Calendar size={20} />, label: 'Events', path: '/events-page' },
            { icon: <Stethoscope size={20} />, label: 'Appointment', path: '/appointment-page' },
            { icon: '⚙️', label: 'Settings', path: '/settings-page' },
          ].map((item, index) => (
            <Link 
              to={item.path}
              key={index} 
              style={{
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
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              if (!item.active) {
                e.currentTarget.style.backgroundColor = '#3A3D4A'
                e.currentTarget.style.color = '#FFFFFF'
              }
            }}
            onMouseLeave={(e) => {
              if (!item.active) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#9CA3AF'
              }
            }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Log Out Button */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '12px',
            color: '#EF4444',
            fontWeight: '600',
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: '#18181b',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27272a'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#18181b'}
        >
          🚪 Log Out
        </button>
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#6B7280',
          lineHeight: '1.5',
        }}>
          <div style={{ marginBottom: '8px' }}>
            <a href="#" style={{ color: '#6B7280', textDecoration: 'none', marginRight: '12px' }}>About</a>
            <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Help Center</a>
          </div>
          <div>
            <a href="#" style={{ color: '#6B7280', textDecoration: 'none' }}>Privacy and Terms</a>
          </div>
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
          {/* Left: Search Bar */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              flex: 1,
              maxWidth: '250px',
            }}>
              <Search 
                size={18} 
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
                  padding: '8px 12px 8px 38px',
                  backgroundColor: '#18181b',
                  border: '1px solid #4B5563',
                  borderRadius: '24px',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <Mic 
                size={16} 
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
          {/* Center: Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <span style={{
              fontFamily: 'Comic Sans MS, Comic Sans, cursive',
              fontSize: '2.2rem',
              fontWeight: 400,
              color: '#fff',
              letterSpacing: '1px',
              userSelect: 'none',
            }}>
              PetoGram
            </span>
          </div>
          {/* Right: Create Post Button */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => navigate('/create-post')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                backgroundColor: '#6366F1',
                border: 'none',
                borderRadius: '24px',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4F46E5'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#6366F1'}
            >
              <Plus size={20} />
              Create new post
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{
          padding: '24px',
          maxWidth: '600px',
          margin: '0 auto',
          width: '100%',
        }}>
          {/* Feeds Section */}
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

      {/* Right Sidebar */}
      {!isMobile && (
        <div style={{
          width: '320px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          right: 0,
          backgroundColor: '#1E1E2D',
          borderLeft: '1px solid #374151',
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.id} style={{
                  backgroundColor: '#374151',
                  borderRadius: '10px',
                  padding: '10px',
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
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <img 
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4 style={{
                        margin: '0 0 2px 0',
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
                        gap: '2px',
                        marginBottom: '2px',
                      }}>
                        <Clock size={10} color="#9CA3AF" />
                        <span style={{ fontSize: '12px' }}>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2px',
                        marginBottom: '4px',
                      }}>
                        <MapPin size={10} color="#9CA3AF" />
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
                        gap: '2px',
                      }}>
                        <Users size={10} color="#6366F1" />
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
            
            <button
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '1px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#6366F1',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/events-page')}
            >
              Explore more events
            </button>
          </div>

          {/* Trending Topics */}
          <div style={{ marginBottom: '31px' }}>
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
            
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '10px',
            }}>
              {trendingTopics.slice(0, 3).map(topic => (
                <div key={topic.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '14px', color: '#6366F1', fontWeight: '600' }}>{topic.hashtag}</span>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{topic.posts} Posts</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: '#9CA3AF' }}>
                    <TrendingUp size={12} style={{ marginRight: '4px', color: '#22C55E' }} />
                    <span style={{ color: '#22C55E', marginRight: '8px' }}>{topic.growth}</span>
                    <span>{topic.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      <NotificationPopup 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  )
}