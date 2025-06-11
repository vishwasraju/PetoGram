import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { supabase } from '../utils/supabase'
import { getCurrentUser, getUserProfile, getUserPets } from '../utils/auth'

interface UserProfile {
  id: string
  user_id: string
  username?: string
  bio: string
  profile_picture: string
  location: string
  birth_date?: string
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
  created_at?: string
  updated_at?: string
}

interface Post {
  id: string
  content_type: string
  caption: string
  media_urls: string[]
  likes_count: number
  comments_count: number
  created_at: string
  username?: string
}

interface UserPet {
  id: string
  name: string
  type: string
  breed: string
  age: string
  photo: string
}

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

export default function Profile() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('posts')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [pets, setPets] = useState<UserPet[]>([])
  const [loading, setLoading] = useState(true)
  const [followersCount, setFollowersCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const isOwnProfile = currentUser && profile && currentUser.id === profile.user_id
  const [showProfileCard, setShowProfileCard] = useState(false)

  const fetchPosts = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      setPosts(postsData || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
    fetchPosts();
  }, []);

  const fetchCurrentUserData = async () => {
    try {
      const user = await getCurrentUser()
      if (!user) {
        navigate('/')
        return
      }

      setCurrentUser(user)

      // Fetch user profile
      const userProfile = await getUserProfile(user.id)
      if (userProfile) {
        setProfile(userProfile)
      }

      // Fetch user pets
      const userPets = await getUserPets(user.id)
      setPets(userPets)

      // Fetch user posts
      const { data: userPosts } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (userPosts) {
        setPosts(userPosts)
      }

      // Fetch followers count
      const { count: followers } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requested_id', user.id)
        .eq('status', 'accepted')

      // Fetch following count
      const { count: following } = await supabase
        .from('user_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', user.id)
        .eq('status', 'accepted')

      setFollowersCount(followers || 0)
      setFollowingCount(following || 0)

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollowToggle = () => {
    setIsFollowing((prev) => !prev)
    // Here you would also call your backend to follow/unfollow
  }

  const tabs = [
    { id: 'posts', name: 'Posts', icon: Grid3X3, count: posts.length },
  ]

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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#111',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 100,
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
              to="/home" 
              style={{
                color: '#9CA3AF',
                transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize['2xl'],
                fontWeight: designTokens.typography.fontWeight.bold,
                color: '#fff',
                fontFamily: designTokens.typography.fontFamily.display.join(', '),
              }}>
                {profile?.username || 'My Profile'}
              </h1>
              <p style={{
                margin: 0,
                fontSize: designTokens.typography.fontSize.sm,
                color: '#9CA3AF',
              }}>
                @{profile?.username || 'username'}
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
        <Card style={{ marginBottom: designTokens.spacing[6], backgroundColor: '#111', border: '1px solid #333' }}>
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
                  src={profile?.profile_picture || 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=2'}
                  alt={profile?.username || 'Profile'}
                  style={{
                    width: '142px',
                    height: '142px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: `3px solid #000`,
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
                border: `3px solid #000`,
                boxShadow: designTokens.boxShadow.md,
              }}>
                <Shield size={16} color='#fff' />
              </div>
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize['3xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                    fontFamily: designTokens.typography.fontFamily.display.join(', '),
                  }}>
                    {profile?.username || 'User'}
                  </h2>
                  <p style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize.base,
                    color: '#9CA3AF',
                    fontWeight: 500,
                  }}>
                    @{profile?.username || 'username'}
                  </p>
                </div>
                {isOwnProfile && (
                  <Button 
                    variant="primary" 
                    size="lg" 
                    style={{ marginLeft: designTokens.spacing[6] }}
                    onClick={() => navigate('/edit-profile')}
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </Button>
                )}
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
                    color: '#fff',
                  }}>
                    {posts.length}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Posts
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                  }}>
                    {followersCount}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
                    fontWeight: designTokens.typography.fontWeight.medium,
                  }}>
                    Followers
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: designTokens.typography.fontSize['2xl'],
                    fontWeight: designTokens.typography.fontWeight.bold,
                    color: '#fff',
                  }}>
                    {followingCount}
                  </div>
                  <div style={{
                    fontSize: designTokens.typography.fontSize.sm,
                    color: '#9CA3AF',
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
                  color: '#E5E7EB',
                  lineHeight: designTokens.typography.lineHeight.relaxed,
                  marginBottom: designTokens.spacing[2],
                }}>
                  {profile?.bio || 'Pet lover sharing amazing moments with my furry friends! 🐕🐱'}
                </p>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: designTokens.spacing[4],
                  fontSize: designTokens.typography.fontSize.sm,
                  color: '#9CA3AF',
                }}>
                  {profile?.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                      <MapPin size={16} />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[1] }}>
                    <Calendar size={16} />
                    <span>Joined {new Date(profile?.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
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
              {isOwnProfile ? (
                <Button 
                  variant="primary" 
                  size="lg" 
                  style={{ width: '100%' }}
                  onClick={() => navigate('/edit-profile')}
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant={isFollowing ? 'secondary' : 'primary'} 
                    size="lg" 
                    style={{ width: '100%' }}
                    onClick={handleFollowToggle}
                  >
                    <UserPlus size={18} />
                    <span>{isFollowing ? 'Following' : 'Follow'}</span>
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    style={{ width: '100%', marginTop: designTokens.spacing[2] }}
                    onClick={() => navigate('/messages-page')}
                  >
                    <MessageCircle size={18} />
                    <span>Message</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Card style={{ backgroundColor: '#111', border: '1px solid #333' }}>
          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            borderBottom: `1px solid #333`,
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
                    color: isActive ? designTokens.colors.primary[600] : '#9CA3AF',
                    fontWeight: isActive ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
                    fontSize: designTokens.typography.fontSize.base,
                    cursor: 'pointer',
                    transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#E5E7EB'
                      e.currentTarget.style.backgroundColor = '#222'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#9CA3AF'
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
              {posts.length > 0 ? posts.map((post) => (
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
                  {post.media_urls && post.media_urls.length > 0 ? (
                    <img 
                      src={post.media_urls[0]}
                      alt={`Post ${post.id}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#222',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9CA3AF',
                    }}>
                      <Grid3X3 size={32} />
                    </div>
                  )}
                  
                  {/* Post Type Indicator */}
                  {post.content_type === 'video' && (
                    <div style={{
                      position: 'absolute',
                      top: designTokens.spacing[3],
                      right: designTokens.spacing[3],
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
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
                      color: '#fff',
                      fontWeight: designTokens.typography.fontWeight.semibold,
                    }}>
                      <Heart size={20} fill="currentColor" />
                      <span>{post.likes_count}</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: designTokens.spacing[1],
                      color: '#fff',
                      fontWeight: designTokens.typography.fontWeight.semibold,
                    }}>
                      <MessageCircle size={20} fill="currentColor" />
                      <span>{post.comments_count}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: `${designTokens.spacing[16]} ${designTokens.spacing[8]}`,
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#222',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: `0 auto ${designTokens.spacing[4]}`,
                  }}>
                    <Grid3X3 size={32} color='#9CA3AF' />
                  </div>
                  <h3 style={{
                    margin: `0 0 ${designTokens.spacing[2]} 0`,
                    fontSize: designTokens.typography.fontSize.xl,
                    fontWeight: designTokens.typography.fontWeight.semibold,
                    color: '#fff',
                  }}>
                    No posts yet
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: designTokens.typography.fontSize.base,
                    color: '#9CA3AF',
                    lineHeight: designTokens.typography.lineHeight.relaxed,
                  }}>
                    Share your first post to get started!
                  </p>
                  <Button 
                    variant="primary" 
                    style={{ marginTop: designTokens.spacing[4] }}
                    onClick={() => navigate('/create-post')}
                  >
                    <Camera size={16} />
                    Create Post
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      {showProfileCard && (
        <div className="modal-overlay">
          <div className="profile-card">
            {/* Profile card content here */}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}