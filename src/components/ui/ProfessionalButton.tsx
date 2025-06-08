import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { strategicColors } from '../../design-system/strategic-colors'

interface ProfessionalButtonProps {
  children: React.ReactNode
  variant?: 'prussian' | 'fireRed' | 'orange' | 'xanthous' | 'vanilla' | 'glass'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export default function ProfessionalButton({
  children,
  variant = 'prussian',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  fullWidth = false,
  type = 'button'
}: ProfessionalButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantStyles = () => {
    const variants = {
      prussian: {
        background: `linear-gradient(135deg, ${strategicColors.prussianBlue[500]} 0%, ${strategicColors.prussianBlue[600]} 100%)`,
        color: '#ffffff',
        boxShadow: `0 4px 12px rgba(0, 48, 73, 0.3)`,
        hoverBackground: `linear-gradient(135deg, ${strategicColors.prussianBlue[600]} 0%, ${strategicColors.prussianBlue[700]} 100%)`,
        hoverShadow: `0 8px 20px rgba(0, 48, 73, 0.4)`
      },
      fireRed: {
        background: `linear-gradient(135deg, ${strategicColors.fireRed[500]} 0%, ${strategicColors.fireRed[600]} 100%)`,
        color: '#ffffff',
        boxShadow: `0 4px 12px rgba(214, 40, 40, 0.3)`,
        hoverBackground: `linear-gradient(135deg, ${strategicColors.fireRed[600]} 0%, ${strategicColors.fireRed[700]} 100%)`,
        hoverShadow: `0 8px 20px rgba(214, 40, 40, 0.4)`
      },
      orange: {
        background: `linear-gradient(135deg, ${strategicColors.orangeWheel[500]} 0%, ${strategicColors.orangeWheel[600]} 100%)`,
        color: '#ffffff',
        boxShadow: `0 4px 12px rgba(247, 127, 0, 0.3)`,
        hoverBackground: `linear-gradient(135deg, ${strategicColors.orangeWheel[600]} 0%, ${strategicColors.orangeWheel[700]} 100%)`,
        hoverShadow: `0 8px 20px rgba(247, 127, 0, 0.4)`
      },
      xanthous: {
        background: `linear-gradient(135deg, ${strategicColors.xanthous[500]} 0%, ${strategicColors.xanthous[600]} 100%)`,
        color: '#ffffff',
        boxShadow: `0 4px 12px rgba(252, 191, 73, 0.3)`,
        hoverBackground: `linear-gradient(135deg, ${strategicColors.xanthous[600]} 0%, ${strategicColors.xanthous[700]} 100%)`,
        hoverShadow: `0 8px 20px rgba(252, 191, 73, 0.4)`
      },
      vanilla: {
        background: `linear-gradient(135deg, ${strategicColors.vanilla[500]} 0%, ${strategicColors.vanilla[600]} 100%)`,
        color: strategicColors.prussianBlue[500],
        boxShadow: `0 4px 12px rgba(234, 226, 183, 0.3)`,
        hoverBackground: `linear-gradient(135deg, ${strategicColors.vanilla[600]} 0%, ${strategicColors.vanilla[700]} 100%)`,
        hoverShadow: `0 8px 20px rgba(234, 226, 183, 0.4)`
      },
      glass: {
        background: strategicColors.glass.neutralMedium,
        backdropFilter: 'blur(20px)',
        color: '#ffffff',
        border: `1px solid ${strategicColors.glass.borderLight}`,
        boxShadow: `0 4px 12px rgba(255, 255, 255, 0.1)`,
        hoverBackground: strategicColors.glass.neutralStrong,
        hoverShadow: `0 8px 20px rgba(255, 255, 255, 0.15)`
      }
    }
    return variants[variant]
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '10px',
        gap: '6px',
        minHeight: '36px'
      },
      md: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '12px',
        gap: '8px',
        minHeight: '44px'
      },
      lg: {
        padding: '16px 32px',
        fontSize: '18px',
        borderRadius: '14px',
        gap: '10px',
        minHeight: '52px'
      }
    }
    return sizes[size]
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: variant === 'glass' ? variantStyles.border : 'none',
    fontFamily: 'Inter, sans-serif',
    fontWeight: '600',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    transform: isPressed ? 'scale(0.98)' : 'scale(1)',
    ...variantStyles,
    ...sizeStyles,
    backdropFilter: variant === 'glass' ? variantStyles.backdropFilter : undefined,
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.background = variantStyles.hoverBackground
      e.currentTarget.style.boxShadow = variantStyles.hoverShadow
      e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      e.currentTarget.style.background = variantStyles.background
      e.currentTarget.style.boxShadow = variantStyles.boxShadow
      e.currentTarget.style.transform = 'translateY(0) scale(1)'
    }
  }

  return (
    <button
      type={type}
      style={buttonStyle}
      className={`professional-btn ${className}`}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled || loading}
    >
      {/* Ripple effect container */}
      <div style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        borderRadius: 'inherit',
        pointerEvents: 'none'
      }}>
        {/* Shine effect */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
          transform: 'rotate(45deg) translateX(-100%)',
          transition: 'transform 0.6s ease',
        }} className="btn-shine" />
      </div>

      {/* Button content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles.gap,
        position: 'relative',
        zIndex: 1
      }}>
        {loading ? (
          <Loader2 size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="animate-spin" />
        ) : icon ? (
          <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
        ) : null}
        
        <span>{children}</span>
      </div>

      <style>{`
        .professional-btn:hover .btn-shine {
          transform: rotate(45deg) translateX(100%);
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </button>
  )
}