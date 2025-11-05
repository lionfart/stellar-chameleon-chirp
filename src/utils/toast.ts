import { toast } from "sonner";
import { translations, Language, TranslationKeys } from '@/i18n/translations'; // NEW: Import translations

// Helper function to get the current language from localStorage
const getCurrentLanguage = (): Language => {
  const savedLang = localStorage.getItem('language') as Language;
  if (savedLang && translations[savedLang]) {
    return savedLang;
  }
  const browserLang = navigator.language.split('-')[0] as Language;
  if (translations[browserLang]) {
    return browserLang;
  }
  return 'en'; // Default to English
};

// Helper function to translate a key
const t = (key: TranslationKeys): string => {
  const lang = getCurrentLanguage();
  return translations[lang][key] || translations['en'][key] || key;
};

export const showSuccess = (messageKey: TranslationKeys | string) => { // NEW: Accept TranslationKeys or string
  const message = typeof messageKey === 'string' && messageKey in translations['en'] ? t(messageKey as TranslationKeys) : messageKey;
  toast.success(message);
};

export const showError = (messageKey: TranslationKeys | string) => { // NEW: Accept TranslationKeys or string
  const message = typeof messageKey === 'string' && messageKey in translations['en'] ? t(messageKey as TranslationKeys) : messageKey;
  toast.error(message);
};

export const showLoading = (messageKey: TranslationKeys | string) => { // NEW: Accept TranslationKeys or string
  const message = typeof messageKey === 'string' && messageKey in translations['en'] ? t(messageKey as TranslationKeys) : messageKey;
  return toast.loading(message);
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};