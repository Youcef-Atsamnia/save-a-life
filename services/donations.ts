import { apiRequest } from './api';
import type { DonationHistoryItem } from './types';

export const createDonation = (requestId: number) =>
  apiRequest<{ id: number; donor_id: number; request_id: number; date: string }>('/donations', {
    method: 'POST',
    body: { requestId },
  });

export const getDonationHistory = (userId: number) =>
  apiRequest<DonationHistoryItem[]>(`/donations/user/${userId}`);
