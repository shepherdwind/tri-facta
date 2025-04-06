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
    if (typeof window === 'undefined') {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(this.theme);

    // Update theme-color meta tag for Android
    const themeColor = this.theme === 'dark' ? '#111827' : '#F9FAFB';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    }

    // Update apple-mobile-web-app-status-bar-style for iOS
    const metaAppleStatusBar = document.querySelector(
      'meta[name="apple-mobile-web-app-status-bar-style"]'
    );
    if (metaAppleStatusBar) {
      metaAppleStatusBar.setAttribute(
        'content',
        this.theme === 'dark' ? 'black-translucent' : 'default'
      );
    }
  }
}
