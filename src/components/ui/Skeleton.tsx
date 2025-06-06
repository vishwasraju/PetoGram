import React from 'react'
import { designTokens } from '../../design-system/tokens'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export default function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = designTokens.borderRadius.md,
  className = '',
  style,
}: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: designTokens.colors.gray[200],
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style,
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

// Skeleton Components for common use cases
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[2] }}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="16px"
          width={index === lines - 1 ? '75%' : '100%'}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: '32px',
    md: '40px',
    lg: '48px',
  }
  
  return (
    <Skeleton
      width={sizes[size]}
      height={sizes[size]}
      borderRadius={designTokens.borderRadius.full}
    />
  )
}

export function SkeletonCard() {
  return (
    <div
      style={{
        padding: designTokens.spacing[6],
        backgroundColor: designTokens.colors.white,
        borderRadius: designTokens.borderRadius['2xl'],
        border: `1px solid ${designTokens.colors.gray[100]}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[3], marginBottom: designTokens.spacing[4] }}>
        <SkeletonAvatar />
        <div style={{ flex: 1 }}>
          <Skeleton height="16px" width="120px" style={{ marginBottom: designTokens.spacing[1] }} />
          <Skeleton height="14px" width="80px" />
        </div>
      </div>
      
      <SkeletonText lines={2} />
      
      <Skeleton
        height="200px"
        style={{ margin: `${designTokens.spacing[4]} 0` }}
        borderRadius={designTokens.borderRadius.xl}
      />
      
      <div style={{ display: 'flex', gap: designTokens.spacing[4] }}>
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="80px" />
        <Skeleton height="32px" width="80px" />
      </div>
    </div>
  )
}