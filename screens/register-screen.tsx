import { Href, Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { InputField } from '@/components/input-field';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { SegmentedPicker } from '@/components/segmented-picker';
import { bloodTypes, theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/hooks/use-locale';
import { getCurrentCoordinates } from '@/hooks/use-location';
import { BloodType, LanguageCode } from '@/services/types';

export const RegisterScreen = () => {
  const { register } = useAuth();
  const { t, language } = useLocale();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [preferredLanguage, setPreferredLanguage] = useState<LanguageCode>(language);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    try {
      if (password !== confirmPassword) {
        throw new Error(t('auth.passwordMismatch'));
      }

      setSubmitting(true);
      const coordinates = await getCurrentCoordinates().catch(() => null);
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        bloodType,
        city: city.trim(),
        preferredLanguage,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
      });
      router.replace('/verify-email' as Href);
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Join the network"
        title={t('auth.registerTitle')}
        description={t('auth.registerDescription')}
      />

      <View style={styles.panel}>
        <InputField label="Full name" onChangeText={setName} placeholder="Jane Doe" value={name} />
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
          placeholder="Minimum 6 characters"
          secureTextEntry
          value={password}
        />
        <InputField
          label={t('auth.confirmPassword')}
          onChangeText={setConfirmPassword}
          placeholder="Repeat your password"
          secureTextEntry
          value={confirmPassword}
        />
        <InputField label="City" onChangeText={setCity} placeholder="Alger" value={city} />
        <SegmentedPicker label="Blood type" onChange={setBloodType} options={bloodTypes} value={bloodType} />
        <SegmentedPicker
          label={t('auth.language')}
          onChange={setPreferredLanguage}
          options={['en', 'fr', 'ar'] as const}
          value={preferredLanguage}
        />
        <PrimaryButton label="Register" loading={submitting} onPress={onSubmit} />
        <Link href="/login" style={styles.link}>
          Already have an account? Login
        </Link>
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
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
