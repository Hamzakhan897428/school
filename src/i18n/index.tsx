import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Locale, TranslationSchema } from "./translations";
import { storage } from "../api/storage";

interface I18nContextType {
  locale: Locale;
  isRTL: boolean;
  t: (path: string, params?: Record<string, string | number>) => string;
  setLocale: (nextLocale: Locale) => Promise<void>;
  toggleLocale: () => Promise<void>;
  translations: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode; initialLocale?: Locale }> = ({
  children,
  initialLocale = "en",
}) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  // Load saved language on startup
  useEffect(() => {
    const loadStoredLocale = async () => {
      try {
        const stored = await storage.getLocale();
        if (stored === "en" || stored === "ur") {
          setLocaleState(stored);
        }
      } catch {
        // Fallback to default
      }
    };
    loadStoredLocale();
  }, []);

  const setLocale = useCallback(async (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    await storage.setLocale(nextLocale);
  }, []);

  const toggleLocale = useCallback(async () => {
    const next = locale === "en" ? "ur" : "en";
    await setLocale(next);
  }, [locale, setLocale]);

  /**
   * Translates a dot-notated string key (e.g. "dashboard.attendanceToday" or "common.back")
   * Supports parameter interpolation: e.g. %{pct} -> 100
   */
  const t = useCallback(
    (path: string, params?: Record<string, string | number>): string => {
      const keys = path.split(".");
      let current: any = translations[locale];

      for (const k of keys) {
        if (current && typeof current === "object" && k in current) {
          current = current[k];
        } else {
          // Fallback to English if key missing in target language
          let fallback: any = translations.en;
          for (const fbKey of keys) {
            if (fallback && typeof fallback === "object" && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              return path;
            }
          }
          current = fallback;
          break;
        }
      }

      if (typeof current !== "string") {
        return path;
      }

      if (params) {
        let str = current;
        Object.entries(params).forEach(([key, val]) => {
          str = str.replace(new RegExp(`%\\{${key}\\}`, "g"), String(val));
        });
        return str;
      }

      return current;
    },
    [locale]
  );

  const isRTL = locale === "ur";
  const currentTranslations = translations[locale];

  return (
    <I18nContext.Provider
      value={{
        locale,
        isRTL,
        t,
        setLocale,
        toggleLocale,
        translations: currentTranslations,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

export default useI18n;

