import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from './types';

const AUTH_KEY = 'save-a-life-auth';

export type StoredAuth = {
  token: string;
  user: User;
};

export const authStorage = {
  async get() {
    const value = await AsyncStorage.getItem(AUTH_KEY);
    return value ? (JSON.parse(value) as StoredAuth) : null;
  },
  async set(value: StoredAuth) {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(value));
  },
  async clear() {
    await AsyncStorage.removeItem(AUTH_KEY);
  },
};
