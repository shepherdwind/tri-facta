import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ToastProvider';

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const version = import.meta.env.VITE_APP_VERSION;
  const { showToast } = useToast();
  const [showClearCache, setShowClearCache] = useState(false);

  useEffect(() => {
    const checkPWAAndCache = async () => {
      // Check if running in PWA mode
      const isPWA =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as NavigatorStandalone).standalone ||
        document.referrer.includes('android-app://');

      if (isPWA) {
        // Check if there are any caches
        const cacheNames = await caches.keys();
        setShowClearCache(cacheNames.length > 0);
      } else {
        setShowClearCache(false);
      }
    };

    checkPWAAndCache();
  }, []);

  const handleClearCache = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }

        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

        showToast({
          title: t('footer.cacheCleared'),
          description: t('footer.cacheCleared'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Reload the page to ensure clean state
        window.location.reload();
      }
    } catch (error) {
      showToast({
        title: t('footer.cacheClearError'),
        description: t('footer.cacheClearError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <footer className="py-4 text-center mb-8">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {t('footer.sourceCode')}{' '}
        <a
          href="https://github.com/shepherdwind/tri-facta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-600"
        >
          GitHub
        </a>
        {` · v${version}`}
        {showClearCache && (
          <>
            {' · '}
            <button onClick={handleClearCache} className="text-blue-500 hover:text-blue-600">
              {t('footer.clearCache')}
            </button>
          </>
        )}
      </p>
    </footer>
  );
};
