export type Language = "en" | "bn";

export type TranslationValue = string | number | boolean | null | TranslationValue[] | TranslationDictionary;

export interface TranslationDictionary {
  [key: string]: TranslationValue;
}

export type Translations = TranslationDictionary;

export const LANGUAGE_STORAGE_KEY = "carelytic-language";
