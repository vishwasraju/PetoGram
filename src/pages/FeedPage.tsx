import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Home, Plus, Search, Filter, TrendingUp } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function FeedPage() {
  const feedPosts = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        verified: true
      },
      content: {
        image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
        caption: 'Beautiful morning walk with my golden retriever! 🐕 #doglife #morningwalk'
      },
      engagement: {
        likes: 234,
        comments: 18,
        shares: 5
      },
      timestamp: '2h ago'
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        verified: false
      },
      content: {
        image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600',
        caption: 'My cat discovered the perfect sunny spot by the window 😸 #catsofinstagram #sunbathing'
      },
      engagement: {
        likes: 156,
        comments: 12,
        shares: 3
      },
      timestamp: '4h ago'
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
        verified: true
      },
      content: {
        image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=600',
        caption: 'Training session complete! Max is getting so good at his tricks 🎾 #dogtraining #goodboy'
      },
      engagement: {
        likes: 189,
        comments: 24,
        shares: 8
      },
      timestamp: '6h ago'
    }
  ]

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
            <Home size={24} color="#6366F1" />
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Feed
            </h1>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}>
            <Search size={20} />
          </button>
          <button style={{
            padding: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#9CA3AF',
            cursor: 'pointer',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#333'
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}>
            <Filter size={20} />
          </button>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#6366F1',
            border: 'none',
            borderRadius: '20px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}>
            <Plus size={16} />
            New Post
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Feed Filter Tabs */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid #333',
        }}>
          {['For You', 'Following', 'Trending'].map((tab, index) => (
            <button
              key={tab}
              style={{
                padding: '12px 0',
                backgroundColor: 'transparent',
                border: 'none',
                color: index === 0 ? '#6366F1' : '#9CA3AF',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                borderBottom: index === 0 ? '2px solid #6366F1' : '2px solid transparent',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (index !== 0) e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                if (index !== 0) e.currentTarget.style.color = '#9CA3AF'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Feed Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {feedPosts.map((post) => (
            <div key={post.id} style={{
              backgroundColor: '#111',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #333',
            }}>
              {/* Post Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
              }}>
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
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      {post.user.name}
                    </span>
                    {post.user.verified && (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#6366F1',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
                      </div>
                    )}
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    {post.timestamp}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <p style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                color: '#E5E7EB',
                lineHeight: '1.5',
              }}>
                {post.content.caption}
              </p>

              {/* Post Image */}
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
              }}>
                <img 
                  src={post.content.image}
                  alt="Post content"
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Post Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #333',
              }}>
                <div style={{ display: 'flex', gap: '24px' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#9CA3AF',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                    ❤️ {post.engagement.likes}
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
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                    💬 {post.engagement.comments}
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
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                    🔄 {post.engagement.shares}
                  </button>
                </div>
                <button style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#9CA3AF',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#6366F1'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}>
                  🔖
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}