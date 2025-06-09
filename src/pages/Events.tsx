import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Events() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/home" style={{ marginRight: '16px', color: '#8B5CF6' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Events Page</h1>
      </div>
      
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
        <p>Content for the Events page will go here.</p>
      </div>
    </div>
  )
} 