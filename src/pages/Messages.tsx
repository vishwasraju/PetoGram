import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle } from 'lucide-react'

export default function Messages() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '16px', color: '#8B5CF6' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Messages</h1>
      </div>
      
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <MessageCircle size={64} color="#9CA3AF" style={{ marginBottom: '20px' }} />
        <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '600', color: '#111827' }}>No Messages Yet</h2>
        <p style={{ margin: 0, fontSize: '16px', color: '#6B7280', lineHeight: '1.5' }}>
          Start a conversation with other pet lovers in the community!
        </p>
      </div>
    </div>
  )
}