import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  style
}: CardProps) {
  const getPadding = () => {
    const paddings = {
      none: '0',
      sm: '16px',
      md: '24px',
      lg: '32px'
    }
    return paddings[padding]
  }

  const cardStyle: React.CSSProperties = {
    // Glass morphism effect
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    padding: getPadding(),
    transition: hover ? 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
    ...style,
  }

  const hoverStyle: React.CSSProperties = hover ? {
    ':hover': {
      background: 'rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(25px)',
      boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    }
  } : {}

  return (
    <div 
      style={cardStyle}
      className={className}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
        e.currentTarget.style.backdropFilter = 'blur(25px)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
        e.currentTarget.style.backdropFilter = 'blur(20px)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)'
      } : undefined}
    >
      {children}
    </div>
  )
}