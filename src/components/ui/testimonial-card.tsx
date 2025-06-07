import React from 'react'
import { designTokens } from '../../design-system/tokens'

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
  pets: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className = ''
}: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  
  return (
    <Card
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: designTokens.borderRadius['2xl'],
        border: `1px solid ${designTokens.colors.gray[100]}`,
        background: `linear-gradient(to bottom, ${designTokens.colors.white}, ${designTokens.colors.gray[50]})`,
        padding: designTokens.spacing[6],
        textAlign: 'left',
        maxWidth: '320px',
        minWidth: '280px',
        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
        cursor: href ? 'pointer' : 'default',
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: designTokens.boxShadow.sm,
      }}
      className={className}
      onMouseEnter={(e) => {
        if (href) {
          e.currentTarget.style.transform = 'translateY(-4px)'
          e.currentTarget.style.boxShadow = designTokens.boxShadow.lg
        }
      }}
      onMouseLeave={(e) => {
        if (href) {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = designTokens.boxShadow.sm
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: designTokens.spacing[3],
        marginBottom: designTokens.spacing[4],
      }}>
        <img 
          src={author.avatar}
          alt={author.name}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: `2px solid ${designTokens.colors.primary[100]}`,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.base,
            fontWeight: designTokens.typography.fontWeight.semibold,
            color: designTokens.colors.gray[900],
            lineHeight: designTokens.typography.lineHeight.tight,
          }}>
            {author.name}
          </h3>
          <p style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.sm,
            color: designTokens.colors.gray[500],
            lineHeight: designTokens.typography.lineHeight.normal,
          }}>
            {author.pets}
          </p>
        </div>
      </div>
      <p style={{
        margin: 0,
        fontSize: designTokens.typography.fontSize.base,
        color: designTokens.colors.gray[700],
        lineHeight: designTokens.typography.lineHeight.relaxed,
        fontStyle: 'italic',
      }}>
        "{text}"
      </p>
    </Card>
  )
}