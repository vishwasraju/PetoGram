import React, { useState } from 'react'
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
  Bell,
  Bookmark,
  TrendingUp,
  Calendar,
  Users,
  Stethoscope
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { designTokens } from '../../design-system/tokens'
import { clearAuthenticationState } from '../../utils/auth'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigationItems = [
  { 
    id: 'book-appointment', 
    name: 'Book Appointment', 
    icon: Stethoscope,
    path: '/book-appointment',
    badge: null,
    description: 'Schedule an appointment'
  },
  { 
    id: 'events', 
    name: 'Events', 
    icon: Calendar, 
    path: '/events',
    badge: null,
    description: 'Join/Create event'
  },
  {
    id: 'profile',
    name: 'Profile',
    icon: User,
    path: '/profile',
    badge: null,
    description: 'View your profile'
  }
]

const quickActions = [
  { id: 'trending', name: 'Trending', icon: TrendingUp, path: '/trending' },
  { id: 'events', name: 'Events', icon: Calendar, path: '/events' },
  { id: 'groups', name: 'Groups', icon: Users, path: '/groups' },
]

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help & Support', icon: HelpCircle, path: '/help' },
]

export default function EnhancedSidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

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

  const NavItem = ({ 
    item, 
    isActive, 
    showDescription = false 
  }: { 
    item: any
    isActive: boolean
    showDescription?: boolean 
  }) => {
    const IconComponent = item.icon
    
    return (
      <Link
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: designTokens.spacing[3],
          padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
          borderRadius: designTokens.borderRadius.md,
          textDecoration: 'none',
          transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
          backgroundColor: isActive ? designTokens.colors.primary[600] : hoveredItem === item.id ? designTokens.colors.gray[800] : 'transparent',
          color: isActive ? designTokens.colors.white : designTokens.colors.gray[300],
          fontWeight: isActive ? designTokens.typography.fontWeight.semibold : designTokens.typography.fontWeight.medium,
          margin: `${designTokens.spacing[1]} 0`,
          position: 'relative',
          boxShadow: isActive ? designTokens.boxShadow.md : 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{
          padding: designTokens.spacing[2],
          borderRadius: designTokens.borderRadius.md,
          backgroundColor: isActive ? designTokens.colors.primary[500] : 'transparent',
          color: isActive ? designTokens.colors.white : designTokens.colors.gray[400],
          transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <IconComponent size={20} strokeWidth={2.5} />
          
          {item.badge && (
            <div style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              minWidth: '18px',
              height: '18px',
              borderRadius: designTokens.borderRadius.full,
              backgroundColor: item.badge.variant === 'primary' ? designTokens.colors.primary[500] :
                              item.badge.variant === 'error' ? designTokens.colors.error[500] :
                              designTokens.colors.success[500],
              color: designTokens.colors.white,
              fontSize: '10px',
              fontWeight: designTokens.typography.fontWeight.bold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
            }}>
              {typeof item.badge.count === 'number' && item.badge.count > 99 ? '99+' : item.badge.count}
            </div>
          )}
        </div>
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: designTokens.typography.fontSize.base }}>
            {item.name}
          </div>
          {showDescription && item.description && (
            <div style={{
              fontSize: designTokens.typography.fontSize.xs,
              color: designTokens.colors.gray[500],
              marginTop: '2px',
            }}>
              {item.description}
            </div>
          )}
        </div>
      </Link>
    )
  }

  return (
    <aside style={{
      width: '100%',
      height: '100vh',
      backgroundColor: designTokens.colors.white,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${designTokens.colors.gray[100]}`,
      position: 'relative',
      boxShadow: isMobile ? designTokens.boxShadow.xl : 'none',
    }}>
      {/* Header */}
      <div style={{ 
        padding: designTokens.spacing[6], 
        borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        background: `linear-gradient(135deg, ${designTokens.colors.primary[50]}, ${designTokens.colors.white})`,
      }}>
        <h1 style={{
          fontSize: designTokens.typography.fontSize['2xl'],
          fontWeight: designTokens.typography.fontWeight.bold,
          fontFamily: designTokens.typography.fontFamily.display.join(', '),
          background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
        }}>
          <Stethoscope size={32} color={designTokens.colors.primary[600]} />
        </h1>
        
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              padding: designTokens.spacing[2],
              color: designTokens.colors.gray[400],
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: designTokens.borderRadius.lg,
              cursor: 'pointer',
              transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = designTokens.colors.gray[600]
              e.currentTarget.style.backgroundColor = designTokens.colors.gray[100]
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = designTokens.colors.gray[400]
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* User Profile */}
      <div style={{ 
        padding: designTokens.spacing[6], 
        borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[3] }}>
          <Avatar 
            src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="John Doe"
            size="xl"
            status="online"
            verified
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ 
              fontWeight: designTokens.typography.fontWeight.semibold, 
              color: designTokens.colors.gray[900], 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontSize: designTokens.typography.fontSize.lg,
            }}>
              John Doe
            </h3>
            <p style={{ 
              fontSize: designTokens.typography.fontSize.sm, 
              color: designTokens.colors.gray[500], 
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              @johndoe
            </p>
            <Badge variant="primary" size="sm" style={{ marginTop: designTokens.spacing[1] }}>
              Pro Member
            </Badge>
          </div>
        </div>
        
        <div style={{ 
          marginTop: designTokens.spacing[4], 
          display: 'flex', 
          gap: designTokens.spacing[6], 
          fontSize: designTokens.typography.fontSize.sm,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontWeight: designTokens.typography.fontWeight.bold, 
              color: designTokens.colors.gray[900],
              fontSize: designTokens.typography.fontSize.lg,
            }}>42</div>
            <div style={{ color: designTokens.colors.gray[500] }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontWeight: designTokens.typography.fontWeight.bold, 
              color: designTokens.colors.gray[900],
              fontSize: designTokens.typography.fontSize.lg,
            }}>1.2K</div>
            <div style={{ color: designTokens.colors.gray[500] }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontWeight: designTokens.typography.fontWeight.bold, 
              color: designTokens.colors.gray[900],
              fontSize: designTokens.typography.fontSize.lg,
            }}>389</div>
            <div style={{ color: designTokens.colors.gray[500] }}>Following</div>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Container */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}>
        {/* Main Navigation */}
        <nav style={{ 
          padding: designTokens.spacing[4],
          paddingBottom: designTokens.spacing[2],
        }}>
          {navigationItems.map((item) => (
            <NavItem 
              key={item.id} 
              item={item} 
              isActive={location.pathname === item.path}
              showDescription={!isMobile}
            />
          ))}
        </nav>

        {/* Bottom Section */}
        <div style={{ 
          padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]} ${designTokens.spacing[4]}`,
          borderTop: `1px solid ${designTokens.colors.gray[100]}`,
          marginTop: 'auto',
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
              gap: designTokens.spacing[4],
              padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
              color: designTokens.colors.error[600],
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: designTokens.borderRadius.xl,
              cursor: 'pointer',
              transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              fontWeight: designTokens.typography.fontWeight.medium,
              width: '100%',
              fontSize: designTokens.typography.fontSize.base,
              margin: `${designTokens.spacing[1]} 0`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = designTokens.colors.error[50]
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <div style={{
              padding: designTokens.spacing[2],
              color: designTokens.colors.error[600],
              backgroundColor: designTokens.colors.error[100],
              borderRadius: designTokens.borderRadius.lg,
              transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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