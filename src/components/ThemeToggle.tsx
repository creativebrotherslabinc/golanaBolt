import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'golana-theme';

function getInitial(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
  } catch { /* ignore */ }
  return 'light';
}

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    apply(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch { /* ignore */ }
  }, [theme]);

  return (
    <div
      className="inline-flex items-center gap-0.5 rounded-lg bg-slate-50 p-0.5 ring-1 ring-inset ring-slate-200"
      role="group"
      aria-label="Color mode"
    >
      <button
        onClick={() => setTheme('light')}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm transition ${
          theme === 'light'
            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-label="Standard color mode"
        aria-pressed={theme === 'light'}
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-sm transition ${
          theme === 'dark'
            ? 'bg-white text-brand-600 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-label="Dark mode"
        aria-pressed={theme === 'dark'}
      >
        <Moon className="h-4 w-4" />
      </button>
    </div>
  );
}
