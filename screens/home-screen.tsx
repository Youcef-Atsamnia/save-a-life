import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { AppShell } from '@/components/app-shell';
import { PrimaryButton } from '@/components/primary-button';
import { RequestCard } from '@/components/request-card';
import { SectionTitle } from '@/components/section-title';
import { StatChip } from '@/components/stat-chip';
import { theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentCoordinates } from '@/hooks/use-location';
import { createDonation } from '@/services/donations';
import { getRequests } from '@/services/requests';
import { RequestItem } from '@/services/types';

export const HomeScreen = () => {
  const { user, refreshDonationHistory, refreshCurrentUser } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    if (!user) {
      return;
    }

    try {
      const coordinates = await getCurrentCoordinates().catch(() => null);
      const data = await getRequests({
        latitude: coordinates?.latitude ?? user.latitude,
        longitude: coordinates?.longitude ?? user.longitude,
      });
      setRequests(data);
    } catch (error) {
      Alert.alert('Unable to load requests', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadRequests();
    }, [user?.id])
  );

  const onDonate = async (requestId: number) => {
    try {
      await createDonation(requestId);
      await refreshDonationHistory();
      await refreshCurrentUser();
      Alert.alert('Donation recorded', 'Thank you. The request has been marked as closed.');
      loadRequests();
    } catch (error) {
      Alert.alert('Donation unavailable', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  return (
    <AppShell>
      <SectionTitle
        eyebrow="Nearby emergencies"
        title="Urgent blood requests around you."
        description="Requests are sorted by urgency and distance to help donors respond quickly."
      />

      <View style={styles.statsRow}>
        <StatChip label="Open cases" value={String(requests.length)} tone="danger" />
        <StatChip label="Your type" value={user?.blood_type || '--'} />
        <StatChip
          label="Status"
          value={user?.available ? 'Available' : 'Offline'}
          tone={user?.available ? 'success' : 'warning'}
        />
      </View>

      <View style={styles.list}>
        {requests.map((request) => (
          <View key={request.id} style={styles.item}>
            <RequestCard request={request} />
            <PrimaryButton label="Respond to request" onPress={() => onDonate(request.id)} />
          </View>
        ))}

        {!loading && !requests.length ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active emergencies nearby</Text>
            <Text style={styles.emptyText}>
              Try again later or create a request if someone needs urgent support.
            </Text>
          </View>
        ) : null}
      </View>
    </AppShell>
  );
};

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  list: {
    gap: 16,
  },
  item: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 28,
    gap: 10,
    padding: 22,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
