import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Home as HomeIcon, 
  User, 
  Video, 
  MessageCircle, 
  Calendar, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Search, 
  Bell, 
  Heart, 
  Share, 
  MoreHorizontal, 
  Play, 
  Volume2, 
  VolumeX, 
  Menu, 
  X 
} from 'lucide-react'

interface Post {
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
  }
  timestamp: string
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Max & Luna',
      verified: true,
    },
    content: {
      type: 'video',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Max and Luna playing together. Rare sight! 😊 Best friends forever!',
      hashtags: ['#PetPals', '#DogAndCat', '#BestFriends'],
    },
    engagement: {
      likes: 247,
      comments: 23,
      shares: 12,
      liked: false,
    },
    timestamp: 'Jun 16',
  },
  {
    id: '2',
    user: {
      name: 'Sarah Miller',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Bella',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Bella discovered the sprinkler today! 💦 First time seeing her this excited about water!',
      hashtags: ['#GoldenRetriever', '#WaterDog', '#SummerFun'],
    },
    engagement: {
      likes: 189,
      comments: 31,
      shares: 8,
      liked: true,
    },
    timestamp: '2h',
  },
  {
    id: '3',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Whiskers',
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Whiskers found the perfect sunny spot for his afternoon nap ☀️',
      hashtags: ['#CatLife', '#SunnyDay', '#Napping'],
    },
    engagement: {
      likes: 156,
      comments: 18,
      shares: 5,
      liked: false,
    },
    timestamp: '4h',
  },
]

const sidebarItems = [
  { id: 'home', name: 'Home', icon: HomeIcon, path: '/', active: true },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile', active: false },
  { id: 'explore', name: 'Explore', icon: Search, path: '/explore', active: false },
  { id: 'zoomies', name: 'Zoomies', icon: Video, path: '/zoomies', active: false },
  { id: 'messages', name: 'Messages', icon: MessageCircle, path: '/messages', active: false },
  { id: 'book', name: 'Book Services', icon: Calendar, path: '/book', active: false },
]

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help & Support', icon: HelpCircle, path: '/help' },
]

