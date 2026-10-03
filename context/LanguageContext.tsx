'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { Language } from '@/types';
import { DICTIONARY } from '@/data/translations';

export type TranslationDictionary = (typeof DICTIONARY)['ar'] | (typeof DICTIONARY)['en'];

interface LanguageContextType {
  language: Language;
  direction: 'rtl' | 'ltr';
  isRtl: boolean;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'rifaa_language';
const LANGUAGE_CHANGE_EVENT = 'rifaa-language-change';
let languageMemorySnapshot: Language = 'ar';

function subscribeLanguage(onStoreChange: () => void) {
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
}

function getLanguageSnapshot(): Language {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === 'ar' || saved === 'en') {
      languageMemorySnapshot = saved;
      return saved;
    }
  } catch {
    // Fall back to in-memory state when storage is unavailable.
  }
  return languageMemorySnapshot;
}

function getLanguageServerSnapshot(): Language {
  return 'ar';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(
    subscribeLanguage,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  );

  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // The in-memory snapshot remains the fallback.
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    languageMemorySnapshot = lang;
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // The in-memory snapshot remains the fallback.
    }
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isRtl = language === 'ar';
  const t = DICTIONARY[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRtl,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
