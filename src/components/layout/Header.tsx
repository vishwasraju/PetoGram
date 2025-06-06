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

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
          )}
          
          {isMobile && (
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              PetoGram
            </h1>
          )}
        </div>

        {/* Search Bar - Desktop Only */}
        {!isMobile && (
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pets, people, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button variant="ghost\" size="sm">
              <Search size={20} />
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="relative">
            <Heart size={20} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </div>
          </Button>
          
          <Button variant="ghost" size="sm" className="relative">
            <MessageCircle size={20} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
              2
            </div>
          </Button>
          
          {isMobile && (
            <Button variant="primary" size="sm">
              <Plus size={18} />
            </Button>
          )}
          
          <Avatar 
            src="https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2"
            alt="John Doe"
            size="md"
            status="online"
            className="ml-2"
          />
        </div>
      </div>
    </header>
  )
}