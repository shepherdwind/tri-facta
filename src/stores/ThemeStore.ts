import { makeAutoObservable } from 'mobx';

export type Theme = 'light' | 'dark';

export class ThemeStore {
  private static instance: ThemeStore | null = null;
  private theme: Theme;

  private constructor() {
    this.theme = this.getInitialTheme();
    makeAutoObservable(this);
  }

  public static getInstance(): ThemeStore {
    if (!ThemeStore.instance) {
      ThemeStore.instance = new ThemeStore();
    }
    return ThemeStore.instance;
  }

  private getInitialTheme(): Theme {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  get currentTheme(): Theme {
    return this.theme;
  }

  toggleTheme = () => {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
  };

  private applyTheme() {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(this.theme);
    }
  }
}
