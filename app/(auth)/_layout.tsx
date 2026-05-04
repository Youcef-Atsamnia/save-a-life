import { Href, Redirect, Stack } from 'expo-router';

import { useAuth } from '@/hooks/use-auth';

export default function AuthLayout() {
  const { user } = useAuth();

  if (user) {
    return <Redirect href={(user.email_verified ? '/(tabs)' : '/verify-email') as Href} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
