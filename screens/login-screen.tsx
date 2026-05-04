import { Href, Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { InputField } from '@/components/input-field';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/hooks/use-locale';

export const LoginScreen = () => {
  const { login } = useAuth();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      await login(email.trim(), password);
      router.replace('/verify-email' as Href);
    } catch (error) {
      Alert.alert('Login failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <View style={styles.hero}>
        <Text style={styles.badge}>Urgent care network</Text>
        <SectionTitle
          eyebrow="Welcome back"
          title={t('auth.loginTitle')}
          description={t('auth.loginDescription')}
        />
      </View>

      <View style={styles.panel}>
        <InputField
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          placeholder="jane@example.com"
          value={email}
        />
        <InputField
          label="Password"
          onChangeText={setPassword}
          placeholder="Your password"
          secureTextEntry
          value={password}
        />
        <PrimaryButton label="Login" loading={submitting} onPress={onSubmit} />
        <Link href="/register" style={styles.link}>
          Don&apos;t have an account? Register
        </Link>
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 32,
    gap: 12,
    padding: 22,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 6,
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 32,
    gap: 16,
    padding: 20,
    ...theme.shadow,
  },
  link: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
