import { apiRequest } from './api';
import type { BloodType, Donor, RequestItem, RequestStatus, UrgencyLevel } from './types';

type CreateRequestPayload = {
  bloodType: BloodType;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  urgency: UrgencyLevel;
};

type RequestFilters = {
  bloodType?: BloodType;
  city?: string;
  status?: RequestStatus;
  latitude?: number | null;
  longitude?: number | null;
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

export const getRequests = (filters: RequestFilters = {}) =>
  apiRequest<RequestItem[]>(
    `/requests${buildQueryString({
      status: filters.status || 'open',
      bloodType: filters.bloodType,
      city: filters.city,
      latitude: filters.latitude,
      longitude: filters.longitude,
    })}`
  );

export const createRequest = (payload: CreateRequestPayload) =>
  apiRequest<{ request: RequestItem; matches: Donor[] }>('/requests', {
    method: 'POST',
    body: payload,
  });

export const updateRequestStatus = (requestId: number, status: RequestStatus) =>
  apiRequest<RequestItem>(`/requests/${requestId}`, {
    method: 'PUT',
    body: { status },
  });
