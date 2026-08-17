import { useEffect, useState, useCallback } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'tool'; category: string; slug: string }
  | { name: 'page'; slug: string };

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash) return { name: 'home' };
  const parts = hash.split('/');
  if (parts[0] === 'tool' && parts[1] && parts[2]) {
    return { name: 'tool', category: parts[1], slug: parts[2] };
  }
  if (parts[0] === 'page' && parts[1]) {
    return { name: 'page', slug: parts[1] };
  }
  return { name: 'home' };
}

function toHash(route: Route): string {
  if (route.name === 'home') return '#/';
  if (route.name === 'tool') return `#/tool/${route.category}/${route.slug}`;
  return `#/page/${route.slug}`;
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#cat-')) return;
      setRoute(parseHash());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = toHash(r);
  }, []);

  return { route, navigate };
}

export function routeToHash(route: Route): string {
  return toHash(route);
}
