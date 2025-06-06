import React from 'react'
import { Routes, Route } from 'react-router-dom'
import EnhancedHome from './pages/EnhancedHome'
import Profile from './pages/Profile'
import Messages from './pages/Messages'
import Explore from './pages/Explore'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EnhancedHome />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App