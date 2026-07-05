'use client';

import { useEffect, useState } from 'react';
import { getPreferences, savePreferences } from '@/lib/storage';

export function DarkModeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prefs = getPreferences();
    setTheme(prefs.theme);
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    const prefs = getPreferences();
    prefs.theme = newTheme;
    savePreferences(prefs);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleThemeChange('light')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === 'light'
            ? 'bg-amber-100 text-amber-900'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
        }`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === 'dark'
            ? 'bg-slate-700 text-slate-100'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
        }`}
      >
        🌙 Dark
      </button>
      <button
        onClick={() => handleThemeChange('system')}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          theme === 'system'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
        }`}
      >
        🖥️ System
      </button>
    </div>
  );
}
