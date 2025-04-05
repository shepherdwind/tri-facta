import { useEffect } from 'react';
import { ThemeStore } from '../stores/ThemeStore';

export function useTheme() {
  const themeStore = ThemeStore.getInstance();
  const theme = themeStore.currentTheme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return {
    theme,
    toggleTheme: themeStore.toggleTheme,
  };
}
