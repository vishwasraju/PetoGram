import React, { useState } from 'react'
import { Search, Heart, Menu, Plus, Bell, Settings, MessageCircle } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Dropdown from '../ui/Dropdown'
import { designTokens } from '../../design-system/tokens'
import { Link } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
  isMobile: boolean
}

export default function EnhancedHeader({ onMenuClick, isMobile }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const notificationOptions = [
    { value: 'all', label: 'All Notifications', icon: <Bell size={16} /> },
    { value: 'likes', label: 'Likes & Reactions', icon: <Heart size={16} /> },
    { value: 'comments', label: 'Comments', icon: <MessageCircle size={16} /> },
    { value: 'follows', label: 'New Followers', icon: <Plus size={16} /> },
  ]

  return (
    <header style={{
      padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
      backgroundColor: designTokens.colors.white,
      borderBottom: `1px solid ${designTokens.colors.gray[100]}`,
      position: 'relative',
      zIndex: designTokens.zIndex.sticky,
      boxShadow: designTokens.boxShadow.sm,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Left Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[4] }}>
          {isMobile && (
            <Button variant="ghost\" size="sm\" onClick={onMenuClick}>
              <Menu size={24} />
            </Button>
          )}
          
          {isMobile && (
            <h1 style={{
              fontSize: designTokens.typography.fontSize.xl,
              fontWeight: designTokens.typography.fontWeight.bold,
              fontFamily: designTokens.typography.fontFamily.display.join(', '),
              background: `linear-gradient(135deg, ${designTokens.colors.primary[600]}, ${designTokens.colors.primary[700]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}>
              PetoGram
            </h1>
          )}
        </div>

        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <div style={{ flex: 1, maxWidth: '500px', margin: `0 ${designTokens.spacing[8]}` }}>
            <Input
              leftIcon={<Search size={20} />}
              placeholder="Search pets, people, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="filled"
              fullWidth
            />
          </div>
        )}

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
          {/* Mobile Search Toggle */}
          {isMobile && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={20} />
            </Button>
          )}
          
          {/* Create Post Button */}
          <Button variant="primary" size="sm">
            <Plus size={18} />
            {!isMobile && <span>Create</span>}
          </Button>
          
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <Button variant="ghost" size="sm">
              <Bell size={20} />
            </Button>
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '20px',
              height: '20px',
              backgroundColor: designTokens.colors.error[500],
              color: designTokens.colors.white,
              fontSize: designTokens.typography.fontSize.xs,
              borderRadius: designTokens.borderRadius.full,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: designTokens.typography.fontWeight.bold,
              border: `2px solid ${designTokens.colors.white}`,
            }}>
              5
            </div>
          </div>
          
          {/* Profile Avatar */}
          <div style={{ marginLeft: designTokens.spacing[2] }}>
            <Avatar 
              src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
              alt="John Doe"
              size="md"
              status="online"
            />
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && showSearch && (
        <div style={{ 
          marginTop: designTokens.spacing[3],
          animation: 'slideDown 0.3s ease-out',
        }}>
          <Input
            leftIcon={<Search size={20} />}
            placeholder="Search pets, people, hashtags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="filled"
            fullWidth
            autoFocus
          />
        </div>
      )}
      
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  )
}