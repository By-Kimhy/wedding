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

import { htmlLang } from "@/data/i18n";
import { LANGUAGES, type Lang, type Localized } from "@/data/wedding";
import { useIsClient } from "./client";

const STORAGE_KEY = "invitation:lang";
const DEFAULT_LANG: Lang = "en";

type LanguageContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  /** Resolve a localized value (or pass a plain string straight through). */
  t: (value: Localized | string) => string;
  /** Class that applies the right typographic face for the active language. */
  fontClass: string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const fontClassFor: Record<Lang, string> = {
  en: "font-en",
  zh: "font-zh",
  kh: "font-kh",
};

function isLang(value: unknown): value is Lang {
  return (
    typeof value === "string" && (LANGUAGES as readonly string[]).includes(value)
  );
}

/**
 * The best starting language: whatever the guest chose last, otherwise a match
 * against the browser's preferred languages, otherwise English. Read once and
 * remembered, since neither source changes during a visit.
 */
let detected: Lang | undefined;

function detectLang(): Lang {
  if (detected) return detected;

  let result: Lang = DEFAULT_LANG;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored)) {
      detected = stored;
      return stored;
    }
  } catch {
    // Private browsing can deny storage access; fall through to detection.
  }

  for (const tag of navigator.languages ?? [navigator.language]) {
    const lower = tag.toLowerCase();
    if (lower.startsWith("zh")) {
      result = "zh";
      break;
    }
    if (lower.startsWith("km")) {
      result = "kh";
      break;
    }
    if (lower.startsWith("en")) break;
  }

  detected = result;
  return result;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  /*
   * The server renders the default language so the markup is stable, and the
   * guest's own preference takes over once the page is running in the browser.
   * Switching is only a state change, so the page is never reloaded and the
   * scroll position is kept.
   */
  const isClient = useIsClient();
  const [chosen, setChosen] = useState<Lang | null>(null);
  const lang = chosen ?? (isClient ? detectLang() : DEFAULT_LANG);

  useEffect(() => {
    document.documentElement.lang = htmlLang[lang];
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setChosen(next);
    detected = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The preference simply will not persist; the switch still works.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (input: Localized | string) =>
      typeof input === "string" ? input : (input[lang] ?? input.en);

    return { lang, setLang, t, fontClass: fontClassFor[lang] };
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside <LanguageProvider>");
  }
  return value;
}
