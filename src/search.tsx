import { useMemo, useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { categories, allTools } from './catalog';
import { routeToHash } from './router';
import { useI18n } from './i18n';

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const { t, tTool, tCat, lang } = useI18n();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return allTools
      .filter((tool) => {
        const tt = tTool(tool.slug);
        const cat = categories.find((c) => c.id === tool.category);
        const ct = cat ? tCat(cat.id) : { title: '', subtitle: '' };
        return (
          tt.name.toLowerCase().includes(query) ||
          tt.description.toLowerCase().includes(query) ||
          ct.title.toLowerCase().includes(query) ||
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
        );
      })
      .slice(0, 12);
  }, [q, tTool, tCat, lang]);

  return (
    <div className="fixed inset-0 z-50 animate-fade-in-fast" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative mx-auto mt-[8vh] sm:mt-[10vh] w-full max-w-xl px-4">
        <div className="card overflow-hidden p-0 animate-pop">
          <div className="flex items-center gap-3 border-b border-slate-100 px-4">
            <Search className="h-5 w-5 text-slate-400 shrink-0" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search.placeholder')}
              className="w-full bg-transparent py-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
            />
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 shrink-0">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-h-[55vh] overflow-y-auto p-2">
            {q && results.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-slate-500">{t('search.empty').replace('{q}', q)}</p>
            )}
            {!q && (
              <p className="px-3 py-8 text-center text-sm text-slate-400">
                {t('search.hint').replace('{n}', String(allTools.length))}
              </p>
            )}
            {results.map((tl) => {
              const tt = tTool(tl.slug);
              const cat = categories.find((c) => c.id === tl.category);
              const ct = cat ? tCat(cat.id) : { title: '', subtitle: '' };
              return (
                <a
                  key={`${tl.category}-${tl.slug}`}
                  href={routeToHash({ name: 'tool', category: tl.category, slug: tl.slug })}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-brand-50 transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 shrink-0">
                    <tl.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">{tt.name}</p>
                    <p className="truncate text-xs text-slate-500">{tt.description}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 hidden sm:inline shrink-0">
                    {ct.title.replace(' Tools', '').replace(' Werkzeuge', '').replace(' Ferramentas', '').replace(' Herramientas', '')}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SearchButton({ onClick }: { onClick: () => void }) {
  const { t } = useI18n();
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-500 ring-1 ring-inset ring-slate-200 hover:ring-slate-300 hover:text-slate-700 transition w-full sm:w-56"
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">{t('search.button')}</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
        /
      </kbd>
    </button>
  );
}

export function HeroSearch() {
  const [q, setQ] = useState('');
  const { t, tTool, tCat, lang } = useI18n();

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return allTools
      .filter((tool) => {
        const tt = tTool(tool.slug);
        const cat = categories.find((c) => c.id === tool.category);
        const ct = cat ? tCat(cat.id) : { title: '', subtitle: '' };
        return (
          tt.name.toLowerCase().includes(query) ||
          tt.description.toLowerCase().includes(query) ||
          ct.title.toLowerCase().includes(query) ||
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [q, tTool, tCat, lang]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="relative">
        <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('hero.search.placeholder')}
          className="w-full rounded-2xl border-0 bg-white py-4 pl-12 pr-4 text-base shadow-lg shadow-brand-500/5 ring-1 ring-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100 animate-pop">
          {results.map((tl) => {
            const tt = tTool(tl.slug);
            return (
              <a
                key={`${tl.category}-${tl.slug}`}
                href={routeToHash({ name: 'tool', category: tl.category, slug: tl.slug })}
                onClick={() => setQ('')}
                className="flex items-center gap-3 px-4 py-3 hover:bg-brand-50 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <tl.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{tt.name}</p>
                  <p className="truncate text-xs text-slate-500">{tt.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
