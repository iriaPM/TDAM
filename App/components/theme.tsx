export const theme = {
  colors: {
    primary: '#f2a305ff',       // Main brand color
    secondary: '#fd1e1eff',     // Accent color
    accent: '#570521ff',        // Highlight color
    background: '#f8b0b0ff',    // Background color
    surface: '#F5F5F5',       // Card/surface color
    error: '#b00096ff',         // Error color
    text: '#212121',          // Primary text
    textSecondary: '#757575', // Secondary text
    disabled: '#9E9E9E',      // Disabled elements
    placeholder: '#BDBDBD',   // Input placeholder
    backdrop: 'rgba(0,0,0,0.5)', // Backdrop overlay
    onPrimary: '#FFFFFF',     // Text on primary color
    onSecondary: '#000000',   // Text on secondary color
    onBackground: '#212121',  // Text on background
    onSurface: '#212121',     // Text on surface
    onError: '#fe038dff',       // Text on error
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  roundness: 8,
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold' as const,
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold' as const,
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal' as const,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal' as const,
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: 'bold' as const,
      lineHeight: 24,
      textTransform: 'uppercase' as const,
    },
  },
  animation: {
    scale: 1.0,
    duration: 200,
  },
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#B39DDB',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    onBackground: '#FFFFFF',
    onSurface: '#FFFFFF',
  },
};

export type Theme = typeof theme;