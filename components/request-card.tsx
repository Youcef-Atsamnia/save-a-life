import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/app-theme';
import { RequestItem } from '@/services/types';

type Props = {
  request: RequestItem;
};

export const RequestCard = ({ request }: Props) => (
  <View style={styles.card}>
    <View style={styles.row}>
      <Text style={styles.bloodType}>{request.blood_type}</Text>
      <View style={[styles.badge, urgencyStyles[request.urgency]]}>
        <Text style={styles.badgeText}>{request.urgency}</Text>
      </View>
    </View>
    <Text style={styles.city}>{request.city}</Text>
    <Text style={styles.meta}>
      {request.distance_km !== null && request.distance_km !== undefined
        ? `${request.distance_km} km away`
        : 'Distance unavailable'}{' '}
      ·{' '}
      {request.requester_name || 'Anonymous requester'}
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
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bloodType: {
    color: theme.colors.primary,
    fontSize: 28,
    fontWeight: '800',
  },
  city: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});

const urgencyStyles = StyleSheet.create({
  low: { backgroundColor: theme.colors.success },
  medium: { backgroundColor: theme.colors.warning },
  high: { backgroundColor: theme.colors.danger },
});
