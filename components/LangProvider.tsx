"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { LANG_STORAGE_KEY, UI, type Lang, type UIStrings } from "@/data/i18n";

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: UIStrings;
}

const LangContext = createContext<LangContextValue>({
  lang: "en",
  setLang: () => {},
  t: UI.en,
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Default is Burmese; a saved choice (below) overrides it.
  const [lang, setLangState] = useState<Lang>("my");

  // Read the saved choice after mount (localStorage is client-only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === "en" || saved === "my") setLangState(saved);
    } catch {
      /* private mode etc. — stay on the default */
    }
  }, []);

  // Keep <html lang> in sync so the Burmese line-height CSS applies.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, l);
    } catch {
      /* fail quietly */
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: UI[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): LangContextValue {
  return useContext(LangContext);
}

/** The small EN | မြန်မာ pill switch shown in page headers. */
export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex h-9 shrink-0 items-center rounded-full border border-gray2 bg-black p-0.5"
    >
      {(
        [
          ["en", "EN"],
          ["my", "မြန်မာ"],
        ] as const
      ).map(([code, label]) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(code)}
            className={`flex h-8 touch-manipulation items-center rounded-full px-3 text-[13px] font-semibold transition-colors duration-150 ${
              active ? "bg-white text-black" : "text-gray1 active:text-white"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
