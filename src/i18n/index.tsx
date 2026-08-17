import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type Language = 'en' | 'pt' | 'es' | 'de';

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português (BR)', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

import { en } from './en';
import { pt } from './pt';
import { es } from './es';
import { de } from './de';

export type Translation = typeof en;
const translations: Record<Language, Translation> = { en, pt, es, de };

interface I18nContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  tCat: (catId: string) => { title: string; subtitle: string };
  tTool: (slug: string) => { name: string; description: string };
  tPage: (slug: string) => { title: string; body: string };
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'golana-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (saved && ['en', 'pt', 'es', 'de'].includes(saved)) return saved;
    } catch { /* ignore */ }
    return 'en';
  });

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key: string) => {
    const tr = translations[lang];
    return (tr.ui as Record<string, string>)[key] ?? translations.en.ui[key] ?? key;
  }, [lang]);

  const tCat = useCallback((catId: string) => {
    const tr = translations[lang];
    return tr.categories[catId] ?? translations.en.categories[catId] ?? { title: catId, subtitle: '' };
  }, [lang]);

  const tTool = useCallback((slug: string) => {
    const tr = translations[lang];
    return tr.tools[slug] ?? translations.en.tools[slug] ?? { name: slug, description: '' };
  }, [lang]);

  const tPage = useCallback((slug: string) => {
    const tr = translations[lang];
    return tr.pages[slug] ?? translations.en.pages[slug] ?? { title: slug, body: '' };
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, tCat, tTool, tPage }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export function useT<T extends Record<string, string>>(strings: Record<Language, T>): T {
  const ctx = useContext(I18nContext);
  const lang = ctx?.lang ?? 'en';
  return (strings[lang] ?? strings.en) as T;
}
