import { useEffect, useState } from 'react';

import { Switch } from '../ui/Switch';

type Theme = 'light' | 'dark';

// Keep in sync with the script in index.html, which applies the theme before
// first paint so a dark-mode user doesn't see a white flash.
const STORAGE_KEY = 'theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

// localStorage can throw (private windows, blocked storage), so every access
// is wrapped: without storage the toggle still works, it just isn't remembered.
function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/**
 * Light / Dark switch for the footer.
 * - No saved choice: follows the browser's prefers-color-scheme, live.
 * - Once the user flips it: that choice is saved and wins, even after refresh.
 * The theme itself is just `data-theme` on <html>; index.css does the rest.
 */
export function ThemeToggle() {
  const [storedTheme, setStoredTheme] = useState<Theme | null>(readStoredTheme);
  const [systemTheme, setSystemTheme] = useState<Theme>(() =>
    window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light',
  );
  const theme = storedTheme ?? systemTheme;

  // Follow the OS setting while it changes (only matters with no saved choice).
  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY);
    const onChange = () => setSystemTheme(query.matches ? 'dark' : 'light');
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // Apply it.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function choose(dark: boolean) {
    const next: Theme = dark ? 'dark' : 'light';
    setStoredTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not saved; still applied for this visit.
    }
  }

  return (
    <Switch label="Dark mode" offLabel="Light" onLabel="Dark" checked={theme === 'dark'} onChange={choose} />
  );
}
