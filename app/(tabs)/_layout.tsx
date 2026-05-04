import { FontAwesome6 } from '@expo/vector-icons';
import { Href, Redirect, Tabs } from 'expo-router';

import { useLocale } from '@/hooks/use-locale';
import { useAuth } from '@/hooks/use-auth';

export default function TabLayout() {
  const { user } = useAuth();
  const { t } = useLocale();

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.email_verified) {
    return <Redirect href={'/verify-email' as Href} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#B3242A',
        tabBarInactiveTintColor: '#6E625D',
        tabBarStyle: {
          backgroundColor: '#FFFDF9',
          borderTopColor: '#E1D6CA',
          height: 74,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <FontAwesome6 color={color} name="house-medical" size={size} />,
        }}
      />
      <Tabs.Screen
        name="create-request"
        options={{
          title: t('tabs.request'),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 color={color} name="hand-holding-droplet" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="donors"
        options={{
          title: t('tabs.donors'),
          tabBarIcon: ({ color, size }) => <FontAwesome6 color={color} name="users" size={size} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.facilities'),
          tabBarIcon: ({ color, size }) => <FontAwesome6 color={color} name="map-location-dot" size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color, size }) => <FontAwesome6 color={color} name="user" size={size} />,
        }}
      />
    </Tabs>
  );
}
