import React, { forwardRef } from 'react'
import { designTokens } from '../../design-system/tokens'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
  inputSize?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  inputSize = 'md',
  fullWidth = false,
  className = '',
  style,
  ...props
}, ref) => {
  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: leftIcon || rightIcon 
          ? `${designTokens.spacing[2]} ${designTokens.spacing[10]} ${designTokens.spacing[2]} ${leftIcon ? designTokens.spacing[10] : designTokens.spacing[3]}`
          : `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
        fontSize: designTokens.typography.fontSize.sm,
        height: '36px',
      },
      md: {
        padding: leftIcon || rightIcon 
          ? `${designTokens.spacing[3]} ${designTokens.spacing[12]} ${designTokens.spacing[3]} ${leftIcon ? designTokens.spacing[12] : designTokens.spacing[4]}`
          : `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
        fontSize: designTokens.typography.fontSize.base,
        height: '44px',
      },
      lg: {
        padding: leftIcon || rightIcon 
          ? `${designTokens.spacing[4]} ${designTokens.spacing[12]} ${designTokens.spacing[4]} ${leftIcon ? designTokens.spacing[12] : designTokens.spacing[5]}`
          : `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
        fontSize: designTokens.typography.fontSize.lg,
        height: '52px',
      },
    }
    return sizes[inputSize]
  }

  const getVariantStyles = () => {
    const variants = {
      default: {
        backgroundColor: designTokens.colors.white,
        border: `1px solid ${error ? designTokens.colors.error[500] : designTokens.colors.gray[200]}`,
      },
      filled: {
        backgroundColor: designTokens.colors.gray[50],
        border: `1px solid ${error ? designTokens.colors.error[500] : 'transparent'}`,
      },
      outlined: {
        backgroundColor: 'transparent',
        border: `2px solid ${error ? designTokens.colors.error[500] : designTokens.colors.gray[200]}`,
      },
    }
    return variants[variant]
  }

  const sizeStyles = getSizeStyles()
  const variantStyles = getVariantStyles()

  const inputStyles = {
    width: fullWidth ? '100%' : 'auto',
    ...sizeStyles,
    ...variantStyles,
    borderRadius: designTokens.borderRadius.xl,
    color: designTokens.colors.gray[900],
    fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    fontWeight: designTokens.typography.fontWeight.normal,
    lineHeight: designTokens.typography.lineHeight.normal,
    outline: 'none',
    transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
    ...style,
  }

  return (
    <div style={{ width: fullWidth ? '100%' : 'auto' }}>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: designTokens.spacing[2],
            fontSize: designTokens.typography.fontSize.sm,
            fontWeight: designTokens.typography.fontWeight.medium,
            color: designTokens.colors.gray[700],
          }}
        >
          {label}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: designTokens.spacing[3],
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.gray[400],
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          style={inputStyles}
          className={className}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.boxShadow = `0 0 0 2px ${designTokens.colors.primary[500]}`
              e.currentTarget.style.borderColor = 'transparent'
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = error ? designTokens.colors.error[500] : designTokens.colors.gray[200]
          }}
          {...props}
        />
        
        {rightIcon && (
          <div
            style={{
              position: 'absolute',
              right: designTokens.spacing[3],
              top: '50%',
              transform: 'translateY(-50%)',
              color: designTokens.colors.gray[400],
              pointerEvents: 'none',
            }}
          >
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p
          style={{
            marginTop: designTokens.spacing[1],
            fontSize: designTokens.typography.fontSize.sm,
            color: error ? designTokens.colors.error[500] : designTokens.colors.gray[500],
            margin: `${designTokens.spacing[1]} 0 0 0`,
          }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input