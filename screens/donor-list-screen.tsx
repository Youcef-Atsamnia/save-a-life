import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { DonorCard } from '@/components/donor-card';
import { InputField } from '@/components/input-field';
import { SectionTitle } from '@/components/section-title';
import { SegmentedPicker } from '@/components/segmented-picker';
import { bloodTypes, theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentCoordinates } from '@/hooks/use-location';
import { BloodType, Donor } from '@/services/types';
import { getDonors } from '@/services/users';

export const DonorListScreen = () => {
  const { user } = useAuth();
  const [bloodType, setBloodType] = useState<BloodType>(user?.blood_type || 'O+');
  const [city, setCity] = useState(user?.city || '');
  const [donors, setDonors] = useState<Donor[]>([]);

  const loadDonors = async () => {
    try {
      const coordinates = await getCurrentCoordinates().catch(() => null);
      const data = await getDonors({
        bloodType,
        city,
        latitude: coordinates?.latitude ?? user?.latitude,
        longitude: coordinates?.longitude ?? user?.longitude,
      });
      setDonors(data);
    } catch (error) {
      Alert.alert('Unable to load donors', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDonors();
    }, [bloodType, city, user?.id])
  );

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Donor network"
        title="Find compatible donors."
        description="Filter by blood type and city to identify available donors who can help."
      />

      <View style={styles.filters}>
        <SegmentedPicker label="Blood type" onChange={setBloodType} options={bloodTypes} value={bloodType} />
        <InputField label="City" onChangeText={setCity} placeholder="Casablanca" value={city} />
      </View>

      <View style={styles.list}>
        {donors.map((donor) => (
          <DonorCard donor={donor} key={donor.id} />
        ))}
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  filters: {
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    gap: 16,
    padding: 18,
    ...theme.shadow,
  },
  list: {
    gap: 14,
  },
});
