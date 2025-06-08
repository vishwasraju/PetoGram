import React from 'react'
import { cardVariations } from '../../design-system/strategic-colors'

interface StrategicCardProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'neutral'
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  style?: React.CSSProperties
  onClick?: () => void
  floating?: boolean
}

export default function StrategicCard({ 
  children, 
  variant = 'neutral',
  className = '', 
  hover = true,
  padding = 'md',
  style,
  onClick,
  floating = false
}: StrategicCardProps) {
  const getPadding = () => {
    const paddings = {
      none: '0',
      sm: '12px',
      md: '20px',
      lg: '28px'
    }
    return paddings[padding]
  }

  const cardConfig = cardVariations[variant]

  const cardStyle: React.CSSProperties = {
    background: cardConfig.background,
    backdropFilter: cardConfig.backdropFilter,
    borderRadius: '20px',
    border: cardConfig.border,
    boxShadow: `0 8px 32px ${cardConfig.shadowColor}`,
    padding: getPadding(),
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    color: cardConfig.textColor,
    animation: floating ? 'float 6s ease-in-out infinite' : 'none',
    ...style,
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hover) {
      const element = e.currentTarget
      element.style.background = cardConfig.background.replace('0.1', '0.15').replace('0.15', '0.2')
      element.style.borderColor = cardConfig.border.replace('0.2', '0.3')
      element.style.boxShadow = `0 12px 40px ${cardConfig.shadowColor.replace('0.2', '0.25')}`
      element.style.transform = 'translateY(-4px) scale(1.02)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hover) {
      const element = e.currentTarget
      element.style.background = cardConfig.background
      element.style.borderColor = cardConfig.border.split(' ')[2] // Extract border color
      element.style.boxShadow = `0 8px 32px ${cardConfig.shadowColor}`
      element.style.transform = 'translateY(0) scale(1)'
    }
  }

  return (
    <>
      <div 
        style={cardStyle}
        className={`strategic-card ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
      >
        {/* Subtle accent line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${cardConfig.accentColor}, transparent)`,
          borderRadius: '20px 20px 0 0',
        }} />
        
        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
        
        {/* Subtle shine effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `linear-gradient(45deg, transparent, ${cardConfig.accentColor}20, transparent)`,
          transform: 'rotate(45deg)',
          opacity: 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }} className="shine-effect" />
      </div>
      
      <style>{`
        .strategic-card:hover .shine-effect {
          opacity: 1;
          animation: shine 1.5s ease-in-out;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  )
}