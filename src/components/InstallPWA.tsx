import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const PWA_INSTALL_DISMISSED_KEY = 'pwa_install_dismissed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const dismissed = localStorage.getItem(PWA_INSTALL_DISMISSED_KEY) === 'true';
    setIsDismissed(dismissed);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, 'true');
      setIsDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDeferredPrompt(null);
    localStorage.setItem(PWA_INSTALL_DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  if (!deferredPrompt || isDismissed) return null;

  return (
    <Alert
      status="info"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="auto"
      p={4}
      bg={bgColor}
      borderRadius="md"
      boxShadow="md"
    >
      <AlertIcon />
      <AlertTitle mr={2}>{t('pwa.installTitle')}</AlertTitle>
      <AlertDescription mb={4}>{t('pwa.installDescription')}</AlertDescription>
      <HStack spacing={4}>
        <Button colorScheme="blue" onClick={handleInstallClick}>
          {t('pwa.install')}
        </Button>
        <Button variant="ghost" onClick={handleDismiss}>
          {t('common.cancel')}
        </Button>
      </HStack>
    </Alert>
  );
};
