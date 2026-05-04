import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';

import { useAuth } from './use-auth';

type LanguageCode = 'en' | 'fr' | 'ar';

type TranslationKey =
  | 'tabs.home'
  | 'tabs.request'
  | 'tabs.donors'
  | 'tabs.facilities'
  | 'tabs.profile'
  | 'auth.registerTitle'
  | 'auth.registerDescription'
  | 'auth.confirmPassword'
  | 'auth.passwordMismatch'
  | 'auth.language'
  | 'auth.loginTitle'
  | 'auth.loginDescription'
  | 'auth.verifyTitle'
  | 'auth.verifyDescription'
  | 'auth.verifyButton'
  | 'auth.resendOtp'
  | 'auth.otpPreview'
  | 'profile.cooldown'
  | 'profile.reputation'
  | 'profile.points'
  | 'profile.certificate'
  | 'profile.verified'
  | 'profile.notVerified'
  | 'profile.language'
  | 'profile.sendOtp'
  | 'profile.nextEligible'
  | 'facilities.title'
  | 'facilities.description'
  | 'facilities.hospitals'
  | 'facilities.bloodBanks'
  | 'facilities.empty';

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    'tabs.home': 'Home',
    'tabs.request': 'Request',
    'tabs.donors': 'Donors',
    'tabs.facilities': 'Facilities',
    'tabs.profile': 'Profile',
    'auth.registerTitle': 'Create your donor profile.',
    'auth.registerDescription': 'Share your blood type and city so emergency requests can find you fast.',
    'auth.confirmPassword': 'Confirm password',
    'auth.passwordMismatch': 'Passwords do not match.',
    'auth.language': 'Language',
    'auth.loginTitle': 'Save lives by staying available.',
    'auth.loginDescription': 'Sign in to respond to urgent blood requests near you.',
    'auth.verifyTitle': 'Verify your email.',
    'auth.verifyDescription': 'Enter the 6-digit code sent to your email address. In local development the code is shown below.',
    'auth.verifyButton': 'Verify code',
    'auth.resendOtp': 'Send new code',
    'auth.otpPreview': 'Local OTP preview',
    'profile.cooldown': 'Cooldown',
    'profile.reputation': 'Reputation',
    'profile.points': 'Points',
    'profile.certificate': 'Certificate',
    'profile.verified': 'Verified',
    'profile.notVerified': 'Not verified',
    'profile.language': 'Preferred language',
    'profile.sendOtp': 'Verify email',
    'profile.nextEligible': 'Next eligible donation',
    'facilities.title': 'Verified hospitals and blood banks.',
    'facilities.description': 'Use these trusted contacts for urgent coordination, addresses, and phone numbers.',
    'facilities.hospitals': 'Verified hospitals',
    'facilities.bloodBanks': 'Verified blood banks',
    'facilities.empty': 'No verified facilities found.',
  },
  fr: {
    'tabs.home': 'Accueil',
    'tabs.request': 'Demande',
    'tabs.donors': 'Donneurs',
    'tabs.facilities': 'Centres',
    'tabs.profile': 'Profil',
    'auth.registerTitle': 'Créez votre profil de donneur.',
    'auth.registerDescription': 'Partagez votre groupe sanguin et votre ville pour être trouvé rapidement.',
    'auth.confirmPassword': 'Confirmer le mot de passe',
    'auth.passwordMismatch': 'Les mots de passe ne correspondent pas.',
    'auth.language': 'Langue',
    'auth.loginTitle': 'Restez disponible pour sauver des vies.',
    'auth.loginDescription': 'Connectez-vous pour répondre aux demandes urgentes près de chez vous.',
    'auth.verifyTitle': 'Vérifiez votre e-mail.',
    'auth.verifyDescription': 'Entrez le code à 6 chiffres envoyé par e-mail. En local, il est affiché ci-dessous.',
    'auth.verifyButton': 'Vérifier le code',
    'auth.resendOtp': 'Renvoyer un code',
    'auth.otpPreview': 'Code OTP local',
    'profile.cooldown': 'Attente',
    'profile.reputation': 'Réputation',
    'profile.points': 'Points',
    'profile.certificate': 'Certificat',
    'profile.verified': 'Vérifié',
    'profile.notVerified': 'Non vérifié',
    'profile.language': 'Langue préférée',
    'profile.sendOtp': 'Vérifier l’e-mail',
    'profile.nextEligible': 'Prochain don possible',
    'facilities.title': 'Hôpitaux et banques de sang vérifiés.',
    'facilities.description': 'Utilisez ces contacts fiables pour les urgences, adresses et numéros.',
    'facilities.hospitals': 'Hôpitaux vérifiés',
    'facilities.bloodBanks': 'Banques de sang vérifiées',
    'facilities.empty': 'Aucun centre vérifié trouvé.',
  },
  ar: {
    'tabs.home': 'الرئيسية',
    'tabs.request': 'طلب',
    'tabs.donors': 'المتبرعون',
    'tabs.facilities': 'المراكز',
    'tabs.profile': 'الملف',
    'auth.registerTitle': 'أنشئ ملف المتبرع الخاص بك.',
    'auth.registerDescription': 'شارك فصيلة الدم والمدينة ليتم العثور عليك بسرعة في الحالات العاجلة.',
    'auth.confirmPassword': 'تأكيد كلمة المرور',
    'auth.passwordMismatch': 'كلمتا المرور غير متطابقتين.',
    'auth.language': 'اللغة',
    'auth.loginTitle': 'ابق متاحاً للمساعدة في إنقاذ الأرواح.',
    'auth.loginDescription': 'سجل الدخول للاستجابة لطلبات الدم العاجلة القريبة منك.',
    'auth.verifyTitle': 'تحقق من بريدك الإلكتروني.',
    'auth.verifyDescription': 'أدخل رمز التحقق المكون من 6 أرقام. في التطوير المحلي يظهر الرمز أدناه.',
    'auth.verifyButton': 'تأكيد الرمز',
    'auth.resendOtp': 'إرسال رمز جديد',
    'auth.otpPreview': 'رمز OTP المحلي',
    'profile.cooldown': 'الانتظار',
    'profile.reputation': 'السمعة',
    'profile.points': 'النقاط',
    'profile.certificate': 'الشهادة',
    'profile.verified': 'موثق',
    'profile.notVerified': 'غير موثق',
    'profile.language': 'اللغة المفضلة',
    'profile.sendOtp': 'تأكيد البريد',
    'profile.nextEligible': 'التبرع التالي',
    'facilities.title': 'مستشفيات وبنوك دم موثقة.',
    'facilities.description': 'استخدم هذه الجهات الموثوقة للتنسيق العاجل والعناوين وأرقام الهاتف.',
    'facilities.hospitals': 'المستشفيات الموثقة',
    'facilities.bloodBanks': 'بنوك الدم الموثقة',
    'facilities.empty': 'لا توجد جهات موثقة.',
  },
};

type LocaleContextValue = {
  language: LanguageCode;
  setLanguage: (value: LanguageCode) => void;
  t: (key: TranslationKey) => string;
  isRTL: boolean;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const [manualLanguage, setManualLanguage] = useState<LanguageCode | null>(null);

  const language = manualLanguage || user?.preferred_language || 'en';

  const value = useMemo(
    () => ({
      language,
      setLanguage: setManualLanguage,
      t: (key: TranslationKey) => translations[language][key] || translations.en[key],
      isRTL: language === 'ar',
    }),
    [language]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used inside LocaleProvider');
  }

  return context;
};
