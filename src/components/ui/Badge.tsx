import React from 'react'
import { designTokens } from '../../design-system/tokens'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
}: BadgeProps) {
  const getVariantStyles = () => {
    const variants = {
      default: {
        backgroundColor: designTokens.colors.gray[100],
        color: designTokens.colors.gray[700],
      },
      primary: {
        backgroundColor: designTokens.colors.primary[100],
        color: designTokens.colors.primary[700],
      },
      success: {
        backgroundColor: designTokens.colors.success[100],
        color: designTokens.colors.success[600],
      },
      warning: {
        backgroundColor: designTokens.colors.warning[100],
        color: designTokens.colors.warning[600],
      },
      error: {
        backgroundColor: designTokens.colors.error[100],
        color: designTokens.colors.error[600],
      },
      info: {
        backgroundColor: designTokens.colors.primary[50],
        color: designTokens.colors.primary[600],
      },
    }
    return variants[variant]
  }

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${designTokens.spacing[1]} ${designTokens.spacing[2]}`,
        fontSize: designTokens.typography.fontSize.xs,
      },
      md: {
        padding: `${designTokens.spacing[1]} ${designTokens.spacing[3]}`,
        fontSize: designTokens.typography.fontSize.sm,
      },
      lg: {
        padding: `${designTokens.spacing[2]} ${designTokens.spacing[4]}`,
        fontSize: designTokens.typography.fontSize.base,
      },
    }
    return sizes[size]
  }

  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: designTokens.typography.fontWeight.medium,
        borderRadius: rounded ? designTokens.borderRadius.full : designTokens.borderRadius.lg,
        ...variantStyles,
        ...sizeStyles,
      }}
    >
      {children}
    </span>
  )
}