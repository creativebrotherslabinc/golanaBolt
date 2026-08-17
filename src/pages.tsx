import { Mail, ShieldCheck, FileText } from 'lucide-react';
import type { Route } from './router';
import { useI18n } from './i18n';

export function StaticPage({ slug, navigate }: { slug: string; navigate: (r: Route) => void }) {
  const { tPage } = useI18n();

  if (slug === 'contact') return <Contact navigate={navigate} />;
  if (['terms', 'privacy', 'about'].includes(slug)) {
    const page = tPage(slug);
    return <DocPage title={page.title} body={page.body} icon={slug === 'privacy' ? ShieldCheck : FileText} />;
  }
  return <DocPage title={tPage('about').title} body="This page does not exist." icon={FileText} />;
}

function DocPage({ title, body, icon: Icon }: { title: string; body: string; icon: any }) {
  return (
    <div className="container-page py-10 sm:py-16 max-w-3xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shrink-0"><Icon className="h-5 w-5" /></div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{title}</h1>
      </div>
      <div className="prose prose-slate max-w-none space-y-4 text-slate-600 leading-relaxed text-sm sm:text-base">
        {body.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
}

function Contact({ navigate }: { navigate: (r: Route) => void }) {
  const { t } = useI18n();
  return (
    <div className="container-page py-10 sm:py-16 max-w-2xl text-center animate-fade-in">
      <div className="flex justify-center mb-6">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white"><Mail className="h-6 w-6 sm:h-7 sm:w-7" /></div>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{t('contact.title')}</h1>
      <p className="mt-4 text-sm sm:text-base text-slate-600 px-2">{t('contact.desc')}</p>
      <a href="mailto:hello@golana.online" className="btn-primary mt-8"><Mail className="h-4 w-4" /> hello@golana.online</a>
      <button onClick={() => navigate({ name: 'home' })} className="btn-ghost mt-3">{t('contact.back')}</button>
    </div>
  );
}
