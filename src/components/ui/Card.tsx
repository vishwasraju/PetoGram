import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div className={`
      bg-white rounded-2xl border border-gray-100 shadow-sm
      ${hover ? 'hover:shadow-md hover:border-gray-200 transition-all duration-200' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  )
}