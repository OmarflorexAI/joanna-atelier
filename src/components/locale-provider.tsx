"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import {
  LOCALES,
  MESSAGES,
  type Locale,
  type MessageKey,
} from "@/content/i18n";

const STORAGE_KEY = "johanna.locale";
/** The pre-rename key. Read once so a returning visitor keeps the language
 *  they picked; the brand was misspelled "Joanna" until the rename. */
const LEGACY_STORAGE_KEY = "joanna.locale";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

function isLocale(v: string | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

/**
 * The chosen locale, held outside React so it can be read synchronously
 * during render on the client and subscribed to without an effect.
 */
let current: Locale | null = null;
const listeners = new Set<() => void>();

function resolve(): Locale {
  if (current) return current;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return (current = stored);
    // Migrate a choice made before the rename, then retire the old key.
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (isLocale(legacy)) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      return (current = legacy);
    }
  } catch {
    // Private mode / storage disabled — fall through to language sniffing.
  }
  // No explicit choice yet: follow the browser. Most of Johanna's traffic is
  // Dominican, so an es-* browser should not have to hunt for the switch.
  const nav = navigator.language?.toLowerCase() ?? "";
  return (current = nav.startsWith("es") ? "es" : "en");
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function write(l: Locale) {
  current = l;
  try {
    localStorage.setItem(STORAGE_KEY, l);
  } catch {
    // Preference just won't persist; the session still switches.
  }
  listeners.forEach((fn) => fn());
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Server snapshot is always "en", matching the prerendered HTML, so the
  // first client render agrees and React can hydrate cleanly. The real
  // preference lands on the very next commit.
  const locale = useSyncExternalStore(subscribe, resolve, () => "en" as Locale);

  // Keep <html lang> honest — it drives screen-reader pronunciation and is
  // what search engines read for the page language.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => write(l), []);
  const t = useCallback((key: MessageKey) => MESSAGES[locale][key], [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used inside <LocaleProvider>");
  return ctx;
}
