import { apiRequest } from './api';
import type { AuthResponse, BloodType, LanguageCode } from './types';

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  bloodType: BloodType;
  city: string;
  preferredLanguage?: LanguageCode;
  latitude?: number | null;
  longitude?: number | null;
};

export const registerUser = (payload: RegisterPayload) =>
  apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: payload,
    token: null,
  });

export const loginUser = (email: string, password: string) =>
  apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: { email, password },
    token: null,
  });

export const sendOtp = () =>
  apiRequest<{ message: string; otpPreview?: string }>('/auth/send-otp', {
    method: 'POST',
    body: {},
  });

export const verifyOtp = (code: string) =>
  apiRequest<AuthResponse>('/auth/verify-otp', {
    method: 'POST',
    body: { code },
  });
