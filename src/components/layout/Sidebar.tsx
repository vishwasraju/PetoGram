import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Search, 
  Heart, 
  MessageCircle, 
  PlusSquare,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Compass,
  Video
} from 'lucide-react'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

const navigationItems = [
  { id: 'home', name: 'Home', icon: Home, path: '/' },
  { id: 'explore', name: 'Explore', icon: Compass, path: '/explore' },
  { id: 'search', name: 'Search', icon: Search, path: '/search' },
  { id: 'messages', name: 'Messages', icon: MessageCircle, path: '/messages' },
  { id: 'notifications', name: 'Notifications', icon: Heart, path: '/notifications' },
  { id: 'create', name: 'Create', icon: PlusSquare, path: '/create' },
  { id: 'reels', name: 'Reels', icon: Video, path: '/reels' },
  { id: 'profile', name: 'Profile', icon: User, path: '/profile' },
]

const bottomItems = [
  { id: 'settings', name: 'Settings', icon: Settings, path: '/settings' },
  { id: 'help', name: 'Help', icon: HelpCircle, path: '/help' },
]

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const location = useLocation()

  const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const IconComponent = item.icon
    
    return (
      <Link
        to={item.path}
        onClick={isMobile ? onClose : undefined}
        className={`
          group flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
          ${isActive 
            ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 shadow-sm' 
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
      >
        <div className={`
          p-2 rounded-lg transition-all duration-200
          ${isActive 
            ? 'bg-purple-600 text-white shadow-md' 
            : 'text-gray-500 group-hover:text-gray-700 group-hover:bg-gray-100'
          }
        `}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>
        <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
          {item.name}
        </span>
        {isActive && (
          <div className="ml-auto w-1 h-8 bg-purple-600 rounded-full" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-100 z-50
        transform transition-transform duration-300 ease-out
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        ${!isMobile ? 'relative' : ''}
        shadow-xl
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                PetoGram
              </h1>
              {isMobile && (
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Avatar 
                src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
                alt="John Doe"
                size="lg"
                status="online"
                verified
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">John Doe</h3>
                <p className="text-sm text-gray-500 truncate">@johndoe</p>
              </div>
            </div>
            
            <div className="mt-4 flex gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-gray-900">42</div>
                <div className="text-gray-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">1.2K</div>
                <div className="text-gray-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">389</div>
                <div className="text-gray-500">Following</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavItem 
                key={item.id} 
                item={item} 
                isActive={location.pathname === item.path}
              />
            ))}
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-gray-100 space-y-1">
            {bottomItems.map((item) => (
              <NavItem 
                key={item.id} 
                item={item} 
                isActive={location.pathname === item.path}
              />
            ))}
            
            <button className="w-full flex items-center gap-4 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
              <div className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                <LogOut size={20} strokeWidth={2.5} />
              </div>
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}