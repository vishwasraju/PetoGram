import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  verified?: boolean
  className?: string
}

export default function Avatar({ 
  src, 
  alt = 'Avatar', 
  size = 'md', 
  status,
  verified = false,
  className = '' 
}: AvatarProps) {
  const getSizes = () => {
    const sizes = {
      xs: { width: '24px', height: '24px' },
      sm: { width: '32px', height: '32px' },
      md: { width: '40px', height: '40px' },
      lg: { width: '48px', height: '48px' },
      xl: { width: '64px', height: '64px' },
      '2xl': { width: '80px', height: '80px' }
    }
    return sizes[size]
  }

  const getStatusColor = () => {
    const colors = {
      online: '#10B981',
      offline: '#9CA3AF',
      away: '#F59E0B',
      busy: '#EF4444'
    }
    return colors[status || 'offline']
  }

  const getStatusSize = () => {
    const sizes = {
      xs: { width: '6px', height: '6px' },
      sm: { width: '8px', height: '8px' },
      md: { width: '10px', height: '10px' },
      lg: { width: '12px', height: '12px' },
      xl: { width: '16px', height: '16px' },
      '2xl': { width: '20px', height: '20px' }
    }
    return sizes[size]
  }

  const avatarSize = getSizes()
  const statusSize = getStatusSize()

  return (
    <div 
      style={{ 
        position: 'relative', 
        display: 'inline-block' 
      }} 
      className={className}
    >
      <div 
        style={{
          ...avatarSize,
          borderRadius: '50%',
          overflow: 'hidden',
          backgroundColor: '#E5E7EB',
          border: '2px solid #ffffff',
          boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        }}
      >
        {src ? (
          <img 
            src={src} 
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
        ) : (
          <div 
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span 
              style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {status && (
        <div 
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            ...statusSize,
            backgroundColor: getStatusColor(),
            borderRadius: '50%',
            border: '2px solid #ffffff',
          }} 
        />
      )}
      
      {verified && (
        <div 
          style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            backgroundColor: '#8B5CF6',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #ffffff',
          }}
        >
          <svg 
            style={{ width: '12px', height: '12px', color: '#ffffff' }} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      )}
    </div>
  )
}