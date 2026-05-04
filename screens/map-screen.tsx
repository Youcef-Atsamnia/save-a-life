import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { theme } from '@/constants/app-theme';
import { useLocale } from '@/hooks/use-locale';
import { getFacilities } from '@/services/facilities';
import { Facility, FacilityType } from '@/services/types';

export const MapScreen = () => {
  const { t } = useLocale();
  const [type, setType] = useState<FacilityType>('hospital');
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const loadFacilities = async () => {
    try {
      const data = await getFacilities({ type });
      setFacilities(data);
    } catch (error) {
      Alert.alert('Unable to load facilities', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFacilities();
    }, [type])
  );

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Facilities"
        title={t('facilities.title')}
        description={t('facilities.description')}
      />

      <View style={styles.filterRow}>
        <Text
          onPress={() => setType('hospital')}
          style={[styles.filterChip, type === 'hospital' && styles.filterChipActive]}>
          Hospital
        </Text>
        <Text
          onPress={() => setType('blood_bank')}
          style={[styles.filterChip, type === 'blood_bank' && styles.filterChipActive]}>
          Blood Banks
        </Text>
      </View>

      <View style={styles.list}>
        {facilities.length ? (
          facilities.map((facility) => (
            <View key={facility.id} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{facility.name}</Text>
                <Text style={styles.badge}>{facility.type === 'hospital' ? 'Hospital' : 'Blood bank'}</Text>
              </View>
              <Text style={styles.meta}>{facility.city}</Text>
              <Text style={styles.meta}>{facility.address}</Text>
              <Text style={styles.phone}>{facility.phone}</Text>
              <PrimaryButton label="Call" onPress={() => Linking.openURL(`tel:${facility.phone}`)} tone="secondary" />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>{t('facilities.empty')}</Text>
        )}
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
  },
  filterChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 999,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    color: '#fff',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    gap: 8,
    padding: 18,
    ...theme.shadow,
  },
  headerRow: {
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  badge: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  phone: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  empty: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
});
