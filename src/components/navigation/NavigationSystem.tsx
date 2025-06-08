import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  User,
  Settings,
  Menu,
  X,
  Bell,
  Plus,
  Compass,
  Bookmark,
  TrendingUp
} from 'lucide-react'

interface NavigationProps {
  isMobile: boolean
  isOpen: boolean
  onToggle: () => void
}

const navigationItems = [
  { id: 'home', name: 'Home', icon: Home, path: '/home', badge: null },
  { id: 'explore', name: 'Explore', icon: Compass, path: '/explore', badge: null },
  { id: 'notifications', name: 'Notifications', icon: Bell, path: '/notifications', badge: { count: 3, variant: 'error' } },
  { id: 'messages', name: 'Messages', icon: MessageCircle, path: '/messages', badge: { count: 2, variant: 'primary' } },
  { id: 'bookmarks', name: 'Bookmarks', icon: Bookmark, path: '/bookmarks', badge: null },
  { id: 'trending', name: 'Trending', icon: TrendingUp, path: '/trending', badge: null },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile', badge: null },
]

export default function NavigationSystem({ isMobile, isOpen, onToggle }: NavigationProps) {
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <header className="mobile-header">
          <div className="mobile-header-content">
            <button onClick={onToggle} className="menu-toggle">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <h1 className="mobile-logo">PetoGram</h1>
            
            <div className="mobile-actions">
              <button className="action-btn">
                <Search size={20} />
              </button>
              <button className="action-btn">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Navigation Sidebar */}
      <nav className={`navigation-sidebar ${isMobile ? 'mobile' : 'desktop'} ${isOpen ? 'open' : ''}`}>
        {/* Logo Section */}
        <div className="nav-header">
          <h1 className="nav-logo">PetoGram</h1>
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={isMobile ? onToggle : undefined}
              >
                <div className="nav-item-icon">
                  <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {item.badge && (
                    <span className={`nav-badge ${item.badge.variant}`}>
                      {item.badge.count}
                    </span>
                  )}
                </div>
                
                <span className="nav-item-text">{item.name}</span>
                
                {isActive && <div className="nav-indicator" />}
              </Link>
            )
          })}
        </div>

        {/* Bottom Section */}
        <div className="nav-footer">
          <Link to="/settings" className="nav-item">
            <div className="nav-item-icon">
              <Settings size={22} />
            </div>
            <span className="nav-item-text">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="mobile-overlay" onClick={onToggle} />
      )}
    </>
  )
}