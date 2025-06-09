import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, Filter, TrendingUp, MapPin, Users, Calendar, Star } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('discover')

  const exploreContent = [
    {
      id: '1',
      type: 'post',
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Golden Retriever Training Tips',
      author: 'Sarah Johnson',
      likes: 234,
      category: 'Training'
    },
    {
      id: '2',
      type: 'post',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Cat Behavior Explained',
      author: 'Dr. Emily Chen',
      likes: 189,
      category: 'Education'
    },
    {
      id: '3',
      type: 'post',
      image: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Best Pet Photography Tips',
      author: 'Mike Wilson',
      likes: 156,
      category: 'Photography'
    },
    {
      id: '4',
      type: 'post',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Healthy Pet Diet Guide',
      author: 'Lisa Rodriguez',
      likes: 298,
      category: 'Health'
    },
    {
      id: '5',
      type: 'post',
      image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Pet Grooming Essentials',
      author: 'James Park',
      likes: 167,
      category: 'Grooming'
    },
    {
      id: '6',
      type: 'post',
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400',
      title: 'Adventure with Your Pet',
      author: 'Anna Thompson',
      likes: 203,
      category: 'Adventure'
    }
  ]

  const trendingHashtags = [
    { tag: '#PuppyLove', posts: '45.2K' },
    { tag: '#CatsOfInstagram', posts: '38.9K' },
    { tag: '#DogTraining', posts: '23.1K' },
    { tag: '#PetPhotography', posts: '19.8K' },
    { tag: '#AdoptDontShop', posts: '16.7K' }
  ]

  const categories = [
    { name: 'All', icon: '🌟', active: true },
    { name: 'Dogs', icon: '🐕', active: false },
    { name: 'Cats', icon: '🐱', active: false },
    { name: 'Training', icon: '🎾', active: false },
    { name: 'Health', icon: '🏥', active: false },
    { name: 'Photography', icon: '📸', active: false }
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
            <Search size={24} color="#10B981" />
            <h1 style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Explore
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
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div style={{
        padding: '20px 24px',
        backgroundColor: '#111',
        borderBottom: '1px solid #333',
      }}>
        <div style={{
          position: 'relative',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <Search 
            size={20} 
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9CA3AF',
            }}
          />
          <input
            type="text"
            placeholder="Search pets, people, hashtags..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              backgroundColor: '#222',
              border: '1px solid #444',
              borderRadius: '24px',
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

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Categories */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '32px',
          overflowX: 'auto',
          paddingBottom: '8px',
        }}>
          {categories.map((category) => (
            <button
              key={category.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: category.active ? '#6366F1' : '#222',
                border: 'none',
                borderRadius: '20px',
                color: category.active ? '#fff' : '#9CA3AF',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!category.active) {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.color = '#fff'
                }
              }}
              onMouseLeave={(e) => {
                if (!category.active) {
                  e.currentTarget.style.backgroundColor = '#222'
                  e.currentTarget.style.color = '#9CA3AF'
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Trending Section */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid #333',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <TrendingUp size={24} color="#EF4444" />
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#fff',
            }}>
              Trending Hashtags
            </h2>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {trendingHashtags.map((hashtag, index) => (
              <div
                key={hashtag.tag}
                style={{
                  padding: '16px',
                  backgroundColor: '#222',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid #333',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#222'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#6366F1',
                  }}>
                    {hashtag.tag}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#10B981',
                    fontWeight: '600',
                  }}>
                    #{index + 1}
                  </span>
                </div>
                <span style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  {hashtag.posts} posts
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Explore Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {exploreContent.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#111',
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #333',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{ position: 'relative' }}>
                <img 
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 8px',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: '#fff',
                  fontWeight: '600',
                }}>
                  {item.category}
                </div>
              </div>
              
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  lineHeight: '1.4',
                }}>
                  {item.title}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    by {item.author}
                  </span>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ color: '#EF4444' }}>❤️</span>
                    <span style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontWeight: '600',
                    }}>
                      {item.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}