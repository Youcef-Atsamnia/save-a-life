import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { InputField } from '@/components/input-field';
import { PrimaryButton } from '@/components/primary-button';
import { SectionTitle } from '@/components/section-title';
import { SegmentedPicker } from '@/components/segmented-picker';
import { bloodTypes, theme, urgencyLevels } from '@/constants/app-theme';
import { getCurrentCoordinates } from '@/hooks/use-location';
import { createRequest } from '@/services/requests';
import { BloodType, UrgencyLevel } from '@/services/types';

export const CreateRequestScreen = () => {
  const [bloodType, setBloodType] = useState<BloodType>('O+');
  const [city, setCity] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('high');
  const [submitting, setSubmitting] = useState(false);
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const onSubmit = async () => {
    try {
      setSubmitting(true);
      const coordinates = await getCurrentCoordinates().catch(() => null);
      const response = await createRequest({
        bloodType,
        city: city.trim(),
        urgency,
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
      });

      setMatchCount(response.matches.length);
      Alert.alert('Request created', `We found ${response.matches.length} potentially eligible donors.`);
    } catch (error) {
      Alert.alert('Unable to create request', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Request blood"
        title="Create an emergency request."
        description="Add the blood type, location, and urgency level so nearby donors can respond."
      />

      <View style={styles.panel}>
        <SegmentedPicker label="Blood type" onChange={setBloodType} options={bloodTypes} value={bloodType} />
        <InputField label="City" onChangeText={setCity} placeholder="Alger" value={city} />
        <SegmentedPicker label="Urgency" onChange={setUrgency} options={urgencyLevels} value={urgency} />
        <PrimaryButton label="Create request" loading={submitting} onPress={onSubmit} />
        {matchCount !== null ? (
          <Text style={styles.matchText}>{matchCount} matching donors were identified for this request.</Text>
        ) : null}
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
  matchText: {
    color: theme.colors.success,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
