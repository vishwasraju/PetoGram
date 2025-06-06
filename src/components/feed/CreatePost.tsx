import React, { useState } from 'react'
import { Image, Video, Smile, MapPin, Users } from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import Card from '../ui/Card'

export default function CreatePost() {
  const [postText, setPostText] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

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
          
          {isExpanded && (
            <div className="mt-4 space-y-4">
              {/* Media Options */}
              <div className="flex gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors">
                  <Image size={20} />
                  <span className="font-medium">Photo</span>
                </button>
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
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
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
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm"
                    disabled={!postText.trim()}
                  >
                    Share
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