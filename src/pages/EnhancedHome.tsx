import React, { useState, useEffect } from 'react'
import EnhancedSidebar from '../components/layout/EnhancedSidebar'
import EnhancedHeader from '../components/layout/EnhancedHeader'
import EnhancedCreatePost from '../components/feed/EnhancedCreatePost'
import Post from '../components/feed/Post'
import Card from '../components/ui/Card'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { SkeletonCard } from '../components/ui/Skeleton'
import { TrendingUp, Users, Calendar, MapPin, Star } from 'lucide-react'
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
      name: 'Sarah Miller',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Bella & Max',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Bella discovered the sprinkler today! 💦 First time seeing her this excited about water. She went from being scared of baths to absolutely loving getting soaked in the backyard. Sometimes the best moments happen when you least expect them! 🐕✨',
      hashtags: ['#GoldenRetriever', '#WaterDog', '#SummerFun', '#PuppyJoy'],
    },
    engagement: {
      likes: 1247,
      comments: 89,
      shares: 23,
      liked: false,
      saved: false,
    },
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Luna & Shadow',
      verified: false,
    },
    content: {
      type: 'video',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Luna and Shadow playing together in the park. These two are inseparable! 🐱🐕 Best friends forever.',
      hashtags: ['#CatsAndDogs', '#BestFriends', '#PlayTime'],
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
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Whiskers',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Whiskers found the perfect sunny spot for his afternoon nap ☀️ This little guy knows how to live the good life!',
      hashtags: ['#CatLife', '#SunnyDay', '#Napping', '#LazyAfternoon'],
    },
    engagement: {
      likes: 634,
      comments: 28,
      shares: 8,
      liked: false,
      saved: false,
    },
    timestamp: '6h',
  },
]

const suggestedUsers = [
  { 
    name: 'Emma Wilson', 
    pets: 'with Charlie & Milo', 
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    mutualFriends: 12,
    verified: true
  },
  { 
    name: 'David Kim', 
    pets: 'with Coco & Luna', 
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    mutualFriends: 8,
    verified: false
  },
  { 
    name: 'Lisa Garcia', 
    pets: 'with Buddy', 
    avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
    mutualFriends: 15,
    verified: true
  },
]

const trendingHashtags = [
  { tag: '#PuppyLove', posts: '45.2K posts', growth: '+12%' },
  { tag: '#CatsOfInstagram', posts: '38.9K posts', growth: '+8%' },
  { tag: '#DogTraining', posts: '23.1K posts', growth: '+15%' },
  { tag: '#PetPhotography', posts: '19.8K posts', growth: '+5%' },
  { tag: '#AdoptDontShop', posts: '16.7K posts', growth: '+20%' },
]

const upcomingEvents = [
  {
    id: '1',
    title: 'Pet Adoption Fair',
    date: 'Tomorrow, 10:00 AM',
    location: 'Central Park',
    attendees: 234,
  },
  {
    id: '2',
    title: 'Dog Training Workshop',
    date: 'This Weekend',
    location: 'Community Center',
    attendees: 89,
  },
]

