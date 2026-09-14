/**
 * Central design tokens so colors/spacing can be changed in one place.
 * These mirror tailwind.config.js — update both when rebranding.
 */
export const theme = {
  colors: {
    primary: '#0b2545', // deep navy
    primaryDark: '#071a33',
    primaryLight: '#102a43',
    accent: '#d4a853', // muted gold
    accentDark: '#a37a2e',
    background: '#ffffff',
    surface: '#f8fafc',
    border: '#e5e7eb',
    text: '#1f2937',
    textMuted: '#6b7280',
    success: '#15803d',
    danger: '#b91c1c',
    warning: '#b45309',
    info: '#1d4ed8',
  },
  fonts: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    serif: '"Merriweather", Georgia, serif',
  },
  radius: { sm: '6px', md: '10px', lg: '16px' },
};

export const ORG = {
  name: 'Human Rights Council of Pakistan – Twin City',
  shortName: 'HRC-Pakistan Twin City',
  tagline: 'Justice · Peace · Equality · Dignity',
};

export default theme;
