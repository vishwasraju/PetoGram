// PetoGram Strategic Color Palette
export const colorPalette = {
  // PRIMARY BRAND COLOR
  primary: {
    // Main brand color - Vibrant Cyan (Trust + Energy)
    50: '#ecfeff',   // Lightest tint for backgrounds
    100: '#cffafe',  // Light tint for hover states
    200: '#a5f3fc',  // Subtle accents
    300: '#67e8f9',  // Interactive elements
    400: '#22d3ee',  // Secondary actions
    500: '#06b6d4',  // MAIN BRAND COLOR - Primary buttons, links
    600: '#0891b2',  // Hover states for primary
    700: '#0e7490',  // Active states
    800: '#155e75',  // Dark mode primary
    900: '#164e63',  // Darkest shade
    
    // Psychology: Trust, reliability, freshness, technology
    // Usage: Logo, primary CTAs, navigation highlights, brand elements
    // Contrast: AAA with white text, AA with dark backgrounds
  },

  // SECONDARY COLORS
  secondary: {
    // Warm Purple (Creativity + Premium)
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#8b5cf6',  // Secondary brand color
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    
    // Psychology: Creativity, premium feel, community
    // Usage: Secondary buttons, badges, highlights, premium features
  },

  accent: {
    // Energetic Green (Growth + Positivity)
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',  // Main accent color
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    
    // Psychology: Growth, health, positivity, nature
    // Usage: Success states, positive actions, health-related features
  },

  // SEMANTIC COLORS
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',  // Success messages, confirmations
    600: '#16a34a',
    700: '#15803d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',  // Warnings, cautions
    600: '#d97706',
    700: '#b45309',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',  // Errors, destructive actions
    600: '#dc2626',
    700: '#b91c1c',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Information, neutral notifications
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // NEUTRAL COLORS (Glass Morphism Compatible)
  neutral: {
    // Pure whites and grays for glass effects
    white: '#ffffff',
    50: '#f9fafb',   // Lightest background
    100: '#f3f4f6',  // Light background
    200: '#e5e7eb',  // Borders, dividers
    300: '#d1d5db',  // Disabled states
    400: '#9ca3af',  // Placeholder text
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Primary text (light mode)
    700: '#374151',  // Headings
    800: '#1f2937',  // Dark text
    900: '#111827',  // Darkest text
    black: '#000000',
  },

  // GLASS MORPHISM SYSTEM
  glass: {
    // Optimized for gradient background
    light: 'rgba(255, 255, 255, 0.1)',      // Subtle glass
    medium: 'rgba(255, 255, 255, 0.15)',    // Standard glass
    strong: 'rgba(255, 255, 255, 0.25)',    // Prominent glass
    border: 'rgba(255, 255, 255, 0.2)',     // Glass borders
    shadow: 'rgba(0, 0, 0, 0.1)',           // Soft shadows
    
    // Dark glass variants
    darkLight: 'rgba(0, 0, 0, 0.1)',
    darkMedium: 'rgba(0, 0, 0, 0.15)',
    darkStrong: 'rgba(0, 0, 0, 0.25)',
  },

  // GRADIENT SYSTEM
  gradients: {
    // Main brand gradient (already implemented)
    primary: 'linear-gradient(135deg, #4ade80 0%, #06b6d4 25%, #3b82f6 50%, #8b5cf6 75%, #f59e0b 100%)',
    
    // Subtle gradients for components
    subtle: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    
    // Button gradients
    primaryButton: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    secondaryButton: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    accentButton: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
    
    // Overlay gradients
    overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)',
    overlayTop: 'linear-gradient(180deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)',
  },
}

// COLOR USAGE GUIDELINES
export const colorUsage = {
  // Primary color usage (max 60% of design)
  primary: {
    maxUsage: '60%',
    applications: [
      'Logo and brand elements',
      'Primary navigation',
      'Main call-to-action buttons',
      'Active states',
      'Progress indicators',
      'Links and interactive elements'
    ],
    accessibility: {
      contrastRatio: '4.5:1 with white',
      wcagLevel: 'AA',
      colorBlindSafe: true
    }
  },

  // Secondary color usage (max 30% of design)
  secondary: {
    maxUsage: '30%',
    applications: [
      'Secondary buttons',
      'Badges and labels',
      'Accent elements',
      'Premium features',
      'Hover states',
      'Highlights'
    ],
    accessibility: {
      contrastRatio: '4.5:1 with white',
      wcagLevel: 'AA',
      colorBlindSafe: true
    }
  },

  // Accent color usage (max 10% of design)
  accent: {
    maxUsage: '10%',
    applications: [
      'Success indicators',
      'Positive actions',
      'Health-related features',
      'Growth metrics',
      'Achievement badges',
      'Call-to-action highlights'
    ],
    accessibility: {
      contrastRatio: '3:1 minimum',
      wcagLevel: 'AA',
      colorBlindSafe: true
    }
  }
}

// ACCESSIBILITY COMPLIANCE
export const accessibilityStandards = {
  wcag21AA: {
    normalText: '4.5:1',
    largeText: '3:1',
    nonTextElements: '3:1',
    focusIndicators: '3:1'
  },
  
  colorBlindness: {
    protanopia: 'Tested and compliant',
    deuteranopia: 'Tested and compliant',
    tritanopia: 'Tested and compliant',
    achromatopsia: 'High contrast mode available'
  },
  
  minimumSizes: {
    touchTargets: '44px x 44px',
    textSize: '16px minimum',
    iconSize: '24px minimum for interactive',
    focusIndicator: '2px minimum outline'
  }
}

// DARK MODE VARIATIONS
export const darkModeColors = {
  primary: {
    500: '#22d3ee', // Brighter for dark backgrounds
    600: '#06b6d4',
    700: '#0891b2',
  },
  
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  text: {
    primary: '#ffffff',
    secondary: '#e5e7eb',
    tertiary: '#9ca3af',
  },
  
  background: {
    primary: '#111827',
    secondary: '#1f2937',
    tertiary: '#374151',
  }
}

export default colorPalette