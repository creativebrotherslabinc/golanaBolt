import { Sparkles, ShieldCheck, Zap, Heart } from 'lucide-react';
import { categories } from './catalog';
import { ToolCard } from './components';
import { HeroSearch } from './search';
import type { Route } from './router';
import { useI18n } from './i18n';

export function Home({ navigate }: { navigate: (r: Route) => void }) {
  const { t, tCat } = useI18n();
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-72 w-[42rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute top-32 right-4 sm:right-10 h-48 w-72 sm:w-96 rounded-full bg-accent-200/30 blur-3xl" />
        </div>
        <div className="container-page py-14 sm:py-20 lg:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-100 shadow-sm mb-6 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            {t('site.library')}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-slate-900 px-2">
            {t('hero.title')}
            <span className="block bg-gradient-to-r from-brand-600 to-accent-600 bg-clip-text text-transparent">
              {t('hero.subtitle')}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-slate-600 px-2">
            {t('hero.desc')}
          </p>
          <div className="mt-8">
            <HeroSearch />
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent-600" /> {t('badge.private')}</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-500" /> {t('badge.instant')}</span>
            <span className="inline-flex items-center gap-1.5"><Heart className="h-4 w-4 text-rose-500" /> {t('badge.free')}</span>
          </div>
        </div>
      </section>

      {/* Category quick nav */}
      <div className="container-page -mt-4 sm:-mt-6 mb-2 relative z-10">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
          {categories.map((c, idx) => {
            const ct = tCat(c.id);
            const short = ct.title.replace(' Tools', '').replace(' Tool', '').replace(' Werkzeuge', '').replace(' Ferramentas', '').replace(' Herramientas', '').replace(' & ', '&');
            return (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="group relative inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-2.5 pr-3 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-slate-300 whitespace-nowrap"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${c.accent} text-white shadow-sm transition-transform duration-200 group-hover:scale-110`}>
                  <c.icon className="h-3.5 w-3.5 shrink-0" />
                </span>
                <span className="hidden sm:inline">{ct.title}</span>
                <span className="sm:hidden">{short}</span>
                <span className="ml-0.5 inline-flex h-4.5 min-w-[1.1rem] items-center justify-center rounded-full bg-slate-100 px-1 text-[10px] font-semibold tabular-nums text-slate-500 transition-colors duration-200 group-hover:bg-slate-200 group-hover:text-slate-700">
                  {c.tools.length}
                </span>
                <span className="sr-only">— {idx + 1} of {categories.length}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Tool sections */}
      <div className="container-page py-10 sm:py-12 space-y-12 sm:space-y-16">
        {categories.map((cat) => {
          const ct = tCat(cat.id);
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-20 sm:scroll-mt-24">
              <div className="flex items-center gap-3 mb-5 sm:mb-6">
                <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.accent} text-white shadow-md shrink-0`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 truncate">{ct.title}</h2>
                  <p className="text-xs sm:text-sm text-slate-500">{ct.subtitle}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {cat.tools.map((tl) => (
                  <ToolCard key={tl.slug} tool={tl} categoryId={cat.id} accent={cat.accent} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* CTA footer block */}
      <section className="border-t border-slate-100 bg-white">
        <div className="container-page py-12 sm:py-14 text-center">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">{t('cta.title')}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-slate-600 px-2">
            {t('cta.desc')}
          </p>
          <button onClick={() => navigate({ name: 'page', slug: 'about' })} className="btn-secondary mt-6">
            {t('cta.learnMore')}
          </button>
        </div>
      </section>
    </div>
  );
}
