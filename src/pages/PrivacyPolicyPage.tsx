import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { designTokens } from '../design-system/tokens'

export default function PrivacyPolicyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: designTokens.colors.gray[50],
      padding: designTokens.spacing[8],
      textAlign: 'center',
    }}>
      <Link 
        to="/" 
        style={{
          position: 'absolute',
          top: designTokens.spacing[8],
          left: designTokens.spacing[8],
          display: 'inline-flex',
          alignItems: 'center',
          gap: designTokens.spacing[2],
          color: designTokens.colors.gray[600],
          textDecoration: 'none',
          transition: `color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = designTokens.colors.primary[600]}
        onMouseLeave={(e) => e.currentTarget.style.color = designTokens.colors.gray[600]}
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>
      <h1 style={{
        fontSize: designTokens.typography.fontSize['5xl'],
        fontWeight: designTokens.typography.fontWeight.bold,
        color: designTokens.colors.primary[600],
        marginBottom: designTokens.spacing[4],
        fontFamily: designTokens.typography.fontFamily.display.join(', '),
      }}>
        Privacy Policy
      </h1>
      <p style={{
        fontSize: designTokens.typography.fontSize.lg,
        color: designTokens.colors.gray[700],
        maxWidth: '600px',
        lineHeight: designTokens.typography.lineHeight.relaxed,
      }}>
        This is the Privacy Policy page. Our commitment to your privacy is paramount.
      </p>
    </div>
  )
} 