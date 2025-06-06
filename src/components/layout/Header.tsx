import React, { useState } from 'react'
import { Search, MessageCircle, Heart, Menu, Plus } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export default function Header({ onMenuClick, isMobile }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const headerStyle: React.CSSProperties = {
    position: 'sticky',
    top: 0,
    zIndex: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(24px)',
    borderBottom: '1px solid #F3F4F6',
    padding: '12px 16px'
  }

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isMobile && (
            <button
              onClick={onMenuClick}
              style={{
                padding: '8px',
                color: '#6B7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#111827'
                e.currentTarget.style.backgroundColor = '#F3F4F6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6B7280'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <Menu size={24} />
            </button>
          )}
          
          {isMobile && (
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: 'Poppins, sans-serif',
              background: 'linear-gradient(to right, #8B5CF6, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0
            }}>
              PetoGram
            </h1>
          )}
        </div>

        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: '448px', margin: '0 32px' }}>
            <div style={{ position: 'relative' }}>
              <Search 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#9CA3AF' 
                }} 
                size={20} 
              />
              <input
                type="text"
                placeholder="Search pets, people, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '14px',
                  color: '#111827',
                  outline: 'none',
                  transition: 'all 150ms ease'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0 2px #8B5CF6'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.borderColor = '#E5E7EB'
                }}
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isMobile && (
            <Button variant="ghost" size="sm">
              <Search size={20} />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" style={{ position: 'relative' }}>
            <Heart size={20} />
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              backgroundColor: '#EF4444',
              color: '#ffffff',
              fontSize: '12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              3
            </div>
          </Button>
          
          <Button variant="ghost" size="sm" style={{ position: 'relative' }}>
            <MessageCircle size={20} />
            <div style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '20px',
              height: '20px',
              backgroundColor: '#8B5CF6',
              color: '#ffffff',
              fontSize: '12px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600'
            }}>
              2
            </div>
          </Button>
          
          {isMobile && (
            <Button variant="primary" size="sm">
              <Plus size={18} />
            </Button>
          )}
          
          <div style={{ marginLeft: '8px' }}>
            <Avatar 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
              alt="John Doe"
              size="md"
              status="online"
            />
          </div>
        </div>
      </div>
    </header>
  )
}