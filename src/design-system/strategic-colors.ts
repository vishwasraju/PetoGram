// PetoGram Strategic Color Palette - Professional Implementation
export const strategicColors = {
  // PRIMARY BRAND COLORS (Prussian Blue - Trust & Reliability)
  prussianBlue: {
    50: '#e6f0f5',
    100: '#cce1eb',
    200: '#99c3d7',
    300: '#66a5c3',
    400: '#3387af',
    500: '#003049', // Main brand color
    600: '#002a3f',
    700: '#002135',
    800: '#00182b',
    900: '#000f21',
    
    // Usage: Navigation, headers, primary buttons, brand elements
    psychology: 'Trust, reliability, professionalism, depth',
    maxUsage: '40%'
  },

  // SECONDARY COLORS (Fire Engine Red - Energy & Action)
  fireRed: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#d62828', // Action color
    600: '#c12525',
    700: '#ac2222',
    800: '#971f1f',
    900: '#821c1c',
    
    // Usage: CTAs, notifications, alerts, important actions
    psychology: 'Energy, urgency, passion, attention',
    maxUsage: '15%'
  },

  // ACCENT COLORS (Orange Wheel - Warmth & Creativity)
  orangeWheel: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f77f00', // Creative accent
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
    
    // Usage: Highlights, creative elements, secondary CTAs
    psychology: 'Creativity, warmth, enthusiasm, innovation',
    maxUsage: '20%'
  },

  // SUPPORTING COLORS (Xanthous - Joy & Optimism)
  xanthous: {
    50: '#fefce8',
    100: '#fef9c3',
    200: '#fef08a',
    300: '#fde047',
    400: '#facc15',
    500: '#fcbf49', // Joy accent
    600: '#ca8a04',
    700: '#a16207',
    800: '#854d0e',
    900: '#713f12',
    
    // Usage: Success states, achievements, positive feedback
    psychology: 'Joy, optimism, success, achievement',
    maxUsage: '15%'
  },

  // NEUTRAL BASE (Vanilla - Calm & Balance)
  vanilla: {
    50: '#fefdfb',
    100: '#fdfcf7',
    200: '#fbf9ef',
    300: '#f9f6e7',
    400: '#f7f3df',
    500: '#eae2b7', // Base neutral
    600: '#d4c89a',
    700: '#beae7d',
    800: '#a89460',
    900: '#927a43',
    
    // Usage: Backgrounds, subtle elements, text backgrounds
    psychology: 'Calm, balance, sophistication, elegance',
    maxUsage: '10%'
  },

  // GLASS MORPHISM SYSTEM
  glass: {
    // Prussian Blue glass variants
    prussianLight: 'rgba(0, 48, 73, 0.1)',
    prussianMedium: 'rgba(0, 48, 73, 0.15)',
    prussianStrong: 'rgba(0, 48, 73, 0.25)',
    
    // Fire Red glass variants
    redLight: 'rgba(214, 40, 40, 0.1)',
    redMedium: 'rgba(214, 40, 40, 0.15)',
    redStrong: 'rgba(214, 40, 40, 0.25)',
    
    // Orange glass variants
    orangeLight: 'rgba(247, 127, 0, 0.1)',
    orangeMedium: 'rgba(247, 127, 0, 0.15)',
    orangeStrong: 'rgba(247, 127, 0, 0.25)',
    
    // Neutral glass variants
    neutralLight: 'rgba(255, 255, 255, 0.1)',
    neutralMedium: 'rgba(255, 255, 255, 0.15)',
    neutralStrong: 'rgba(255, 255, 255, 0.25)',
    
    // Border variants
    borderLight: 'rgba(255, 255, 255, 0.2)',
    borderMedium: 'rgba(255, 255, 255, 0.3)',
    borderStrong: 'rgba(255, 255, 255, 0.4)',
  },

  // GRADIENT SYSTEM
  gradients: {
    // Primary brand gradient
    primary: 'linear-gradient(135deg, #003049 0%, #d62828 25%, #f77f00 50%, #fcbf49 75%, #eae2b7 100%)',
    
    // Card-specific gradients
    cardPrimary: 'linear-gradient(135deg, rgba(0, 48, 73, 0.1) 0%, rgba(0, 48, 73, 0.05) 100%)',
    cardSecondary: 'linear-gradient(135deg, rgba(214, 40, 40, 0.1) 0%, rgba(214, 40, 40, 0.05) 100%)',
    cardAccent: 'linear-gradient(135deg, rgba(247, 127, 0, 0.1) 0%, rgba(247, 127, 0, 0.05) 100%)',
    cardNeutral: 'linear-gradient(135deg, rgba(234, 226, 183, 0.1) 0%, rgba(234, 226, 183, 0.05) 100%)',
    
    // Button gradients
    buttonPrimary: 'linear-gradient(135deg, #003049 0%, #002a3f 100%)',
    buttonSecondary: 'linear-gradient(135deg, #d62828 0%, #c12525 100%)',
    buttonAccent: 'linear-gradient(135deg, #f77f00 0%, #ea580c 100%)',
    
    // Overlay gradients
    overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 48, 73, 0.8) 100%)',
    overlayTop: 'linear-gradient(180deg, rgba(0, 48, 73, 0.8) 0%, rgba(0, 0, 0, 0) 100%)',
  }
}

// CARD VARIATION SYSTEM
export const cardVariations = {
  primary: {
    background: strategicColors.glass.prussianLight,
    backdropFilter: 'blur(20px)',
    border: `1px solid ${strategicColors.glass.borderLight}`,
    accentColor: strategicColors.prussianBlue[500],
    textColor: '#ffffff',
    shadowColor: 'rgba(0, 48, 73, 0.2)',
  },
  
  secondary: {
    background: strategicColors.glass.redLight,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(214, 40, 40, 0.2)`,
    accentColor: strategicColors.fireRed[500],
    textColor: '#ffffff',
    shadowColor: 'rgba(214, 40, 40, 0.2)',
  },
  
  accent: {
    background: strategicColors.glass.orangeLight,
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(247, 127, 0, 0.2)`,
    accentColor: strategicColors.orangeWheel[500],
    textColor: '#ffffff',
    shadowColor: 'rgba(247, 127, 0, 0.2)',
  },
  
  success: {
    background: 'rgba(252, 191, 73, 0.1)',
    backdropFilter: 'blur(20px)',
    border: `1px solid rgba(252, 191, 73, 0.2)`,
    accentColor: strategicColors.xanthous[500],
    textColor: '#ffffff',
    shadowColor: 'rgba(252, 191, 73, 0.2)',
  },
  
  neutral: {
    background: strategicColors.glass.neutralMedium,
    backdropFilter: 'blur(25px)',
    border: `1px solid ${strategicColors.glass.borderMedium}`,
    accentColor: strategicColors.vanilla[500],
    textColor: '#ffffff',
    shadowColor: 'rgba(234, 226, 183, 0.2)',
  }
}

export default strategicColors