import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { SegmentedPicker } from '@/components/segmented-picker';
import { StatChip } from '@/components/stat-chip';
import { theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { useLocale } from '@/hooks/use-locale';
import { updateUserProfile } from '@/services/users';
import { LanguageCode } from '@/services/types';

export const ProfileScreen = () => {
  const { user, donationHistory, logout, updateCurrentUser, sendVerificationOtp } = useAuth();
  const { t, setLanguage } = useLocale();
  const [updating, setUpdating] = useState(false);

  if (!user) {
    return null;
  }

  const onToggleAvailability = async (available: boolean) => {
    const previousUser = user;

    try {
      setUpdating(true);
      updateCurrentUser({ ...user, available });
      const updated = await updateUserProfile(user.id, { available });
      updateCurrentUser(updated);
    } catch (error) {
      updateCurrentUser(previousUser);
      Alert.alert('Unable to update profile', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const onChangeLanguage = async (preferredLanguage: LanguageCode) => {
    try {
      setUpdating(true);
      setLanguage(preferredLanguage);
      const updated = await updateUserProfile(user.id, { preferred_language: preferredLanguage });
      updateCurrentUser(updated);
    } catch (error) {
      Alert.alert('Unable to update language', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const onLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Profile"
        title={user.name}
        description={`${user.blood_type} donor in ${user.city}`}
      />

      <View style={styles.hero}>
        <StatChip
          label="Availability"
          tone={user.available ? 'success' : 'warning'}
          value={user.available ? 'Ready' : 'Paused'}
        />
        <StatChip label={t('profile.points')} value={String(user.profile_stats?.donorPoints || 0)} />
        <StatChip label={t('profile.reputation')} value={`${user.profile_stats?.reputationScore || 0}/100`} />
        <StatChip label="Member since" value={new Date(user.created_at).getFullYear().toString()} />
      </View>

      <View style={styles.panel}>
        <View style={styles.switchRow}>
          <View style={styles.switchCopy}>
            <Text style={styles.switchTitle}>Available for urgent calls</Text>
            <Text style={styles.switchText}>Turn this off if you cannot donate right now.</Text>
          </View>
          <Switch
            disabled={updating}
            onValueChange={onToggleAvailability}
            thumbColor="#fff"
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            value={user.available}
          />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionHeading}>{t('profile.language')}</Text>
        <SegmentedPicker
          label={t('profile.language')}
          onChange={(value) => onChangeLanguage(value as LanguageCode)}
          options={['en', 'fr', 'ar'] as const}
          value={user.preferred_language}
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionHeading}>{t('profile.certificate')}</Text>
        <Text style={styles.historyText}>
          {user.profile_stats?.certificateEligible
            ? 'Donation certificate unlocked.'
            : `${user.profile_stats?.pointsToNextCertificate || 0} points left before your first certificate.`}
        </Text>
        <Text style={styles.historyText}>
          {t('profile.cooldown')}: {user.profile_stats?.cooldownDaysRemaining || 0} day(s)
        </Text>
        <Text style={styles.historyText}>
          {t('profile.nextEligible')}: {user.profile_stats?.nextEligibleDate ? new Date(user.profile_stats.nextEligibleDate).toLocaleDateString() : 'Available now'}
        </Text>
        <Text style={styles.historyText}>
          {user.email_verified ? t('profile.verified') : t('profile.notVerified')}
        </Text>
        {!user.email_verified ? (
          <PrimaryButton label={t('profile.sendOtp')} onPress={sendVerificationOtp} tone="secondary" />
        ) : null}
      </View>

      <View style={styles.panel}>
        <Text style={styles.sectionHeading}>Donation history</Text>
        {donationHistory.map((entry) => (
          <View key={entry.id} style={styles.historyRow}>
            <View>
              <Text style={styles.historyTitle}>{entry.blood_type} request</Text>
              <Text style={styles.historyText}>
                {entry.city} - requested by {entry.requester_name}
              </Text>
            </View>
            <Text style={styles.historyDate}>{new Date(entry.date).toLocaleDateString()}</Text>
          </View>
        ))}
        {!donationHistory.length ? <Text style={styles.historyText}>No donations recorded yet.</Text> : null}
      </View>

      <PrimaryButton label="Logout" onPress={onLogout} tone="danger" />
    </AppShell>
  );
};

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    gap: 14,
    padding: 18,
    ...theme.shadow,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  switchCopy: {
    flex: 1,
    gap: 4,
  },
  switchTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  switchText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  sectionHeading: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  historyRow: {
    alignItems: 'center',
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  historyTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  historyText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  historyDate: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
});
