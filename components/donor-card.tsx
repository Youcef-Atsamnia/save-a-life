import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/app-theme';
import { Donor } from '@/services/types';

type Props = {
  donor: Donor;
};

export const DonorCard = ({ donor }: Props) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View>
        <Text style={styles.name}>{donor.name}</Text>
        <Text style={styles.city}>{donor.city}</Text>
      </View>
      <Text style={styles.bloodType}>{donor.blood_type}</Text>
    </View>
    <Text style={styles.meta}>
      {donor.distance_km !== null && donor.distance_km !== undefined
        ? `${donor.distance_km} km away`
        : 'Location not shared'}{' '}
      ·{' '}
      {donor.available ? 'Available' : 'Unavailable'}
    </Text>
    <Text style={styles.meta}>
      Last donation:{' '}
      {donor.last_donation_date ? new Date(donor.last_donation_date).toLocaleDateString() : 'No records yet'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    gap: 8,
    padding: 18,
    ...theme.shadow,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  city: {
    color: theme.colors.textMuted,
    fontSize: 14,
  },
  bloodType: {
    color: theme.colors.primary,
    fontSize: 22,
    fontWeight: '900',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
