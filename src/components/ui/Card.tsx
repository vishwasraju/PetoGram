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
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    border: '1px solid #F3F4F6',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    padding: getPadding(),
    transition: hover ? 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
    ...style,
  }

  const hoverStyle: React.CSSProperties = hover ? {
    ':hover': {
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderColor: '#E5E7EB',
    }
  } : {}

  return (
    <div 
      style={cardStyle}
      className={className}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        e.currentTarget.style.borderColor = '#E5E7EB'
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.boxShadow = '0 1px 2px 0 rgb(0 0 0 / 0.05)'
        e.currentTarget.style.borderColor = '#F3F4F6'
      } : undefined}
    >
      {children}
    </div>
  )
}