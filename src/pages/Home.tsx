import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import CreatePost from '../components/feed/CreatePost'
import Post from '../components/feed/Post'

interface PostData {
  id: string
  user: {
    name: string
    avatar: string
    pets: string
    verified?: boolean
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

const mockPosts: PostData[] = [
  {
    id: '1',
    user: {
      name: 'Sarah Miller',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Bella & Max',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Bella discovered the sprinkler today! 💦 First time seeing her this excited about water. She went from being scared of baths to absolutely loving getting soaked in the backyard. Sometimes the best moments happen when you least expect them! 🐕✨',
      hashtags: ['#GoldenRetriever', '#WaterDog', '#SummerFun', '#PuppyJoy'],
    },
    engagement: {
      likes: 1247,
      comments: 89,
      shares: 23,
      liked: false,
      saved: false,
    },
    timestamp: '2h',
  },
  {
    id: '2',
    user: {
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Luna & Shadow',
      verified: false,
    },
    content: {
      type: 'video',
      url: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Luna and Shadow playing together in the park. These two are inseparable! 🐱🐕 Best friends forever.',
      hashtags: ['#CatsAndDogs', '#BestFriends', '#PlayTime'],
    },
    engagement: {
      likes: 892,
      comments: 45,
      shares: 12,
      liked: true,
      saved: true,
    },
    timestamp: '4h',
  },
  {
    id: '3',
    user: {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2',
      pets: 'with Whiskers',
      verified: true,
    },
    content: {
      type: 'image',
      url: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800',
      caption: 'Whiskers found the perfect sunny spot for his afternoon nap ☀️ This little guy knows how to live the good life!',
      hashtags: ['#CatLife', '#SunnyDay', '#Napping', '#LazyAfternoon'],
    },
    engagement: {
      likes: 634,
      comments: 28,
      shares: 8,
      liked: false,
      saved: false,
    },
    timestamp: '6h',
  },
]

export default function Home() {
  const [posts, setPosts] = useState(mockPosts)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    updateLayout()
    window.addEventListener('resize', updateLayout)
    return () => window.removeEventListener('resize', updateLayout)
  }, [])

  const handleLike = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                liked: !post.engagement.liked,
                likes: post.engagement.liked 
                  ? post.engagement.likes - 1 
                  : post.engagement.likes + 1,
              },
            }
          : post
      )
    )
  }

  const handleSave = (postId: string) => {
    setPosts(currentPosts =>
      currentPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                saved: !post.engagement.saved,
              },
            }
          : post
      )
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0">
            <Sidebar 
              isOpen={true} 
              onClose={() => {}} 
              isMobile={false}
            />
          </div>
        )}
        
        {/* Mobile Sidebar */}
        {isMobile && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            isMobile={true}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          {/* Header */}
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            isMobile={isMobile}
          />

          {/* Feed */}
          <main className="max-w-2xl mx-auto px-4 py-6">
            {/* Create Post */}
            <CreatePost />

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <Post 
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="text-center py-8">
              <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors font-medium">
                Load More Posts
              </button>
            </div>
          </main>
        </div>

        {/* Right Sidebar - Desktop Only */}
        {!isMobile && (
          <div className="w-80 flex-shrink-0 p-6">
            <div className="sticky top-24 space-y-6">
              {/* Suggested Friends */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Suggested for you</h3>
                <div className="space-y-4">
                  {[
                    { name: 'Emma Wilson', pets: 'with Charlie', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                    { name: 'David Kim', pets: 'with Milo & Coco', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                    { name: 'Lisa Garcia', pets: 'with Buddy', avatar: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' },
                  ].map((user, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.pets}</div>
                        </div>
                      </div>
                      <button className="px-4 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Hashtags */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Trending</h3>
                <div className="space-y-3">
                  {[
                    { tag: '#PuppyLove', posts: '45.2K posts' },
                    { tag: '#CatsOfInstagram', posts: '38.9K posts' },
                    { tag: '#DogTraining', posts: '23.1K posts' },
                    { tag: '#PetPhotography', posts: '19.8K posts' },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-purple-600">{item.tag}</div>
                        <div className="text-sm text-gray-500">{item.posts}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}