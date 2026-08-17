import { useRouter } from './router';
import { findTool } from './catalog';
import { Header, Footer } from './layout';
import { Home } from './home';
import { ToolLayout } from './components';
import { toolComponents } from './registry';
import { StaticPage } from './pages';
import { I18nProvider, useI18n } from './i18n';
import { BackToTop } from './components/BackToTop';

function AppContent() {
  const { route, navigate } = useRouter();
  const { t } = useI18n();

  let content: React.ReactNode;
  if (route.name === 'home') {
    content = <Home navigate={navigate} />;
  } else if (route.name === 'page') {
    content = <StaticPage slug={route.slug} navigate={navigate} />;
  } else {
    const found = findTool(route.category, route.slug);
    if (found) {
      const Comp = toolComponents[found.tool.slug];
      content = (
        <ToolLayout category={found.category} tool={found.tool} navigate={navigate}>
          {Comp ? <Comp tool={found.tool} /> : <p className="text-slate-500">{t('tool.comingSoon')}</p>}
        </ToolLayout>
      );
    } else {
      content = (
        <div className="container-page py-16 sm:py-24 text-center px-4">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">{t('tool.notFound')}</h1>
          <button onClick={() => navigate({ name: 'home' })} className="btn-primary mt-6">{t('tool.notFoundBack')}</button>
        </div>
      );
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header navigate={navigate} />
      <main className="flex-1">{content}</main>
      <Footer navigate={navigate} />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
