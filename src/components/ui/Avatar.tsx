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
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20'
  }

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  }

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizes[size]} rounded-full overflow-hidden bg-gray-200 ring-2 ring-white shadow-sm`}>
        {src ? (
          <img 
            src={src} 
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {alt.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {status && (
        <div className={`
          absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]}
          rounded-full ring-2 ring-white
        `} />
      )}
      
      {verified && (
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center ring-2 ring-white">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}