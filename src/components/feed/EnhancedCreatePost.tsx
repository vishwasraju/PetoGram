import React, { useState } from 'react'
import { Image, Video, Smile, MapPin, Users, Calendar, Hash, Mic, Camera } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Dropdown from '../ui/Dropdown'
import { designTokens } from '../../design-system/tokens'

export default function EnhancedCreatePost() {
  const [postText, setPostText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [postType, setPostType] = useState('text')
  const [privacy, setPrivacy] = useState('public')
  const [location, setLocation] = useState('')
  const [taggedPets, setTaggedPets] = useState<string[]>([])

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: <Users size={16} /> },
    { value: 'friends', label: 'Friends Only', icon: <Users size={16} /> },
    { value: 'private', label: 'Only Me', icon: <Users size={16} /> },
  ]

  const mediaOptions = [
    { 
      id: 'photo', 
      name: 'Photo', 
      icon: Image, 
      color: designTokens.colors.success[500],
      description: 'Share a photo of your pet'
    },
    { 
      id: 'video', 
      name: 'Video', 
      icon: Video, 
      color: designTokens.colors.primary[500],
      description: 'Upload a video'
    },
    { 
      id: 'live', 
      name: 'Go Live', 
      icon: Camera, 
      color: designTokens.colors.error[500],
      description: 'Start a live stream'
    },
    { 
      id: 'voice', 
      name: 'Voice Note', 
      icon: Mic, 
      color: designTokens.colors.warning[500],
      description: 'Record a voice message'
    },
  ]

  const additionalOptions = [
    { 
      id: 'feeling', 
      name: 'Feeling/Activity', 
      icon: Smile, 
      color: designTokens.colors.warning[500] 
    },
    { 
      id: 'location', 
      name: 'Check In', 
      icon: MapPin, 
      color: designTokens.colors.error[500] 
    },
    { 
      id: 'tag', 
      name: 'Tag Pets', 
      icon: Users, 
      color: designTokens.colors.primary[500] 
    },
  ]

  const handlePost = () => {
    if (!postText.trim() && selectedMedia.length === 0) return
    
    // Handle post submission
    console.log('Posting:', { postText, selectedMedia, postType, privacy, location, taggedPets })
    
    // Reset form
    setPostText('')
    setSelectedMedia([])
    setIsExpanded(false)
    setShowModal(false)
    setLocation('')
    setTaggedPets([])
  }

  const MediaOption = ({ option }: { option: any }) => {
    const IconComponent = option.icon
    
    return (
      <button
        onClick={() => setPostType(option.id)}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: designTokens.spacing[2],
          padding: designTokens.spacing[4],
          backgroundColor: postType === option.id ? `${option.color}10` : designTokens.colors.gray[50],
          border: `2px solid ${postType === option.id ? option.color : 'transparent'}`,
          borderRadius: designTokens.borderRadius.xl,
          cursor: 'pointer',
          transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          width: '100%',
          minHeight: '100px',
        }}
        onMouseEnter={(e) => {
          if (postType !== option.id) {
            e.currentTarget.style.backgroundColor = designTokens.colors.gray[100]
          }
        }}
        onMouseLeave={(e) => {
          if (postType !== option.id) {
            e.currentTarget.style.backgroundColor = designTokens.colors.gray[50]
          }
        }}
      >
        <div style={{
          padding: designTokens.spacing[3],
          backgroundColor: option.color,
          borderRadius: designTokens.borderRadius.full,
          color: designTokens.colors.white,
        }}>
          <IconComponent size={24} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontWeight: designTokens.typography.fontWeight.semibold,
            color: designTokens.colors.gray[900],
            fontSize: designTokens.typography.fontSize.sm,
          }}>
            {option.name}
          </div>
          <div style={{
            fontSize: designTokens.typography.fontSize.xs,
            color: designTokens.colors.gray[500],
            marginTop: designTokens.spacing[1],
          }}>
            {option.description}
          </div>
        </div>
      </button>
    )
  }

  return (
    <>
      <Card style={{ marginBottom: designTokens.spacing[6] }}>
        <div style={{ display: 'flex', gap: designTokens.spacing[4] }}>
          <Avatar 
            src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="John Doe"
            size="lg"
          />
          
          <div style={{ flex: 1 }}>
            {/* <textarea
              placeholder="What's new with your pets? Share a moment, story, or update..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              style={{
                width: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                fontSize: designTokens.typography.fontSize.lg,
                color: designTokens.colors.gray[900],
                backgroundColor: 'transparent',
                fontFamily: designTokens.typography.fontFamily.sans.join(', '),
                lineHeight: designTokens.typography.lineHeight.relaxed,
                minHeight: isExpanded ? '80px' : '50px',
                transition: `min-height ${designTokens.animation.duration.normal} ${designTokens.animation.easing.ease}`,
              }}
              rows={isExpanded ? 3 : 1}
            /> */}
            
            {isExpanded && (
              <div style={{ 
                marginTop: designTokens.spacing[4], 
                display: 'flex', 
                flexDirection: 'column', 
                gap: designTokens.spacing[4],
                animation: 'fadeIn 0.3s ease-out',
              }}>
                {/* Quick Media Options */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: designTokens.spacing[2] 
                }}>
                  {mediaOptions.slice(0, 2).map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: designTokens.spacing[2],
                          padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                          color: option.color,
                          backgroundColor: `${option.color}10`,
                          border: 'none',
                          borderRadius: designTokens.borderRadius.lg,
                          cursor: 'pointer',
                          transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                          fontSize: designTokens.typography.fontSize.sm,
                          fontWeight: designTokens.typography.fontWeight.medium,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${option.color}20`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `${option.color}10`
                        }}
                      >
                        <IconComponent size={18} />
                        <span>{option.name}</span>
                      </button>
                    )
                  })}
                </div>
                
                {/* Additional Options */}
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: designTokens.spacing[2] 
                }}>
                  {additionalOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <button
                        key={option.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: designTokens.spacing[2],
                          padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                          color: designTokens.colors.gray[600],
                          backgroundColor: designTokens.colors.gray[50],
                          border: 'none',
                          borderRadius: designTokens.borderRadius.lg,
                          cursor: 'pointer',
                          transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                          fontSize: designTokens.typography.fontSize.sm,
                          fontWeight: designTokens.typography.fontWeight.medium,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = designTokens.colors.gray[100]
                          e.currentTarget.style.color = option.color
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = designTokens.colors.gray[50]
                          e.currentTarget.style.color = designTokens.colors.gray[600]
                        }}
                      >
                        <IconComponent size={16} />
                        <span>{option.name}</span>
                      </button>
                    )
                  })}
                </div>
                
                {/* Action Buttons */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: designTokens.spacing[4],
                  borderTop: `1px solid ${designTokens.colors.gray[100]}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[3] }}>
                    <Dropdown
                      options={privacyOptions}
                      value={privacy}
                      onChange={setPrivacy}
                      size="sm"
                    />
                    
                    <button
                      onClick={() => setShowModal(true)}
                      style={{
                        padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
                        backgroundColor: 'transparent',
                        border: `1px solid ${designTokens.colors.gray[200]}`,
                        borderRadius: designTokens.borderRadius.lg,
                        color: designTokens.colors.gray[600],
                        fontSize: designTokens.typography.fontSize.sm,
                        cursor: 'pointer',
                        transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
                      }}
                    >
                      More Options
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', gap: designTokens.spacing[2] }}>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => {
                        setIsExpanded(false)
                        setPostText('')
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      disabled={!postText.trim() && selectedMedia.length === 0}
                      onClick={handlePost}
                    >
                      Share Post
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Advanced Create Post Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create Post"
        size="lg"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: designTokens.spacing[6] }}>
          {/* Post Type Selection */}
          <div>
            <h3 style={{
              fontSize: designTokens.typography.fontSize.lg,
              fontWeight: designTokens.typography.fontWeight.semibold,
              color: designTokens.colors.gray[900],
              marginBottom: designTokens.spacing[3],
            }}>
              Choose Post Type
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: designTokens.spacing[3] 
            }}>
              {mediaOptions.map((option) => (
                <MediaOption key={option.id} option={option} />
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <Input
              label="Caption"
              placeholder="Write your caption here..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              fullWidth
            />
          </div>

          {/* Additional Settings */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: designTokens.spacing[4] 
          }}>
            <Input
              label="Location"
              placeholder="Add location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              leftIcon={<MapPin size={16} />}
              fullWidth
            />
            
            <Dropdown
              options={privacyOptions}
              value={privacy}
              onChange={setPrivacy}
              fullWidth
            />
          </div>

          {/* Action Buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            gap: designTokens.spacing[3],
            paddingTop: designTokens.spacing[4],
            borderTop: `1px solid ${designTokens.colors.gray[100]}`,
          }}>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePost}>
              Create Post
            </Button>
          </div>
        </div>
      </Modal>
      
      <style>{`
        @keyframes fadeIn {
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
    </>
  )
}