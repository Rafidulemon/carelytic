"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { bn } from "@/locales/bn";
import { en } from "@/locales/en";
import {
  LANGUAGE_STORAGE_KEY,
  type Language,
  type TranslationDictionary,
  type TranslationValue,
} from "@/locales/types";

const translationMap: Record<Language, TranslationDictionary> = {
  en,
  bn,
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
  getCopy: <T = unknown>(key: string) => T;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function getNestedValue(dictionary: TranslationDictionary | TranslationValue, key: string): TranslationValue {
  if (typeof key !== "string" || key.length === 0) {
    return dictionary;
  }
  const segments = key.split(".");
  let current: TranslationValue = dictionary;
  for (const segment of segments) {
    if (current && typeof current === "object" && !Array.isArray(current) && segment in current) {
      current = (current as TranslationDictionary)[segment];
    } else {
      return key;
    }
  }
  return current;
}

function applyReplacements(value: string, replacements?: Record<string, string | number>) {
  if (!replacements) {
    return value;
  }
  return Object.entries(replacements).reduce((acc, [token, replacement]) => {
    const pattern = new RegExp(`{{\\s*${token}\\s*}}`, "g");
    return acc.replace(pattern, String(replacement));
  }, value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (stored === "en" || stored === "bn") {
      setLanguage(stored);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
    if (typeof window !== "undefined" && isHydrated) {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [isHydrated, language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "bn" : "en"));
  }, []);

  const dictionary = translationMap[language];

  const t = useCallback<LanguageContextValue["t"]>(
    (key, replacements) => {
      const value = getNestedValue(dictionary, key);
      if (typeof value === "string") {
        return applyReplacements(value, replacements);
      }
      if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
      }
      return key;
    },
    [dictionary]
  );

  const getCopy = useCallback(<T,>(key: string) => {
    const value = getNestedValue(dictionary, key);
    return value as T;
  }, [dictionary]);

  const value = useMemo<LanguageContextValue>(
    () => ({ language, setLanguage, toggleLanguage, t, getCopy }),
    [language, t, getCopy, toggleLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
