import React, { useState, useRef } from 'react'
import { Image, Video, Smile, MapPin, Users, X, Plus } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { supabase } from '../../utils/supabase'
import { getCurrentUser } from '../../utils/auth'

export default function CreatePost() {
  const [postText, setPostText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      setPreviewUrls(prev => [...prev, ...newPreviewUrls])
      
      // Set content type based on file type
      if (files[0].type.startsWith('image/')) {
        setContentType('image')
      } else if (files[0].type.startsWith('video/')) {
        setContentType('video')
      }
    }
  }

  const removeFile = (index: number) => {
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(previewUrls[index])
    
    // Remove the file and preview
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
    setPreviewUrls(prev => prev.filter((_, i) => i !== index))
    
    // Reset content type if no files left
    if (selectedFiles.length === 1) {
      setContentType('text')
    }
  }

  const handleSubmit = async () => {
    if ((!postText.trim() && previewUrls.length === 0) || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      const user = await getCurrentUser()
      if (!user) {
        throw new Error('User not authenticated')
      }
      
      // Upload media files if any
      const mediaUrls: string[] = []
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const fileName = `${user.id}/${Date.now()}-${file.name}`
          const { data, error } = await supabase.storage
            .from('post-media')
            .upload(fileName, file)
            
          if (error) throw error
          
          const { data: { publicUrl } } = supabase.storage
            .from('post-media')
            .getPublicUrl(fileName)
            
          mediaUrls.push(publicUrl)
        }
      }
      
      // Create post
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content_type: contentType,
          caption: postText,
          media_urls: mediaUrls,
          location: location || null,
          privacy_level: 'public',
        })
        
      if (error) throw error
      
      // Reset form
      setPostText('')
      setIsExpanded(false)
      setSelectedFiles([])
      setPreviewUrls([])
      setLocation('')
      setContentType('text')
      
      // Refresh the feed (you would typically do this through a state update in the parent component)
      window.location.reload()
      
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mb-6">
      <div className="flex gap-4">
        <Avatar 
          src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
          alt="John Doe"
          size="lg"
        />
        
        <div className="flex-1">
          <textarea
            placeholder="What's new with your pets?"
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="w-full resize-none border-none outline-none text-lg placeholder-gray-500 bg-transparent"
            rows={isExpanded ? 3 : 1}
          />
          
          {/* Preview selected files */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  {contentType === 'image' ? (
                    <img 
                      src={url} 
                      alt={`Preview ${index}`} 
                      className="w-full h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <video 
                      src={url} 
                      className="w-full h-24 object-cover rounded-lg" 
                      controls
                    />
                  )}
                  <button 
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 text-white"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Media Options */}
              <div className="flex gap-4">
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Image size={20} />
                  <span className="font-medium">Photo</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  accept="image/*,video/*" 
                  style={{ display: 'none' }}
                  multiple
                />
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Video size={20} />
                  <span className="font-medium">Video</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors">
                  <Smile size={20} />
                  <span className="font-medium">Feeling</span>
                </button>
              </div>
              
              {/* Additional Options */}
              <div className="flex gap-4">
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  onClick={() => {
                    const location = prompt('Enter your location:')
                    if (location) setLocation(location)
                  }}
                >
                  <MapPin size={20} />
                  <span className="font-medium">Location</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                  <Users size={20} />
                  <span className="font-medium">Tag Pets</span>
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Everyone can see this post</span>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      setIsExpanded(false)
                      setPostText('')
                      setSelectedFiles([])
                      setPreviewUrls([])
                      setLocation('')
                      setContentType('text')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    disabled={(!postText.trim() && previewUrls.length === 0) || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? 'Posting...' : 'Share'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}