import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/app-theme';

type Props = {
  label: string;
  value: string;
  tone?: 'default' | 'danger' | 'success' | 'warning';
};

export const StatChip = ({ label, value, tone = 'default' }: Props) => (
  <View style={[styles.container, toneStyles[tone]]}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    gap: 4,
    minWidth: 88,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
});

const toneStyles = StyleSheet.create({
  default: {
    backgroundColor: theme.colors.surface,
  },
  danger: {
    backgroundColor: '#FBE1E3',
  },
  success: {
    backgroundColor: '#D9F3E8',
  },
  warning: {
    backgroundColor: '#FDECCF',
  },
});
