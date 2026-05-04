export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type RequestStatus = 'open' | 'closed';
export type LanguageCode = 'en' | 'fr' | 'ar';
export type FacilityType = 'hospital' | 'blood_bank';

export type ProfileStats = {
  donationCount: number;
  donorPoints: number;
  reputationScore: number;
  cooldownDaysRemaining: number;
  nextEligibleDate: string | null;
  certificateEligible: boolean;
  pointsToNextCertificate: number;
};

export type User = {
  id: number;
  name: string;
  email: string;
  blood_type: BloodType;
  city: string;
  latitude: number | null;
  longitude: number | null;
  available: boolean;
  preferred_language: LanguageCode;
  email_verified: boolean;
  donor_points: number;
  reputation_score: number;
  profile_stats?: ProfileStats;
  created_at: string;
};

export type DonationHistoryItem = {
  id: number;
  donor_id: number;
  request_id: number;
  date: string;
  blood_type: BloodType;
  city: string;
  urgency: UrgencyLevel;
  requester_name: string;
};

export type RequestItem = {
  id: number;
  user_id: number;
  blood_type: BloodType;
  city: string;
  latitude: number | null;
  longitude: number | null;
  urgency: UrgencyLevel;
  status: RequestStatus;
  created_at: string;
  requester_name?: string;
  distance_km?: number | null;
};

export type Donor = User & {
  distance_km?: number | null;
  last_donation_date?: string | null;
};

export type AuthResponse = {
  token: string;
  user: User;
  donationHistory: DonationHistoryItem[];
  otpPreview?: string;
};

export type Facility = {
  id: number;
  name: string;
  type: FacilityType;
  city: string;
  address: string;
  phone: string;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
};
