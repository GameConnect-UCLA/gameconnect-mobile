/** Design tokens: colors, spacing, radii, typography, shadows. */
/** App color palette. */
export const Colors = {
  primary: '#033563',
  primaryDark: '#0B4B82',
  accent: '#9b1999',
  accentLight: '#8A38F5',
  surface: 'rgba(255,255,255,0.3)',
  surfaceDark: 'rgba(217,217,217,0.85)',
  text: {
    primary: '#1a1a1a',
    secondary: '#535353',
    accent: '#2A53A0',
  },
  status: {
    success: '#0E5A2F',
    error: '#B42318',
    warning: '#E8C339',
    info: '#2A53A0',
  },
  border: 'rgba(24,18,10,0.12)',
  heart: '#D11D3B',
  star: '#C48200',
  messageRead: '#34B7F1',
} as const;

/** Spacing scale for layout gaps and padding. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/** Border radius scale. */
export const Radii = {
  sm: 8,
  md: 14,
  lg: 18,
  xl: 24,
  full: 999,
} as const;

/** Typography sizes and weights. */
export const Typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  } as const,
} as const;

/** Shadow/elevation presets. */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
} as const;