export default function EnhancedHome() {
  const [posts, setPosts] = useState(mockPosts)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)

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

  const loadMorePosts = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1500)
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      position: 'relative',
    }}>
      {/* Mobile Overlay with Blur Effect */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)',
            zIndex: designTokens.zIndex.overlay,
            opacity: sidebarOpen ? 1 : 0,
            visibility: sidebarOpen ? 'visible' : 'hidden',
            transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glass morphism effect */}
      <div style={{
        width: isMobile ? '320px' : '320px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: designTokens.zIndex.modal,
        transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
        transition: `transform ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
      }}>
        <EnhancedSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile}
        />
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : '320px',
        marginRight: isMobile ? 0 : '320px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        filter: isMobile && sidebarOpen ? 'blur(4px)' : 'none',
        transition: `filter ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
        pointerEvents: isMobile && sidebarOpen ? 'none' : 'auto',
      }}>
        {/* Header with glass effect */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: designTokens.zIndex.sticky,
        }}>
          <EnhancedHeader 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />
        </div>

        {/* Feed Content */}
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: `${designTokens.spacing[6]} ${designTokens.spacing[4]}`,
          width: '100%',
        }}>
          {/* Create Post */}
          {/* <EnhancedCreatePost /> */}

          {/* Posts Feed */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[6] }}>
            {posts.map((post) => (
              <Post 
                key={post.id}
                post={post}
                onLike={handleLike}
                onSave={handleSave}
              />
            ))}

            {/* Loading Skeletons */}
            {loading && (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            )}

            {/* Load More */}
            <div style={{ textAlign: 'center', paddingTop: designTokens.spacing[8] }}>
              <Button 
                variant="secondary" 
                onClick={loadMorePosts}
                loading={loading}
              >
                Load More Posts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Glass morphism effect */}
      {!isMobile && (
        <div style={{
          width: '320px',
          height: '100vh',
          position: 'fixed',
          top: 0,
          right: 0,
          padding: designTokens.spacing[6],
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.2)',
          filter: isMobile && sidebarOpen ? 'blur(4px)' : 'none',
          transition: `filter ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
        }}>
          <div style={{
            position: 'sticky',
            top: designTokens.spacing[6],
            display: 'flex',
            flexDirection: 'column',
            gap: designTokens.spacing[6],
          }}>
            {/* Trending Hashtags with glass effect */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: designTokens.borderRadius['2xl'],
              padding: designTokens.spacing[6],
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: designTokens.spacing[2],
                marginBottom: designTokens.spacing[4],
              }}>
                <TrendingUp size={20} color={designTokens.colors.error[500]} />
                <h3 style={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.gray[900],
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                }}>
                  Trending
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[3] }}>
                {trendingHashtags.slice(0, 3).map((item, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: designTokens.spacing[2],
                    borderRadius: designTokens.borderRadius.lg,
                    transition: `background-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}>
                    <div>
                      <div style={{
                        fontWeight: designTokens.typography.fontWeight.semibold,
                        color: designTokens.colors.primary[600],
                        fontSize: designTokens.typography.fontSize.sm,
                      }}>
                        {item.tag}
                      </div>
                      <div style={{
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.gray[500],
                      }}>
                        {item.posts}
                      </div>
                    </div>
                    <Badge variant="success" size="sm">
                      {item.growth}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events with glass effect */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: designTokens.borderRadius['2xl'],
              padding: designTokens.spacing[6],
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: designTokens.spacing[2],
                marginBottom: designTokens.spacing[4],
              }}>
                <Calendar size={20} color={designTokens.colors.primary[500]} />
                <h3 style={{
                  fontWeight: designTokens.typography.fontWeight.semibold,
                  color: designTokens.colors.gray[900],
                  margin: 0,
                  fontSize: designTokens.typography.fontSize.lg,
                }}>
                  Upcoming Events
                </h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[4] }}>
                {upcomingEvents.map((event) => (
                  <div key={event.id} style={{
                    padding: designTokens.spacing[3],
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: designTokens.borderRadius.xl,
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}>
                    <h4 style={{
                      fontWeight: designTokens.typography.fontWeight.semibold,
                      color: designTokens.colors.gray[900],
                      margin: 0,
                      marginBottom: designTokens.spacing[1],
                      fontSize: designTokens.typography.fontSize.sm,
                    }}>
                      {event.title}
                    </h4>
                    <div style={{
                      fontSize: designTokens.typography.fontSize.xs,
                      color: designTokens.colors.gray[600],
                      marginBottom: designTokens.spacing[2],
                    }}>
                      {event.date}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing[1],
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.gray[500],
                      }}>
                        <MapPin size={12} />
                        <span>{event.location}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: designTokens.spacing[1],
                        fontSize: designTokens.typography.fontSize.xs,
                        color: designTokens.colors.gray[500],
                      }}>
                        <Users size={12} />
                        <span>{event.attendees}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}