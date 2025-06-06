import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  PlusSquare,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Compass,
  Video
} from 'lucide-react'
import Avatar from '../ui/Avatar'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigationItems = [
  { id: 'home', name: 'Home', icon: Home, path: '/' },
  { id: 'explore', name: 'Explore', icon: Compass, path: '/explore' },
  { id: 'search', name: 'Search', icon: Search, path: '/search' },
  { id: 'messages', name: 'Messages', icon: MessageCircle, path: '/messages' },
  { id: 'notifications', name: 'Notifications', icon: Heart, path: '/notifications' },
  { id: 'create', name: 'Create', icon: PlusSquare, path: '/create' },
  { id: 'reels', name: 'Reels', icon: Video, path: '/reels' },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
]

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help', icon: HelpCircle, path: '/help' },
]

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation()

  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const IconComponent = item.icon
    
    return (
      <Link
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '12px',
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'all 200ms ease',
          backgroundColor: isActive ? '#F5F3FF' : 'transparent',
          color: isActive ? '#7C3AED' : '#374151',
          fontWeight: isActive ? '600' : '500'
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = '#F9FAFB'
            e.currentTarget.style.color = '#111827'
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#374151'
          }
        }}
      >
        <div style={{
          padding: '8px',
          borderRadius: '8px',
          backgroundColor: isActive ? '#8B5CF6' : '#F3F4F6',
          color: isActive ? '#ffffff' : '#6B7280',
          transition: 'all 200ms ease'
        }}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>
        <span>{item.name}</span>
        {isActive && (
          <div style={{
            marginLeft: 'auto',
            width: '4px',
            height: '32px',
            backgroundColor: '#8B5CF6',
            borderRadius: '2px'
          }} />
        )}
      </Link>
    )
  }

  const sidebarStyle: React.CSSProperties = {
    position: isMobile ? 'fixed' : 'sticky',
    top: 0,
    left: 0,
    height: '100vh',
    width: '320px',
    backgroundColor: '#ffffff',
    borderRight: '1px solid #F3F4F6',
    boxShadow: isMobile ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
    transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
    transition: 'transform 300ms ease-out',
    zIndex: isMobile ? 1000 : 10,
    display: 'flex',
    flexDirection: 'column'
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            transition: 'opacity 300ms ease'
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside style={sidebarStyle}>
        {/* Header */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #F3F4F6' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(to right, #8B5CF6, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              PetoGram
            </h1>
            {isMobile && (
              <button
                onClick={onClose}
                style={{
                  padding: '8px',
                  color: '#9CA3AF',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6B7280'
                  e.currentTarget.style.backgroundColor = '#F3F4F6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9CA3AF'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div style={{ 
          padding: '24px', 
          borderBottom: '1px solid #F3F4F6' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
              alt="John Doe"
              size="lg"
              status="online"
              verified
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ 
                fontWeight: '600', 
                color: '#111827', 
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                John Doe
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6B7280', 
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                @johndoe
              </p>
            </div>
          </div>
          
          <div style={{ 
            marginTop: '16px', 
            display: 'flex', 
            gap: '16px', 
            fontSize: '14px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', color: '#111827' }}>42</div>
              <div style={{ color: '#6B7280' }}>Posts</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', color: '#111827' }}>1.2K</div>
              <div style={{ color: '#6B7280' }}>Followers</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600', color: '#111827' }}>389</div>
              <div style={{ color: '#6B7280' }}>Following</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '16px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {navigationItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          {bottomItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={location.pathname === item.path}
            />
          ))}
          
          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            color: '#EF4444',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background-color 150ms ease',
            fontWeight: '500',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}>
            <div style={{
              padding: '8px',
              color: '#EF4444',
              backgroundColor: '#FEE2E2',
              borderRadius: '8px',
              transition: 'background-color 150ms ease'
            }}>
              <LogOut size={20} strokeWidth={2.5} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}