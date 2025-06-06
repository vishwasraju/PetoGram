import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  children, 
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = `
    inline-flex items-center justify-center font-medium transition-all duration-150
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `

  const variants = {
    primary: `
      bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800
      text-white shadow-md hover:shadow-lg focus:ring-purple-500
      active:transform active:scale-95
    `,
    secondary: `
      bg-gray-100 hover:bg-gray-200 text-gray-900 
      border border-gray-200 hover:border-gray-300
      focus:ring-gray-500
    `,
    ghost: `
      text-gray-600 hover:text-gray-900 hover:bg-gray-50
      focus:ring-gray-500
    `,
    danger: `
      bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg
      focus:ring-red-500 active:transform active:scale-95
    `
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2'
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}