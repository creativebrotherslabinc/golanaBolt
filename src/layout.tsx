import { useState, useRef, useEffect } from 'react';
import { Menu, X, Heart, ChevronDown, Grid3x3 } from 'lucide-react';
import { routeToHash, type Route } from './router';
import { categories } from './catalog';
import { useI18n } from './i18n';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';

export function Header({
  navigate,
}: {
  navigate: (r: Route) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const { t, tCat } = useI18n();
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate({ name: 'home' });
            }}
            className="flex items-center gap-2 shrink-0"
          >
            <img src="/icon.png" alt="Go LANA" className="h-9 w-9 rounded-xl shadow-md object-cover" />
            <div className="leading-tight hidden xs:block sm:block">
              <p className="font-display text-base font-bold text-slate-900">{t('site.name')}</p>
              <p className="-mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">{t('site.tagline')}</p>
            </div>
          </a>

          <div className="flex items-center gap-2">
            {/* Categories dropdown */}
            <div ref={catRef} className="relative hidden sm:block">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Grid3x3 className="h-4 w-4 shrink-0" />
                <span>{t('nav.categories')}</span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>
              {catOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-slate-100 animate-pop z-50 max-h-[75vh] overflow-y-auto">
                  {categories.map((c) => {
                    const ct = tCat(c.id);
                    return (
                      <a
                        key={c.id}
                        href={`#cat-${c.id}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-start gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${c.accent} text-white shrink-0 mt-0.5`}>
                          <c.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="whitespace-normal leading-tight font-medium">{ct.title}</p>
                          <p className="whitespace-normal leading-tight text-xs text-slate-400 mt-0.5">{ct.subtitle}</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <LanguageSelector />
            <ThemeToggle />

            {/* Mobile hamburger — includes categories + pages */}
            <button onClick={() => setMenuOpen(true)} className="sm:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-100 transition" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden animate-fade-in-fast" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeMenu} />
          <div className="absolute right-0 top-0 h-full w-[80%] max-w-xs bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 h-16 shrink-0">
              <a
                href="#/"
                onClick={(e) => { e.preventDefault(); navigate({ name: 'home' }); closeMenu(); }}
                className="flex items-center gap-2"
              >
                <img src="/icon.png" alt="Go LANA" className="h-8 w-8 rounded-lg object-cover" />
                <span className="font-display text-base font-bold text-slate-900">{t('site.name')}</span>
              </a>
              <button onClick={closeMenu} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{t('nav.categories')}</p>
              {categories.map((c) => {
                const ct = tCat(c.id);
                return (
                  <a
                    key={c.id}
                    href={`#cat-${c.id}`}
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700 transition"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${c.accent} text-white shrink-0`}>
                      <c.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                    <p className="whitespace-normal leading-tight font-medium">{ct.title}</p>
                    <p className="whitespace-normal leading-tight text-xs text-slate-400 mt-0.5">{ct.subtitle}</p>
                  </div>
                  </a>
                );
              })}
            </nav>
            <div className="border-t border-slate-100 p-3 shrink-0 space-y-3">
              <div className="flex items-center justify-between px-3 py-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t('nav.colorMode')}</span>
                <ThemeToggle />
              </div>
              <a href={routeToHash({ name: 'page', slug: 'terms' })} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition">{t('nav.terms')}</a>
              <a href={routeToHash({ name: 'page', slug: 'privacy' })} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition">{t('nav.privacy')}</a>
              <a href={routeToHash({ name: 'page', slug: 'contact' })} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition">{t('nav.contact')}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer({ navigate }: { navigate: (r: Route) => void }) {
  const { t } = useI18n();
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <a href="#/" className="flex items-center gap-2">
            <img src="/icon.png" alt="Go LANA" className="h-8 w-8 rounded-lg object-cover" />
            <div className="leading-tight">
              <p className="font-display text-sm font-bold text-slate-900">{t('site.name')}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">{t('footer.tagline')}</p>
            </div>
          </a>
          <nav className="flex items-center gap-5 text-sm text-slate-500">
            <a href={routeToHash({ name: 'page', slug: 'terms' })} className="hover:text-slate-900 transition">{t('nav.terms')}</a>
            <a href={routeToHash({ name: 'page', slug: 'privacy' })} className="hover:text-slate-900 transition">{t('nav.privacy')}</a>
            <a href={routeToHash({ name: 'page', slug: 'contact' })} className="hover:text-slate-900 transition">{t('nav.contact')}</a>
          </nav>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400">
          <p>{t('footer.copyright')}</p>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.built')} <Heart className="h-3.5 w-3.5 text-rose-400 fill-rose-400" /> {t('footer.forEveryone')}
          </p>
        </div>
      </div>
    </footer>
  );
}
