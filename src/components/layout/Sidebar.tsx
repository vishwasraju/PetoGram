import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
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
  Video,
  X,
  Bookmark
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import { clearAuthenticationState } from '../../utils/auth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigationItems = [
  { id: 'saved', name: '', icon: Bookmark, path: '/saved' },
]

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help', icon: HelpCircle, path: '/help' },
]

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear authentication data
    clearAuthenticationState()
    
    // Close sidebar if mobile
    if (isMobile) {
      onClose()
    }
    
    // Redirect to intro page
    navigate('/')
  }

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
          padding: '12px 16px',
          borderRadius: '12px',
          textDecoration: 'none',
          transition: 'all 200ms ease',
          backgroundColor: isActive ? '#F5F3FF' : 'transparent',
          color: isActive ? '#7C3AED' : '#374151',
          fontWeight: isActive ? '600' : '500',
          margin: '2px 0'
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
          transition: 'all 200ms ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '16px' }}>{item.name}</span>
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

  return (
    <aside style={{
      width: '100%',
      height: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #F3F4F6',
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid #F3F4F6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
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
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div style={{ 
        padding: '24px', 
        borderBottom: '1px solid #F3F4F6',
        flexShrink: 0
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
              whiteSpace: 'nowrap',
              fontSize: '16px'
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

      {/* Scrollable Navigation Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0
      }}>
        {/* Main Navigation */}
        <nav style={{ 
          padding: '16px',
          paddingBottom: '8px'
        }}>
          {navigationItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>

        {/* Bottom Section - Now inside scrollable area */}
        <div style={{ 
          padding: '8px 16px 16px 16px',
          borderTop: '1px solid #F3F4F6',
          marginTop: 'auto'
        }}>
          {bottomItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={location.pathname === item.path}
            />
          ))}
          
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '12px 16px',
              color: '#EF4444',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'background-color 150ms ease',
              fontWeight: '500',
              width: '100%',
              fontSize: '16px',
              margin: '2px 0'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FEF2F2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{
              padding: '8px',
              color: '#EF4444',
              backgroundColor: '#FEE2E2',
              borderRadius: '8px',
              transition: 'background-color 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={20} strokeWidth={2.5} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  )
}