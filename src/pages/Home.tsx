import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import CreatePost from '../components/feed/CreatePost'
import Post from '../components/feed/Post'

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

export default function Home() {
  const [posts, setPosts] = useState(mockPosts)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

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
    <div className="app-layout">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className={`mobile-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-container ${isMobile && sidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile}
        />
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <div className="header-container">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />
        </div>

        {/* Feed Content */}
        <div className="content-area">
          <div style={{ paddingTop: '24px', paddingBottom: '24px' }}>
            {/* Create Post */}
            <CreatePost />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Post 
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
              <button 
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  color: '#6B7280',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F9FAFB'
                  e.currentTarget.style.borderColor = '#D1D5DB'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                }}
              >
                Load More Posts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Desktop Only */}
      {!isMobile && (
        <div className="right-sidebar">
          <div className="sticky top-24 space-y-6">
            {/* Suggested Friends */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #F3F4F6',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
            }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Suggested for you
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Emma Wilson', pets: 'with Charlie', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                  { name: 'David Kim', pets: 'with Milo & Coco', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                  { name: 'Lisa Garcia', pets: 'with Buddy', avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                ].map((user, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img 
                        src={user.avatar}
                        alt={user.name}
                        style={{ width: '40px', height: '40px', borderRadius: '20px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: '500', color: '#111827' }}>{user.name}</div>
                        <div style={{ fontSize: '14px', color: '#6B7280' }}>{user.pets}</div>
                      </div>
                    </div>
                    <button style={{
                      padding: '6px 16px',
                      backgroundColor: '#8B5CF6',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 150ms ease'
                    }}>
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Hashtags */}
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #F3F4F6',
              boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
            }}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                Trending
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { tag: '#PuppyLove', posts: '45.2K posts' },
                  { tag: '#CatsOfInstagram', posts: '38.9K posts' },
                  { tag: '#DogTraining', posts: '23.1K posts' },
                  { tag: '#PetPhotography', posts: '19.8K posts' },
                ].map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#8B5CF6' }}>{item.tag}</div>
                      <div style={{ fontSize: '14px', color: '#6B7280' }}>{item.posts}</div>
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