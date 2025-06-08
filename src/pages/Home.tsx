import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'

// Instagram-style Feed Item
function InstaFeedItem({ post, onLike, onSave }) {
  return (
    <div className="bg-transparent border border-gray-800 rounded-lg max-w-md mx-auto mb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          <img src={post.user.avatar} className="w-9 h-9 rounded-full object-cover mr-3" alt={post.user.name} />
          <span className="font-semibold text-white text-sm flex items-center">
            {post.user.name}
            {post.user.verified && <span className="ml-1 text-blue-500 text-base">✔</span>}
          </span>
          <span className="text-gray-400 text-xs ml-2">• {post.timestamp}</span>
        </div>
        <button className="text-gray-400 text-xl">...</button>
      </div>
      {/* Media */}
      {post.content.url && (
        <div className="bg-black flex items-center justify-center w-full" style={{ aspectRatio: '1/1', maxHeight: 500, overflow: 'hidden' }}>
          <img src={post.content.url} className="object-cover w-full h-full" alt="" />
        </div>
      )}
      {/* Carousel dots (static) */}
      <div className="flex justify-center items-center space-x-1 py-2">
        {[0,1,2,3,4].map(i => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? 'bg-white' : 'bg-gray-700'}`}></span>
        ))}
      </div>
      {/* Action Bar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex space-x-4 text-2xl">
          <button onClick={() => onLike(post.id)} className="focus:outline-none">{post.engagement.liked ? '❤️' : '🤍'}</button>
          <button className="focus:outline-none">💬</button>
          <button className="focus:outline-none">✈️</button>
        </div>
        <button onClick={() => onSave(post.id)} className="text-2xl focus:outline-none">{post.engagement.saved ? '🔖' : '🔲'}</button>
      </div>
      {/* Likes and Caption */}
      <div className="px-4 pb-2">
        <div className="text-sm font-semibold text-white mb-1">{post.engagement.likes.toLocaleString()} likes</div>
        <div className="text-sm text-white">
          <span className="font-semibold mr-1">{post.user.name}</span>
          {post.content.caption.length > 80 ? post.content.caption.slice(0, 80) + '… ' : post.content.caption}
          {post.content.caption.length > 80 && <button className="text-gray-400 text-xs ml-1">more</button>}
        </div>
        <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{post.timestamp} ago</div>
      </div>
    </div>
  )
}

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
      name: 'nba',
      avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      pets: '',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Tyrese Haliburton's Game 1 winner, as heard around the world!',
      hashtags: [],
    },
    engagement: {
      likes: 94116,
      comments: 0,
      shares: 0,
      liked: false,
      saved: false,
    },
    timestamp: '14h',
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
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className={`sidebar-container ${isMobile && sidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          isMobile={isMobile}
        />
      </div>
      {/* Main Feed */}
      <main className="flex-1 flex flex-col items-center bg-black min-h-screen">
        {/* Add a Post Button */}
        <div className="w-full max-w-md flex justify-center my-6">
          <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-colors text-lg">
            + Add a Post
          </button>
        </div>
        <div className="w-full max-w-md">
          {posts.map((post) => (
            <InstaFeedItem 
              key={post.id}
              post={post}
              onLike={handleLike}
              onSave={handleSave}
            />
          ))}
        </div>
      </main>
    </div>
  )
}