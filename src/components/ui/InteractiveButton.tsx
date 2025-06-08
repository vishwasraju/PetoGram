import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface InteractiveButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  icon?: React.ReactNode
  ripple?: boolean
}

export default function InteractiveButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon,
  ripple = true,
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return

    // Ripple effect
    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const newRipple = { id: Date.now(), x, y }
      
      setRipples(prev => [...prev, newRipple])
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 600)
    }

    onClick?.()
  }

  const getVariantStyles = () => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      gradient: 'btn-gradient',
    }
    return variants[variant]
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    }
    return sizes[size]
  }

  return (
    <button
      className={`interactive-btn ${getVariantStyles()} ${getSizeStyles()} ${className} ${
        disabled || loading ? 'disabled' : ''
      } ${isPressed ? 'pressed' : ''}`}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
    >
      {/* Ripple Effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      {/* Button Content */}
      <span className="btn-content">
        {loading ? (
          <Loader2 size={16} className="btn-spinner" />
        ) : icon ? (
          <span className="btn-icon">{icon}</span>
        ) : null}
        
        <span className="btn-text">{children}</span>
      </span>

      {/* Shine Effect */}
      <span className="btn-shine" />
    </button>
  )
}