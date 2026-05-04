import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/app-theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: 'primary' | 'secondary' | 'danger';
};

export const PrimaryButton = ({ label, onPress, disabled, loading, tone = 'primary' }: Props) => (
  <Pressable
    disabled={disabled || loading}
    onPress={onPress}
    style={({ pressed }) => [
      styles.button,
      toneStyles[tone],
      (disabled || loading) && styles.disabled,
      pressed && !disabled && !loading && styles.pressed,
    ]}>
    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.label}>{label}</Text>}
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});

const toneStyles = StyleSheet.create({
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.text,
  },
  danger: {
    backgroundColor: theme.colors.danger,
  },
});
