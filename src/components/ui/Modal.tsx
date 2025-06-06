import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { designTokens } from '../../design-system/tokens'
import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const getSizeStyles = () => {
    const sizes = {
      sm: { maxWidth: '400px' },
      md: { maxWidth: '500px' },
      lg: { maxWidth: '700px' },
      xl: { maxWidth: '900px' },
    }
    return sizes[size]
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: designTokens.zIndex.modal,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: designTokens.spacing[4],
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          ...getSizeStyles(),
          backgroundColor: designTokens.colors.white,
          borderRadius: designTokens.borderRadius['3xl'],
          boxShadow: designTokens.boxShadow.xl,
          overflow: 'hidden',
          animation: 'modalSlideIn 0.3s ease-out',
        }}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${designTokens.spacing[6]} ${designTokens.spacing[6]} ${designTokens.spacing[4]}`,
              borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
            }}
          >
            {title && (
              <h2
                style={{
                  margin: 0,
                  fontSize: designTokens.typography.fontSize['2xl'],
                  fontWeight: designTokens.typography.fontWeight.bold,
                  color: designTokens.colors.gray[900],
                  fontFamily: designTokens.typography.fontFamily.display.join(', '),
                }}
              >
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X size={20} />
              </Button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div style={{ padding: designTokens.spacing[6] }}>
          {children}
        </div>
      </div>
      
      <style>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  )
}