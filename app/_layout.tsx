import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { LocaleProvider } from '@/hooks/use-locale';
import { AuthProvider } from '@/hooks/use-auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LocaleProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="verify-email" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="dark" />
      </LocaleProvider>
    </AuthProvider>
  );
}
