import React, { useState, useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { designTokens } from '../../design-system/tokens'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const toastStyles = {
  success: {
    backgroundColor: designTokens.colors.success[50],
    borderColor: designTokens.colors.success[200],
    iconColor: designTokens.colors.success[500],
  },
  error: {
    backgroundColor: designTokens.colors.error[50],
    borderColor: designTokens.colors.error[200],
    iconColor: designTokens.colors.error[500],
  },
  warning: {
    backgroundColor: designTokens.colors.warning[50],
    borderColor: designTokens.colors.warning[200],
    iconColor: designTokens.colors.warning[500],
  },
  info: {
    backgroundColor: designTokens.colors.primary[50],
    borderColor: designTokens.colors.primary[200],
    iconColor: designTokens.colors.primary[500],
  },
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  
  const Icon = toastIcons[type]
  const styles = toastStyles[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose(id)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: designTokens.spacing[6],
        right: designTokens.spacing[6],
        zIndex: designTokens.zIndex.toast,
        maxWidth: '400px',
        width: '100%',
        backgroundColor: styles.backgroundColor,
        border: `1px solid ${styles.borderColor}`,
        borderRadius: designTokens.borderRadius['2xl'],
        boxShadow: designTokens.boxShadow.lg,
        padding: designTokens.spacing[4],
        transform: isExiting ? 'translateX(100%)' : 'translateX(0)',
        opacity: isExiting ? 0 : 1,
        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: designTokens.spacing[3] }}>
        <Icon size={20} color={styles.iconColor} />
        
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.sm,
            fontWeight: designTokens.typography.fontWeight.semibold,
            color: designTokens.colors.gray[900],
            marginBottom: message ? designTokens.spacing[1] : 0,
          }}>
            {title}
          </h4>
          
          {message && (
            <p style={{
              margin: 0,
              fontSize: designTokens.typography.fontSize.sm,
              color: designTokens.colors.gray[600],
              lineHeight: designTokens.typography.lineHeight.normal,
            }}>
              {message}
            </p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          style={{
            padding: designTokens.spacing[1],
            color: designTokens.colors.gray[400],
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: designTokens.borderRadius.md,
            cursor: 'pointer',
            transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = designTokens.colors.gray[600]
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = designTokens.colors.gray[400]
          }}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}