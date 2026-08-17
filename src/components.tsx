import { type ReactNode } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Category, Tool } from './catalog';
import { routeToHash, type Route } from './router';
import { useI18n } from './i18n';

interface ToolLayoutProps {
  category: Category;
  tool: Tool;
  children: ReactNode;
  navigate: (r: Route) => void;
}

export function ToolLayout({ category, tool, children, navigate }: ToolLayoutProps) {
  const { t, tCat, tTool } = useI18n();
  const Icon = tool.icon;
  const tt = tTool(tool.slug);
  const ct = tCat(category.id);
  return (
    <div className="container-page py-6 sm:py-8 lg:py-10 animate-fade-in">
      <button
        onClick={() => navigate({ name: 'home' })}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-5 sm:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('tool.back')}
      </button>

      <header className="flex items-start gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className={`flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${category.accent} text-white shadow-lg shadow-slate-200`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
            {tt.name}
          </h1>
          <p className="mt-1 text-slate-500 text-sm sm:text-base">{tt.description}</p>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className={`inline-block h-2 w-2 rounded-full bg-gradient-to-br ${category.accent}`} />
            {ct.title}
          </p>
        </div>
      </header>

      <div className="card p-4 sm:p-6 lg:p-8">{children}</div>

      <p className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
        <ExternalLink className="h-3.5 w-3.5" />
        {t('tool.localNote')}
      </p>
    </div>
  );
}

export function ToolCard({
  tool,
  categoryId,
  accent,
}: {
  tool: Tool;
  categoryId: string;
  accent: string;
}) {
  const { tTool } = useI18n();
  const Icon = tool.icon;
  const tt = tTool(tool.slug);
  const href = routeToHash({ name: 'tool', category: categoryId, slug: tool.slug });
  return (
    <a
      href={href}
      className="card group p-4 hover:shadow-cardHover hover:-translate-y-0.5 hover:ring-brand-200"
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-sm transition-transform group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-800 group-hover:text-brand-700">
            {tt.name}
          </h3>
          <p className="truncate text-xs text-slate-500">{tt.description}</p>
        </div>
      </div>
    </a>
  );
}
