import { authStorage } from './storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT';
  body?: Record<string, unknown>;
  token?: string | null;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const storedAuth = await authStorage.get();
  const token = options.token ?? storedAuth?.token;

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Request failed', response.status);
  }

  return data as T;
};
