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
        border: 'none',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        padding: designTokens.spacing[6],
        textAlign: 'left',
        maxWidth: '320px',
        minWidth: '280px',
        transition: `all ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
        cursor: href ? 'pointer' : 'default',
        textDecoration: 'none',
        color: 'inherit',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
      }}
      className={`${className} testimonial-card-item`}
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

<style>{`
  .testimonial-card-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
`}</style>