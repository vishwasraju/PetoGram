import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Settings, MapPin, Calendar } from 'lucide-react'

export default function Profile() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '16px', color: '#8B5CF6' }}>
          <ArrowLeft size={24} />
        </Link>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>Profile</h1>
      </div>
      
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <img 
          src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=2"
          alt="Profile"
          style={{ width: '120px', height: '120px', borderRadius: '60px', marginBottom: '20px', objectFit: 'cover' }}
        />
        <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#111827' }}>John Doe</h2>
        <p style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#6B7280' }}>@johndoe</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}>
            <MapPin size={16} />
            <span>New York, NY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6B7280' }}>
            <Calendar size={16} />
            <span>Joined March 2023</span>
          </div>
        </div>
        
        <p style={{ fontSize: '16px', color: '#111827', marginBottom: '24px', lineHeight: '1.5' }}>
          Proud pet parent to Max 🐕 and Luna 🐱. Love sharing their adventures and connecting with fellow pet lovers!
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>42</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>1.2K</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Followers</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>389</div>
            <div style={{ fontSize: '14px', color: '#6B7280' }}>Following</div>
          </div>
        </div>
        
        <button style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#8B5CF6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          margin: '0 auto'
        }}>
          <Settings size={16} />
          Edit Profile
        </button>
      </div>
    </div>
  )
}