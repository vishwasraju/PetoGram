import React from 'react'
import { TestimonialCard, TestimonialAuthor } from '../ui/testimonial-card'
import { designTokens } from '../../design-system/tokens'

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title,
  description,
  testimonials,
  className = ''
}: TestimonialsSectionProps) {
  return (
    <section style={{
      backgroundColor: designTokens.colors.gray[50],
      padding: `${designTokens.spacing[20]} ${designTokens.spacing[8]}`,
      position: 'relative',
      zIndex: 10,
    }} className={className}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: designTokens.spacing[16],
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: designTokens.spacing[4],
        }}>
          <h2 style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize['4xl'],
            fontWeight: designTokens.typography.fontWeight.bold,
            color: designTokens.colors.gray[900],
            fontFamily: designTokens.typography.fontFamily.display.join(', '),
            maxWidth: '720px',
            lineHeight: designTokens.typography.lineHeight.tight,
          }}>
            {title}
          </h2>
          <p style={{
            margin: 0,
            fontSize: designTokens.typography.fontSize.lg,
            color: designTokens.colors.gray[600],
            maxWidth: '600px',
            lineHeight: designTokens.typography.lineHeight.relaxed,
          }}>
            {description}
          </p>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            overflow: 'hidden',
            padding: designTokens.spacing[2],
            gap: designTokens.spacing[4],
            width: '100%',
          }}>
            <div style={{
              display: 'flex',
              gap: designTokens.spacing[4],
              animation: 'marquee 40s linear infinite',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.animationPlayState = 'paused'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.animationPlayState = 'running'
            }}>
              {/* Repeat testimonials multiple times for continuous scroll */}
              {[...Array(4)].map((_, setIndex) => (
                testimonials.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          {/* Gradient overlays for fade effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '20%',
            background: `linear-gradient(to right, ${designTokens.colors.gray[50]}, transparent)`,
            pointerEvents: 'none',
            zIndex: 1,
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '20%',
            background: `linear-gradient(to left, ${designTokens.colors.gray[50]}, transparent)`,
            pointerEvents: 'none',
            zIndex: 1,
          }} />
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - ${designTokens.spacing[4]})); }
        }
      `}</style>
    </section>
  )
}