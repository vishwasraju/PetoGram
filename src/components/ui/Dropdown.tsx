import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { designTokens } from '../../design-system/tokens'

interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Dropdown({
  options,
  value,
  placeholder = 'Select an option',
  onChange,
  disabled = false,
  size = 'md',
  fullWidth = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${designTokens.spacing[2]} ${designTokens.spacing[3]}`,
        fontSize: designTokens.typography.fontSize.sm,
      },
      md: {
        padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
        fontSize: designTokens.typography.fontSize.base,
      },
      lg: {
        padding: `${designTokens.spacing[4]} ${designTokens.spacing[5]}`,
        fontSize: designTokens.typography.fontSize.lg,
      },
    }
    return sizes[size]
  }

  const sizeStyles = getSizeStyles()

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'relative',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {/* Trigger Button */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          ...sizeStyles,
          backgroundColor: disabled ? designTokens.colors.gray[50] : designTokens.colors.white,
          border: `1px solid ${designTokens.colors.gray[200]}`,
          borderRadius: designTokens.borderRadius.xl,
          color: selectedOption ? designTokens.colors.gray[900] : designTokens.colors.gray[500],
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: `all ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          opacity: disabled ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = designTokens.colors.gray[300]
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.borderColor = designTokens.colors.gray[200]
          }
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${designTokens.colors.primary[500]}`
            e.currentTarget.style.borderColor = 'transparent'
          }
        }}
        onBlur={(e) => {
          if (!disabled) {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.borderColor = designTokens.colors.gray[200]
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: designTokens.spacing[2] }}>
          {selectedOption?.icon}
          <span>{selectedOption?.label || placeholder}</span>
        </div>
        
        <ChevronDown
          size={16}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: designTokens.spacing[1],
            backgroundColor: designTokens.colors.white,
            border: `1px solid ${designTokens.colors.gray[200]}`,
            borderRadius: designTokens.borderRadius.xl,
            boxShadow: designTokens.boxShadow.lg,
            zIndex: designTokens.zIndex.dropdown,
            overflow: 'hidden',
            animation: 'dropdownSlideIn 0.2s ease-out',
          }}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                if (!option.disabled) {
                  onChange(option.value)
                  setIsOpen(false)
                }
              }}
              disabled={option.disabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: designTokens.spacing[2],
                width: '100%',
                padding: `${designTokens.spacing[3]} ${designTokens.spacing[4]}`,
                backgroundColor: 'transparent',
                border: 'none',
                color: option.disabled ? designTokens.colors.gray[400] : designTokens.colors.gray[900],
                cursor: option.disabled ? 'not-allowed' : 'pointer',
                fontSize: sizeStyles.fontSize,
                textAlign: 'left',
                transition: `background-color ${designTokens.animation.duration.fast} ${designTokens.animation.easing.ease}`,
              }}
              onMouseEnter={(e) => {
                if (!option.disabled) {
                  e.currentTarget.style.backgroundColor = designTokens.colors.gray[50]
                }
              }}
              onMouseLeave={(e) => {
                if (!option.disabled) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {option.icon}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
      
      <style>{`
        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}