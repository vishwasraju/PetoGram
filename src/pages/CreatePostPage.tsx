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
  Pause,
  Bell
} from 'lucide-react'
import { designTokens } from '../design-system/tokens'
import { supabase } from '../utils/supabase'
import { getCurrentUser } from '../utils/auth'

type PostType = 'image' | 'video' | 'text'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [postType, setPostType] = useState<PostType>('image')
  const [description, setDescription] = useState('')
  
  // Media upload states
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  
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
      type: 'text' as PostType, 
      name: 'Text', 
      icon: Type, 
      color: '#EF4444',
      description: 'Share thoughts and stories'
    }
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

  const handleSubmit = async () => {
    if (!description.trim()) {
      alert('Please add a description');
      return;
    }
    if ((postType === 'image' || postType === 'video') && uploadedFiles.length === 0) {
      alert('Please upload at least one file');
      return;
    }

    try {
      const user = await getCurrentUser();
      if (!user) {
        alert('User not authenticated');
        return;
      }

      // Upload files to Supabase Storage
      let mediaUrls: string[] = [];
      for (const file of uploadedFiles) {
        const fileName = `${user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, file);

        if (uploadError) {
          alert('File upload failed: ' + uploadError.message);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(fileName);

        mediaUrls.push(publicUrl as string);
      }

      // Insert post into Supabase
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content_type: postType,
          caption: description,
          media_urls: mediaUrls,
          is_active: true,
          created_at: new Date().toISOString(),
          likes_count: 0,
          comments_count: 0,
          shares_count: 0,
        });

      if (error) {
        alert('Failed to create post: ' + error.message);
        return;
      }

      alert('Post created!');
      navigate('/home');
    } catch (err) {
      alert('Unexpected error: ' + err.message);
      console.error(err);
    }
  };

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
            Publish
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
                              onClick={() => setVideoPlaying(!videoPlaying)}
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

          {/* Description */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#E5E7EB',
            }}>
              {postType === 'text' ? 'Additional Description (Optional)' : 'Description'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                postType === 'text' 
                  ? 'Add more context to your story...'
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
        </div>
      </div>
    </div>
  )
}