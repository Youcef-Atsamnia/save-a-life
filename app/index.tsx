import { Href, Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { theme } from '@/constants/app-theme';
import { useAuth } from '@/hooks/use-auth';

export default function IndexPage() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Redirect href={(user ? (user.email_verified ? '/(tabs)' : '/verify-email') : '/login') as Href} />
  );
}
