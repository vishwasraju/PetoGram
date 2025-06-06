import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Search, TrendingUp } from 'lucide-react'

export default function Explore() {
  const trendingPosts = [
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
    'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=300',
  ]

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '16px', color: '#8B5CF6' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Explore</h1>
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: '#F9FAFB', 
          borderRadius: '12px', 
          padding: '12px 16px',
          marginBottom: '20px'
        }}>
          <Search size={20} color="#9CA3AF" style={{ marginRight: '12px' }} />
          <input
            type="text"
            placeholder="Search pets, hashtags, locations..."
            style={{
              flex: 1,
              fontSize: '16px',
              color: '#111827',
              background: 'none',
              border: 'none',
              outline: 'none'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <TrendingUp size={20} color="#EF4444" />
          <span style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>Trending</span>
        </div>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '12px' 
      }}>
        {trendingPosts.map((url, index) => (
          <div key={index} style={{ position: 'relative', aspectRatio: '1' }}>
            <img 
              src={url}
              alt={`Trending post ${index + 1}`}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '12px' 
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {Math.floor(Math.random() * 1000) + 100} likes
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}