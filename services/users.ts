import { apiRequest } from './api';
import type { BloodType, Donor, LanguageCode, User } from './types';

type DonorFilters = {
  bloodType?: BloodType;
  city?: string;
  latitude?: number | null;
  longitude?: number | null;
  maxDistanceKm?: number;
};

const buildQueryString = (params: Record<string, string | number | undefined | null>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const getDonors = (filters: DonorFilters) =>
  apiRequest<Donor[]>(
    `/users${buildQueryString({
      available: 'true',
      bloodType: filters.bloodType,
      city: filters.city,
      latitude: filters.latitude,
      longitude: filters.longitude,
      maxDistanceKm: filters.maxDistanceKm,
    })}`
  );

export const updateUserProfile = (
  userId: number,
  payload: Partial<Pick<User, 'city' | 'latitude' | 'longitude' | 'available' | 'preferred_language'>>
) =>
  apiRequest<User>(`/users/${userId}`, {
    method: 'PUT',
    body: {
      city: payload.city,
      latitude: payload.latitude,
      longitude: payload.longitude,
      available: payload.available,
      preferredLanguage: payload.preferred_language,
    },
  });

export const getCurrentUserProfile = () => apiRequest<User>('/users/me');
