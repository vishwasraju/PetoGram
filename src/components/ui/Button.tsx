import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  children, 
  className = '',
  disabled,
  style,
  ...props 
}: ButtonProps) {
  const getButtonStyles = () => {
    const baseStyles = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '500',
      transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.5 : 1,
      width: fullWidth ? '100%' : 'auto',
    }

    const variants = {
      primary: {
        background: 'linear-gradient(to right, #8B5CF6, #7C3AED)',
        color: '#ffffff',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        border: 'none',
      },
      secondary: {
        backgroundColor: '#F3F4F6',
        color: '#374151',
        border: '1px solid #E5E7EB',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#6B7280',
        border: 'none',
      },
      danger: {
        backgroundColor: '#EF4444',
        color: '#ffffff',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        border: 'none',
      }
    }

    const sizes = {
      sm: {
        padding: '6px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        gap: '6px',
      },
      md: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '12px',
        gap: '8px',
      },
      lg: {
        padding: '12px 24px',
        fontSize: '16px',
        borderRadius: '12px',
        gap: '8px',
      }
    }

    return {
      ...baseStyles,
      ...variants[variant],
      ...sizes[size],
    }
  }

  const buttonStyle = {
    ...getButtonStyles(),
    ...style,
  }

  return (
    <button
      style={buttonStyle}
      disabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && (
        <svg 
          style={{ 
            animation: 'spin 1s linear infinite',
            marginRight: '8px',
            width: '16px',
            height: '16px'
          }} 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            style={{ opacity: 0.25 }} 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
          />
          <path 
            style={{ opacity: 0.75 }} 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
          />
        </svg>
      )}
      {children}
    </button>
  )
}