export default function Home() {
  const [posts, setPosts] = useState(mockPosts)
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 768)
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

  const toggleMute = (postId: string) => {
    setMutedVideos(current => {
      const newSet = new Set(current)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const renderSidebar = () => (
    <div className={`sidebar ${isMobile ? 'mobile-sidebar' : ''} ${isMobile && !sidebarOpen ? 'hidden-sidebar' : ''}`}>
      {/* Mobile Close Button */}
      {isMobile && (
        <div className="mobile-sidebar-header">
          <h2 className="mobile-sidebar-title">Menu</h2>
          <button 
            className="close-sidebar-button"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* User Profile Section */}
      <div className="user-section">
        <img 
          src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
          alt="User Avatar"
          className="user-avatar"
        />
        <div className="user-info">
          <div className="user-name">John Doe</div>
          <div className="user-handle">@johndoe</div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="nav-section">
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`nav-item ${item.active ? 'active-nav-item' : ''}`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <IconComponent size={20} strokeWidth={2} />
              <span className={`nav-text ${item.active ? 'active-nav-text' : ''}`}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="bottom-section">
        {bottomItems.map((item) => {
          const IconComponent = item.icon
          return (
            <Link key={item.id} to={item.path} className="nav-item">
              <IconComponent size={20} strokeWidth={2} />
              <span className="nav-text">{item.name}</span>
            </Link>
          )
        })}
        
        <button className="logout-item">
          <LogOut size={20} strokeWidth={2} />
          <span className="logout-text">Log Out</span>
        </button>
      </div>
    </div>
  )

  const renderHeader = () => (
    <header className="header">
      {isMobile && (
        <button 
          className="menu-button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
      )}
      
      <h1 className="logo">PetoGram</h1>
      
      <div className="header-actions">
        {!isMobile && (
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
            />
          </div>
        )}
        
        <button className="header-button">
          <MessageCircle size={20} />
        </button>
        
        <button className="header-button notification-button">
          <Bell size={20} />
          <div className="notification-badge">
            <span className="badge-text">3</span>
          </div>
        </button>
        
        <button className="user-button">
          {!isMobile && <span className="user-button-text">John</span>}
          <img 
            src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="User Avatar"
            className="header-avatar"
          />
        </button>
      </div>
    </header>
  )

  const renderCreatePost = () => (
    <div className="create-post-container">
      <img 
        src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
        alt="User Avatar"
        className="create-post-avatar"
      />
      <textarea
        className="create-post-input"
        placeholder="What's new with your pets?"
        rows={2}
      />
    </div>
  )

  const renderPostActions = () => (
    <div className="post-actions-container">
      <button className="post-action-button">
        <span>📸 Post</span>
      </button>
      <button className="post-action-button">
        <span>🎬 Zoomies</span>
      </button>
      <button className="post-action-button">
        <span>📹 Video</span>
      </button>
    </div>
  )

  const renderPost = (post: Post) => (
    <article key={post.id} className="post-container">
      {/* Post Header */}
      <div className="post-header">
        <img src={post.user.avatar} alt={`${post.user.name} avatar`} className="post-avatar" />
        <div className="post-user-info">
          <div className="post-user-name-row">
            <span className="post-user-name">{post.user.name}</span>
            {post.user.verified && (
              <div className="verified-badge">
                <span className="verified-text">✓</span>
              </div>
            )}
          </div>
          <span className="post-user-pets">{post.user.pets} • {post.timestamp}</span>
        </div>
        <button className="post-more-button">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Post Caption */}
      <p className="post-caption">{post.content.caption}</p>
      
      {/* Hashtags */}
      <div className="hashtag-container">
        {post.content.hashtags.map((tag, index) => (
          <span key={index} className="hashtag">{tag} </span>
        ))}
      </div>

      {/* Post Content */}
      <div className="post-content-container">
        <img 
          src={post.content.url}
          alt="Post content"
          className="post-image"
        />
        {post.content.type === 'video' && (
          <div className="video-overlay">
            <button className="play-button">
              <Play size={24} fill="white" />
            </button>
            <button 
              className="mute-button"
              onClick={() => toggleMute(post.id)}
            >
              {mutedVideos.has(post.id) ? (
                <VolumeX size={16} />
              ) : (
                <Volume2 size={16} />
              )}
            </button>
            <div className="video-progress">
              <span className="video-time">0:00</span>
            </div>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <p className="likes-count">{post.engagement.likes} likes</p>

      {/* Engagement Bar */}
      <div className="engagement-bar">
        <button 
          className="engagement-button"
          onClick={() => handleLike(post.id)}
        >
          <Heart 
            size={20} 
            fill={post.engagement.liked ? "#EF4444" : "transparent"}
            color={post.engagement.liked ? "#EF4444" : "#6B7280"}
          />
          <span>Like</span>
        </button>
        
        <button className="engagement-button">
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>
        
        <button className="engagement-button">
          <Share size={20} />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <div className="comment-section">
        <img 
          src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
          alt="User Avatar"
          className="comment-avatar"
        />
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button className="post-comment-button">
          <span>Post</span>
        </button>
      </div>
    </article>
  )

  return (
    <div className="app-container">
      <div className="layout">
        {/* Sidebar */}
        {renderSidebar()}
        
        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div 
            className="overlay"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="main-content">
          {/* Header */}
          {renderHeader()}

          {/* Content */}
          <div className="content-scroll">
            <div className="content-container">
              {/* Create Post */}
              {renderCreatePost()}
              {renderPostActions()}

              {/* Posts Feed */}
              <div className="feed-container">
                {posts.map(renderPost)}
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .app-container {
          min-height: 100vh;
          background-color: #ffffff;
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .sidebar {
          width: 280px;
          background-color: #ffffff;
          border-right: 1px solid #f1f1f1;
          padding: 24px 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mobile-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1000;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          width: 280px;
        }

        .hidden-sidebar {
          transform: translateX(-280px);
        }

        .mobile-sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 0 24px 0;
          border-bottom: 1px solid #f1f1f1;
          margin-bottom: 24px;
        }

        .mobile-sidebar-title {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin: 0;
          font-family: 'Poppins', sans-serif;
        }

        .close-sidebar-button {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6B7280;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .close-sidebar-button:hover {
          background-color: #F3F4F6;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 999;
        }

        .user-section {
          display: flex;
          align-items: center;
          margin-bottom: 32px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 24px;
          margin-right: 12px;
          object-fit: cover;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          font-family: 'Inter', sans-serif;
        }

        .user-handle {
          font-size: 14px;
          color: #6B7280;
          font-family: 'Inter', sans-serif;
        }

        .nav-section {
          flex: 1;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 4px;
          text-decoration: none;
          color: #6B7280;
          transition: all 0.2s ease;
        }

        .nav-item:hover {
          background-color: #F9FAFB;
        }

        .active-nav-item {
          background-color: #EDE9FE;
          color: #8B5CF6;
        }

        .nav-text {
          font-size: 16px;
          font-weight: 500;
          margin-left: 12px;
          font-family: 'Inter', sans-serif;
        }

        .active-nav-text {
          color: #8B5CF6;
        }

        .bottom-section {
          border-top: 1px solid #f1f1f1;
          padding-top: 16px;
        }

        .logout-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-radius: 12px;
          margin-top: 8px;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          color: #EF4444;
          transition: all 0.2s ease;
        }

        .logout-item:hover {
          background-color: #FEF2F2;
        }

        .logout-text {
          font-size: 16px;
          font-weight: 500;
          margin-left: 12px;
          font-family: 'Inter', sans-serif;
        }

        .main-content {
          flex: 1;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid #f1f1f1;
          background-color: #ffffff;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .menu-button {
          padding: 8px;
          margin-right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #111827;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .menu-button:hover {
          background-color: #F3F4F6;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          color: #8B5CF6;
          font-family: 'Poppins', sans-serif;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .search-container {
          display: flex;
          align-items: center;
          background-color: #F9FAFB;
          border-radius: 24px;
          padding: 8px 16px;
          min-width: 300px;
        }

        .search-icon {
          margin-right: 8px;
          color: #9CA3AF;
        }

        .search-input {
          flex: 1;
          font-size: 14px;
          color: #111827;
          background: none;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .search-input::placeholder {
          color: #9CA3AF;
        }

        .header-button {
          position: relative;
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6B7280;
          transition: color 0.2s ease;
          border-radius: 8px;
        }

        .header-button:hover {
          color: #111827;
          background-color: #F3F4F6;
        }

        .notification-button {
          position: relative;
        }

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background-color: #EF4444;
          border-radius: 8px;
          min-width: 16px;
          height: 16px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .badge-text {
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #111827;
          padding: 8px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .user-button:hover {
          background-color: #F3F4F6;
        }

        .user-button-text {
          font-size: 14px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

        .header-avatar {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          object-fit: cover;
        }

        .content-scroll {
          flex: 1;
          overflow-y: auto;
        }

        .content-container {
          padding-bottom: 24px;
        }

        .create-post-container {
          display: flex;
          align-items: flex-start;
          background-color: #F9FAFB;
          margin: 16px;
          padding: 16px;
          border-radius: 16px;
          gap: 12px;
        }

        .create-post-avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          object-fit: cover;
        }

        .create-post-input {
          flex: 1;
          font-size: 16px;
          color: #111827;
          background: none;
          border: none;
          outline: none;
          resize: none;
          font-family: 'Inter', sans-serif;
        }

        .create-post-input::placeholder {
          color: #9CA3AF;
        }

        .post-actions-container {
          display: flex;
          padding: 0 16px;
          margin-bottom: 16px;
          gap: 8px;
        }

        .post-action-button {
          flex: 1;
          padding: 12px 16px;
          background-color: #F3F4F6;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6B7280;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s ease;
        }

        .post-action-button:hover {
          background-color: #E5E7EB;
        }

        .feed-container {
          padding: 0 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-container {
          background-color: #ffffff;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid #f1f1f1;
        }

        .post-header {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }

        .post-avatar {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          margin-right: 12px;
          object-fit: cover;
        }

        .post-user-info {
          flex: 1;
        }

        .post-user-name-row {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .post-user-name {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          font-family: 'Inter', sans-serif;
        }

        .verified-badge {
          width: 16px;
          height: 16px;
          background-color: #8B5CF6;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .verified-text {
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }

        .post-user-pets {
          font-size: 14px;
          color: #6B7280;
          margin-top: 2px;
          font-family: 'Inter', sans-serif;
        }

        .post-more-button {
          padding: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6B7280;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }

        .post-more-button:hover {
          background-color: #F3F4F6;
        }

        .post-caption {
          font-size: 16px;
          line-height: 1.5;
          color: #111827;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }

        .hashtag-container {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .hashtag {
          font-size: 16px;
          color: #8B5CF6;
          font-family: 'Inter', sans-serif;
        }

        .post-content-container {
          position: relative;
          margin-bottom: 12px;
        }

        .post-image {
          width: 100%;
          height: 300px;
          border-radius: 12px;
          object-fit: cover;
        }

        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .play-button {
          width: 60px;
          height: 60px;
          border-radius: 30px;
          background-color: rgba(0, 0, 0, 0.6);
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .mute-button {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 16px;
          background-color: rgba(0, 0, 0, 0.6);
          border: none;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }

        .video-progress {
          position: absolute;
          bottom: 16px;
          left: 16px;
        }

        .video-time {
          color: #ffffff;
          font-size: 12px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }

        .likes-count {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 8px;
          font-family: 'Inter', sans-serif;
        }

        .engagement-bar {
          display: flex;
          border-top: 1px solid #f1f1f1;
          border-bottom: 1px solid #f1f1f1;
          padding: 8px 0;
          margin-bottom: 12px;
        }

        .engagement-button {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 8px;
          gap: 6px;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #6B7280;
          font-family: 'Inter', sans-serif;
          transition: color 0.2s ease;
          border-radius: 8px;
        }

        .engagement-button:hover {
          color: #111827;
          background-color: #F9FAFB;
        }

        .comment-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          object-fit: cover;
        }

        .comment-input {
          flex: 1;
          background-color: #F9FAFB;
          border-radius: 20px;
          padding: 8px 16px;
          font-size: 14px;
          color: #111827;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
        }

        .comment-input::placeholder {
          color: #9CA3AF;
        }

        .post-comment-button {
          background-color: #8B5CF6;
          padding: 8px 16px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          transition: background-color 0.2s ease;
        }

        .post-comment-button:hover {
          background-color: #7C3AED;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
          .sidebar {
            display: none;
          }

          .main-content {
            width: 100%;
          }

          .header {
            padding: 12px 16px;
          }

          .header-actions {
            gap: 8px;
          }

          .logo {
            font-size: 20px;
          }

          .create-post-container {
            margin: 12px;
            padding: 12px;
          }

          .post-actions-container {
            padding: 0 12px;
            margin-bottom: 12px;
          }

          .feed-container {
            padding: 0 12px;
            gap: 12px;
          }

          .post-container {
            padding: 12px;
          }

          .post-image {
            height: 250px;
          }

          .post-caption {
            font-size: 15px;
          }

          .hashtag {
            font-size: 15px;
          }

          .engagement-button {
            font-size: 13px;
            padding: 6px;
          }

          .comment-input {
            font-size: 14px;
            padding: 8px 12px;
          }

          .post-comment-button {
            padding: 8px 12px;
            font-size: 13px;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 10px 12px;
          }

          .logo {
            font-size: 18px;
          }

          .create-post-container {
            margin: 8px;
            padding: 10px;
          }

          .post-actions-container {
            padding: 0 8px;
            gap: 6px;
          }

          .post-action-button {
            padding: 10px 8px;
            font-size: 13px;
          }

          .feed-container {
            padding: 0 8px;
            gap: 10px;
          }

          .post-container {
            padding: 10px;
          }

          .post-image {
            height: 220px;
          }

          .post-caption {
            font-size: 14px;
          }

          .hashtag {
            font-size: 14px;
          }

          .engagement-button {
            font-size: 12px;
            gap: 4px;
          }

          .engagement-button span {
            display: none;
          }

          .comment-section {
            gap: 8px;
          }

          .comment-avatar {
            width: 28px;
            height: 28px;
            border-radius: 14px;
          }

          .comment-input {
            font-size: 13px;
            padding: 6px 12px;
          }

          .post-comment-button {
            padding: 6px 10px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}