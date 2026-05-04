export const theme = {
  colors: {
    background: '#F5F1EA',
    surface: '#FFFDF9',
    surfaceAlt: '#EFE4D4',
    primary: '#B3242A',
    primaryMuted: '#E8B9BC',
    text: '#271D1A',
    textMuted: '#6E625D',
    border: '#E1D6CA',
    success: '#2E7D5A',
    warning: '#C7811B',
    danger: '#D43C32',
    info: '#2563EB',
  },
  radius: {
    sm: 12,
    md: 18,
    lg: 28,
  },
  shadow: {
    shadowColor: '#2B1C15',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 6,
  },
};

export const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'] as const;
export const urgencyLevels = ['low', 'medium', 'high'] as const;
