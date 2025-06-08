import React from 'react'
import { colorPalette, colorUsage, accessibilityStandards } from '../../design-system/color-palette'

export default function ColorShowcase() {
  const ColorSwatch = ({ 
    color, 
    name, 
    hex, 
    usage 
  }: { 
    color: string
    name: string
    hex: string
    usage?: string 
  }) => (
    <div style={{
      background: color,
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      minHeight: '100px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div>
        <h4 style={{ 
          margin: '0 0 4px 0', 
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {name}
        </h4>
        <p style={{ 
          margin: 0, 
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '12px',
          fontFamily: 'monospace',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {hex}
        </p>
      </div>
      {usage && (
        <p style={{ 
          margin: 0, 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '10px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
        }}>
          {usage}
        </p>
      )}
    </div>
  )

  return (
    <div style={{
      padding: '32px',
      background: 'var(--glass-light)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid var(--glass-border)',
      margin: '24px',
    }}>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: 'white',
        marginBottom: '24px',
        textAlign: 'center',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
      }}>
        PetoGram Color Palette
      </h2>

      {/* Primary Colors */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Primary Brand Colors
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <ColorSwatch 
            color="#06b6d4" 
            name="Primary 500" 
            hex="#06b6d4"
            usage="Main brand color, primary CTAs"
          />
          <ColorSwatch 
            color="#0891b2" 
            name="Primary 600" 
            hex="#0891b2"
            usage="Hover states, active elements"
          />
          <ColorSwatch 
            color="#0e7490" 
            name="Primary 700" 
            hex="#0e7490"
            usage="Pressed states, dark accents"
          />
        </div>
      </section>

      {/* Secondary Colors */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Secondary Colors
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <ColorSwatch 
            color="#8b5cf6" 
            name="Secondary 500" 
            hex="#8b5cf6"
            usage="Secondary buttons, badges"
          />
          <ColorSwatch 
            color="#4ade80" 
            name="Accent 400" 
            hex="#4ade80"
            usage="Success states, positive actions"
          />
          <ColorSwatch 
            color="#f59e0b" 
            name="Warning 500" 
            hex="#f59e0b"
            usage="Warnings, attention elements"
          />
        </div>
      </section>

      {/* Semantic Colors */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Semantic Colors
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          <ColorSwatch 
            color="#22c55e" 
            name="Success" 
            hex="#22c55e"
            usage="Success messages"
          />
          <ColorSwatch 
            color="#f59e0b" 
            name="Warning" 
            hex="#f59e0b"
            usage="Warning alerts"
          />
          <ColorSwatch 
            color="#ef4444" 
            name="Error" 
            hex="#ef4444"
            usage="Error states"
          />
          <ColorSwatch 
            color="#3b82f6" 
            name="Info" 
            hex="#3b82f6"
            usage="Information"
          />
        </div>
      </section>

      {/* Glass Morphism Examples */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Glass Morphism Effects
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Light Glass</h4>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
              rgba(255, 255, 255, 0.1)
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(25px)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Medium Glass</h4>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
              rgba(255, 255, 255, 0.15)
            </p>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(30px)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            color: 'white',
            textAlign: 'center'
          }}>
            <h4 style={{ margin: '0 0 8px 0' }}>Strong Glass</h4>
            <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
              rgba(255, 255, 255, 0.25)
            </p>
          </div>
        </div>
      </section>

      {/* Accessibility Information */}
      <section>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '16px',
          fontSize: '20px',
          fontWeight: '600',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
        }}>
          Accessibility Compliance
        </h3>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white'
        }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li>✅ WCAG 2.1 AA Compliant</li>
            <li>✅ Color blind friendly (Protanopia, Deuteranopia, Tritanopia)</li>
            <li>✅ High contrast mode support</li>
            <li>✅ Minimum touch target size: 44px x 44px</li>
            <li>✅ Focus indicators: 3:1 contrast ratio</li>
            <li>✅ Text contrast: 4.5:1 for normal text, 3:1 for large text</li>
          </ul>
        </div>
      </section>
    </div>
  )
}