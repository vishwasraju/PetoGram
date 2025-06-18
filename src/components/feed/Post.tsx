import React, { useState, useEffect } from 'react'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play, Volume2, VolumeX } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { Link } from 'react-router-dom'
import { supabase } from '../../utils/supabase'
import { getCurrentUser } from '../../utils/auth'

interface PostProps {
  post: {
    id: string
    user: {
      name: string
      avatar: string
      pets: string
      verified?: boolean
      id?: string
      user_id?: string
    }
    content: {
      type: 'image' | 'video'
      url: string
      caption: string
      hashtags: string[]
    }
    engagement: {
      likes: number
      comments: number
      shares: number
      liked: boolean
      saved?: boolean
    }
    timestamp: string
  }
  onLike: (postId: string) => void
  onSave?: (postId: string) => void
}

export default function Post({ post, onLike, onSave }: PostProps) {
  const [showFullCaption, setShowFullCaption] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    const user = await getCurrentUser()
    setCurrentUser(user)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const truncateCaption = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const handlePostComment = async () => {
    if (!commentText.trim() || !currentUser || isSubmitting) return
    
    setIsSubmitting(true)
    
    try {
      // Add comment to database
      const { error } = await supabase
        .from('post_comments')
        .insert({
          post_id: post.id,
          user_id: currentUser.id,
          content: commentText
        })
        
      if (error) throw error
      
      // Create notification for post owner
      if (post.user.id && post.user.id !== currentUser.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.user.id,
            type: 'comment',
            title: 'New Comment',
            content: `${currentUser.user_metadata?.full_name || 'Someone'} commented on your post`,
            related_id: post.id,
            related_type: 'post'
          })
      }
      
      // Clear comment text
      setCommentText('')
      
      // Update comment count (in a real app, you'd update the state)
      onLike(post.id) // This is just to trigger a re-render
      
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card padding="none" className="mb-6 overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link to={`/user-profile/${post.user.user_id}`}>
            <Avatar 
              src={post.user.avatar}
              alt={post.user.name}
              size="md"
              verified={post.user.verified}
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link to={`/user-profile/${post.user.user_id}`} className="font-semibold text-gray-900">
                {post.user.name}
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-sm text-gray-500">{post.timestamp}</span>
            </div>
            <p className="text-sm text-gray-600">{post.user.pets}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Post Caption */}
      {post.content.caption && (
        <div className="px-4 pb-3">
          <p className="text-gray-900 leading-relaxed">
            {showFullCaption ? post.content.caption : truncateCaption(post.content.caption)}
            {post.content.caption.length > 150 && !showFullCaption && (
              <button 
                onClick={() => setShowFullCaption(true)}
                className="text-purple-600 hover:text-purple-700 ml-1 font-medium"
              >
                more
              </button>
            )}
          </p>
          
          {post.content.hashtags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {post.content.hashtags.map((tag, index) => (
                <button
                  key={index}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Media */}
      <div className="relative bg-gray-100">
        <img 
          src={post.content.url}
          alt="Post content"
          className="w-full h-96 object-cover"
          loading="lazy"
        />
        
        {post.content.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="ghost\" size=\"lg\" className=\"bg-black/50 text-white hover:bg-black/60">
              <Play size={32} fill="currentColor" />
            </Button>
            
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/60 transition-colors"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        )}
      </div>

      {/* Engagement Stats */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>{formatNumber(post.engagement.likes)} likes</span>
            <span>{formatNumber(post.engagement.comments)} comments</span>
            <span>{formatNumber(post.engagement.shares)} shares</span>
          </div>
          <span>2 hours ago</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-6">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 transition-colors ${
              post.engagement.liked 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart 
              size={24} 
              fill={post.engagement.liked ? 'currentColor' : 'none'}
              className="transition-transform hover:scale-110"
            />
            <span className="font-medium">Like</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <MessageCircle size={24} />
            <span className="font-medium">{post.engagement.comments}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
            <Share size={24} />
            <span className="font-medium">Share</span>
          </button>
        </div>
        
        <button
          onClick={() => onSave?.(post.id)}
          className={`transition-colors ${
            post.engagement.saved 
              ? 'text-purple-600 hover:text-purple-700' 
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          <Bookmark 
            size={24} 
            fill={post.engagement.saved ? 'currentColor' : 'none'}
          />
        </button>
      </div>

      {/* Comment Section */}
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar 
            src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="Your avatar"
            size="sm"
          />
          <div className="flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          {commentText.trim() && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={handlePostComment}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}