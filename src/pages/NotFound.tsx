import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        fontSize: '72px', 
        fontWeight: '700', 
        color: '#8B5CF6', 
        margin: '0 0 16px 0',
        fontFamily: 'Poppins, sans-serif'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: '600', 
        color: '#111827', 
        margin: '0 0 12px 0' 
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: '#6B7280', 
        margin: '0 0 32px 0',
        maxWidth: '400px',
        lineHeight: '1.5'
      }}>
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <Link 
        to="/" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#8B5CF6',
          color: 'white',
          textDecoration: 'none',
          padding: '12px 24px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          transition: 'background-color 0.2s ease'
        }}
      >
        <Home size={20} />
        Go Home
      </Link>
    </div>
  )
}