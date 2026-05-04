import { Href, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { InputField } from '@/components/input-field';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/hooks/use-locale';

export const VerifyEmailScreen = () => {
  const { user, otpPreview, sendVerificationOtp, verifyEmailOtp, clearOtpPreview } = useAuth();
  const { t } = useLocale();
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.email_verified) {
      router.replace('/(tabs)' as Href);
    }
  }, [user?.email_verified]);

  const onVerify = async () => {
    try {
      setSubmitting(true);
      await verifyEmailOtp(code.trim());
      clearOtpPreview();
      router.replace('/(tabs)' as Href);
    } catch (error) {
      Alert.alert('Verification failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const onResend = async () => {
    try {
      const preview = await sendVerificationOtp();
      if (preview) {
        Alert.alert('New code generated', preview);
      }
    } catch (error) {
      Alert.alert('Unable to send code', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="OTP"
        title={t('auth.verifyTitle')}
        description={t('auth.verifyDescription')}
      />

      <View style={styles.panel}>
        <InputField label="OTP" onChangeText={setCode} placeholder="123456" value={code} />
        {otpPreview ? (
          <Text style={styles.preview}>
            {t('auth.otpPreview')}: {otpPreview}
          </Text>
        ) : null}
        <PrimaryButton label={t('auth.verifyButton')} loading={submitting} onPress={onVerify} />
        <PrimaryButton label={t('auth.resendOtp')} onPress={onResend} tone="secondary" />
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    gap: 16,
    padding: 20,
    ...theme.shadow,
  },
  preview: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
});
