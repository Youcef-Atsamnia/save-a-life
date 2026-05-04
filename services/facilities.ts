import { apiRequest } from './api';
import type { Facility, FacilityType } from './types';

const buildQueryString = (params: Record<string, string | undefined>) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const getFacilities = (filters: { city?: string; type?: FacilityType } = {}) =>
  apiRequest<Facility[]>(
    `/facilities${buildQueryString({
      city: filters.city,
      type: filters.type,
    })}`
  );
