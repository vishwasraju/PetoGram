import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Image, 
  Video, 
  BarChart3, 
  Type,
  Upload,
  X,
  Plus,
  Smile,
  Hash,
  MapPin,
  Users,
  Eye,
  EyeOff,
  Calendar,
  Clock,
  Play,
  Pause
} from 'lucide-react'
import { designTokens } from '../design-system/tokens'

type PostType = 'image' | 'video' | 'poll' | 'text'

interface PollOption {
  id: string
  text: string
}

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [postType, setPostType] = useState<PostType>('image')
  const [description, setDescription] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashtagInput, setHashtagInput] = useState('')
  const [location, setLocation] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [scheduledPost, setScheduledPost] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  
  // Media upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Poll states
  const [pollQuestion, setPollQuestion] = useState('')
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { id: '1', text: '' },
    { id: '2', text: '' }
  ])
  const [pollDuration, setPollDuration] = useState('24') // hours
  const [allowMultipleChoices, setAllowMultipleChoices] = useState(false)
  
  // Video states
  const [videoPlaying, setVideoPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const postTypes = [
    { 
      type: 'image' as PostType, 
      name: 'Photo', 
      icon: Image, 
      color: '#10B981',
      description: 'Share photos of your pets'
    },
    { 
      type: 'video' as PostType, 
      name: 'Video', 
      icon: Video, 
      color: '#6366F1',
      description: 'Upload videos of your pets'
    },
    { 
      type: 'poll' as PostType, 
      name: 'Poll', 
      icon: BarChart3, 
      color: '#F59E0B',
      description: 'Create polls for the community'
    },
    { 
      type: 'text' as PostType, 
      name: 'Text', 
      icon: Type, 
      color: '#EF4444',
      description: 'Share thoughts and stories'
    }
  ]

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: '🌍', description: 'Anyone can see this post' },
    { value: 'followers', label: 'Followers', icon: '👥', description: 'Only your followers can see' },
    { value: 'friends', label: 'Friends', icon: '👫', description: 'Only your friends can see' },
    { value: 'private', label: 'Only Me', icon: '🔒', description: 'Only you can see this post' }
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const newFiles = [...uploadedFiles, ...files].slice(0, 10) // Max 10 files
    setUploadedFiles(newFiles)

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviewUrls].slice(0, 10))
  }

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index])
    
    setUploadedFiles(newFiles)
    setPreviewUrls(newPreviews)
  }

  const addHashtag = () => {
    if (hashtagInput.trim() && !hashtags.includes(hashtagInput.trim())) {
      setHashtags([...hashtags, hashtagInput.trim()])
      setHashtagInput('')
    }
  }

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove))
  }

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, { id: Date.now().toString(), text: '' }])
    }
  }

  const removePollOption = (id: string) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter(option => option.id !== id))
    }
  }

  const updatePollOption = (id: string, text: string) => {
    setPollOptions(pollOptions.map(option => 
      option.id === id ? { ...option, text } : option
    ))
  }

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setVideoPlaying(!videoPlaying)
    }
  }

  const handleSubmit = () => {
    // Validate form
    if (!description.trim() && postType !== 'poll') {
      alert('Please add a description')
      return
    }

    if (postType === 'poll' && !pollQuestion.trim()) {
      alert('Please add a poll question')
      return
    }

    if (postType === 'poll' && pollOptions.some(option => !option.text.trim())) {
      alert('Please fill in all poll options')
      return
    }

    if ((postType === 'image' || postType === 'video') && uploadedFiles.length === 0) {
      alert('Please upload at least one file')
      return
    }

    // Create post data
    const postData = {
      type: postType,
      description,
      hashtags,
      location,
      privacy,
      scheduledPost,
      scheduleDate: scheduledPost ? scheduleDate : null,
      scheduleTime: scheduledPost ? scheduleTime : null,
      files: uploadedFiles,
      poll: postType === 'poll' ? {
        question: pollQuestion,
        options: pollOptions,
        duration: pollDuration,
        allowMultipleChoices
      } : null
    }

    console.log('Creating post:', postData)
    
    // Here you would typically send the data to your backend
    // For now, we'll just navigate back
    navigate('/home')
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: designTokens.typography.fontFamily.sans.join(', '),
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#111',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link 
            to="/home" 
            style={{
              color: '#9CA3AF',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
          >
            <ArrowLeft size={24} />
          </Link>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Create Post
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/home')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'transparent',
              border: '1px solid #555',
              borderRadius: '8px',
              color: '#9CA3AF',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#333'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#9CA3AF'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6366F1',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
          >
            {scheduledPost ? 'Schedule Post' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
      }}>
        {/* Post Type Selection */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #333',
        }}>
          <h2 style={{
            margin: '0 0 20px 0',
            fontSize: '20px',
            fontWeight: '700',
            color: '#fff',
          }}>
            Choose Post Type
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
          }}>
            {postTypes.map((type) => {
              const IconComponent = type.icon
              const isSelected = postType === type.type
              
              return (
                <button
                  key={type.type}
                  onClick={() => setPostType(type.type)}
                  style={{
                    padding: '20px',
                    backgroundColor: isSelected ? type.color + '20' : '#222',
                    border: `2px solid ${isSelected ? type.color : '#333'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#333'
                      e.currentTarget.style.borderColor = type.color
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = '#222'
                      e.currentTarget.style.borderColor = '#333'
                    }
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: type.color,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                  }}>
                    <IconComponent size={24} color="#fff" />
                  </div>
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                    {type.name}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#9CA3AF',
                    lineHeight: '1.4',
                  }}>
                    {type.description}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Input Based on Type */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #333',
        }}>
          {/* Image/Video Upload */}
          {(postType === 'image' || postType === 'video') && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff',
              }}>
                Upload {postType === 'image' ? 'Photos' : 'Videos'}
              </h3>
              
              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed #555',
                  borderRadius: '12px',
                  padding: '40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#6366F1'
                  e.currentTarget.style.backgroundColor = '#1a1a2e'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#555'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Upload size={48} color="#6366F1" style={{ marginBottom: '16px' }} />
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#fff',
                }}>
                  Click to upload {postType === 'image' ? 'photos' : 'videos'}
                </h4>
                <p style={{
                  margin: 0,
                  fontSize: '14px',
                  color: '#9CA3AF',
                }}>
                  {postType === 'image' 
                    ? 'PNG, JPG, GIF up to 10MB each (max 10 files)'
                    : 'MP4, MOV, AVI up to 100MB each (max 5 files)'
                  }
                </p>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={postType === 'image' ? 'image/*' : 'video/*'}
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              {/* Preview Uploaded Files */}
              {previewUrls.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '12px',
                }}>
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        aspectRatio: '1',
                      }}
                    >
                      {postType === 'image' ? (
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{ position: 'relative' }}>
                          <video
                            ref={index === 0 ? videoRef : undefined}
                            src={url}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            muted
                          />
                          {index === 0 && (
                            <button
                              onClick={toggleVideoPlay}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                color: '#fff',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {videoPlaying ? <Pause size={16} /> : <Play size={16} />}
                            </button>
                          )}
                        </div>
                      )}
                      
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          border: 'none',
                          borderRadius: '50%',
                          color: '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Poll Creation */}
          {postType === 'poll' && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: '#fff',
              }}>
                Create Poll
              </h3>
              
              {/* Poll Question */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                }}>
                  Poll Question
                </label>
                <input
                  type="text"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder="Ask a question..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#222',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                />
              </div>
              
              {/* Poll Options */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                }}>
                  Poll Options
                </label>
                
                {pollOptions.map((option, index) => (
                  <div
                    key={option.id}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => updatePollOption(option.id, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: '10px',
                        backgroundColor: '#222',
                        border: '1px solid #444',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                    />
                    
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removePollOption(option.id)}
                        style={{
                          padding: '10px',
                          backgroundColor: '#EF4444',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EF4444'}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                
                {pollOptions.length < 6 && (
                  <button
                    onClick={addPollOption}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px',
                      backgroundColor: 'transparent',
                      border: '1px dashed #6366F1',
                      borderRadius: '8px',
                      color: '#6366F1',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#6366F120'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Plus size={16} />
                    Add Option
                  </button>
                )}
              </div>
              
              {/* Poll Settings */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#E5E7EB',
                  }}>
                    Poll Duration (hours)
                  </label>
                  <select
                    value={pollDuration}
                    onChange={(e) => setPollDuration(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#222',
                      border: '1px solid #444',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  >
                    <option value="1">1 hour</option>
                    <option value="6">6 hours</option>
                    <option value="12">12 hours</option>
                    <option value="24">24 hours</option>
                    <option value="48">2 days</option>
                    <option value="168">1 week</option>
                  </select>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingTop: '24px',
                }}>
                  <input
                    type="checkbox"
                    id="multipleChoices"
                    checked={allowMultipleChoices}
                    onChange={(e) => setAllowMultipleChoices(e.target.checked)}
                    style={{
                      width: '18px',
                      height: '18px',
                      accentColor: '#6366F1',
                    }}
                  />
                  <label
                    htmlFor="multipleChoices"
                    style={{
                      fontSize: '14px',
                      color: '#E5E7EB',
                      cursor: 'pointer',
                    }}
                  >
                    Allow multiple choices
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
            }}>
              {postType === 'poll' ? 'Additional Description (Optional)' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                postType === 'poll' 
                  ? 'Add more context to your poll...'
                  : 'What\'s on your mind? Share your story...'
              }
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
                resize: 'vertical',
                transition: 'border-color 0.2s ease',
                fontFamily: 'inherit',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
            />
          </div>

          {/* Hashtags */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
            }}>
              Hashtags
            </label>
            
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '12px',
            }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Hash
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9CA3AF',
                  }}
                />
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => setHashtagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addHashtag()
                    }
                  }}
                  placeholder="Add hashtag..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 40px',
                    backgroundColor: '#222',
                    border: '1px solid #444',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
                />
              </div>
              <button
                onClick={addHashtag}
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#6366F1',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4F46E5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6366F1'}
              >
                Add
              </button>
            </div>
            
            {hashtags.length > 0 && (
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}>
                {hashtags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      backgroundColor: '#6366F1',
                      borderRadius: '16px',
                      fontSize: '14px',
                      color: '#fff',
                    }}
                  >
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#fff',
                        cursor: 'pointer',
                        padding: '0',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
            }}>
              Location (Optional)
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin
                size={18}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9CA3AF',
                }}
              />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Add location..."
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  backgroundColor: '#222',
                  border: '1px solid #444',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#6366F1'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#444'}
              />
            </div>
          </div>
        </div>

        {/* Post Settings */}
        <div style={{
          backgroundColor: '#111',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #333',
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#fff',
          }}>
            Post Settings
          </h3>
          
          {/* Privacy Settings */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
            }}>
              Who can see this post?
            </label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}>
              {privacyOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setPrivacy(option.value)}
                  style={{
                    padding: '16px',
                    backgroundColor: privacy === option.value ? '#6366F120' : '#222',
                    border: `1px solid ${privacy === option.value ? '#6366F1' : '#444'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (privacy !== option.value) {
                      e.currentTarget.style.backgroundColor = '#333'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (privacy !== option.value) {
                      e.currentTarget.style.backgroundColor = '#222'
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '20px' }}>{option.icon}</span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      {option.label}
                    </span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#9CA3AF',
                  }}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Post */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px',
            }}>
              <input
                type="checkbox"
                id="schedulePost"
                checked={scheduledPost}
                onChange={(e) => setScheduledPost(e.target.checked)}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#6366F1',
                }}
              />
              <label
                htmlFor="schedulePost"
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#E5E7EB',
                  cursor: 'pointer',
                }}
              >
                Schedule this post
              </label>
            </div>
            
            {scheduledPost && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#222',
                borderRadius: '8px',
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#E5E7EB',
                  }}>
                    Date
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Calendar
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9CA3AF',
                      }}
                    />
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 40px',
                        backgroundColor: '#333',
                        border: '1px solid #555',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#E5E7EB',
                  }}>
                    Time
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Clock
                      size={18}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9CA3AF',
                      }}
                    />
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 40px',
                        backgroundColor: '#333',
                        border: '1px solid #555',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '14px',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}