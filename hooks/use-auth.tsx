import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { loginUser, registerUser, sendOtp, verifyOtp } from '@/services/auth';
import { getDonationHistory } from '@/services/donations';
import { authStorage } from '@/services/storage';
import { getCurrentUserProfile } from '@/services/users';
import type { AuthResponse, BloodType, DonationHistoryItem, LanguageCode, User } from '@/services/types';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  bloodType: BloodType;
  city: string;
  preferredLanguage?: LanguageCode;
  latitude?: number | null;
  longitude?: number | null;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  donationHistory: DonationHistoryItem[];
  otpPreview: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshDonationHistory: () => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  sendVerificationOtp: () => Promise<string | undefined>;
  verifyEmailOtp: (code: string) => Promise<void>;
  clearOtpPreview: () => void;
  updateCurrentUser: (nextUser: User) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [donationHistory, setDonationHistory] = useState<DonationHistoryItem[]>([]);
  const [otpPreview, setOtpPreview] = useState<string | null>(null);

  const applyAuthResponse = async (response: AuthResponse) => {
    setToken(response.token);
    setUser(response.user);
    setDonationHistory(response.donationHistory);
    setOtpPreview(response.otpPreview || null);
    await authStorage.set({ token: response.token, user: response.user });
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await authStorage.get();

        if (!stored) {
          return;
        }

        setToken(stored.token);
        const currentUser = await getCurrentUserProfile();
        setUser(currentUser as User);
        await authStorage.set({ token: stored.token, user: currentUser });
        const history = await getDonationHistory(stored.user.id);
        setDonationHistory(history);
      } catch {
        await authStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const refreshDonationHistory = async () => {
    if (!user) {
      return;
    }

    const history = await getDonationHistory(user.id);
    setDonationHistory(history);
  };

  const refreshCurrentUser = async () => {
    const currentUser = await getCurrentUserProfile();
    setUser(currentUser);
    if (token) {
      await authStorage.set({ token, user: currentUser });
    }
  };

  const login = async (email: string, password: string) => {
    const response = await loginUser(email, password);
    await applyAuthResponse(response);
  };

  const register = async (payload: RegisterInput) => {
    const response = await registerUser(payload);
    await applyAuthResponse(response);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setDonationHistory([]);
    setOtpPreview(null);
    await authStorage.clear();
  };

  const sendVerificationOtp = async () => {
    const response = await sendOtp();
    if (response.otpPreview) {
      setOtpPreview(response.otpPreview);
    }
    return response.otpPreview;
  };

  const verifyEmailOtp = async (code: string) => {
    const response = await verifyOtp(code);
    await applyAuthResponse(response);
    setOtpPreview(null);
  };

  const clearOtpPreview = () => {
    setOtpPreview(null);
  };

  const updateCurrentUser = (nextUser: User) => {
    setUser(nextUser);
    if (token) {
      authStorage.set({ token, user: nextUser });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        donationHistory,
        otpPreview,
        login,
        register,
        logout,
        refreshDonationHistory,
        refreshCurrentUser,
        sendVerificationOtp,
        verifyEmailOtp,
        clearOtpPreview,
        updateCurrentUser,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
};
