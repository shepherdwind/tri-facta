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

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { t } = useTranslation();
  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
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
    }
  };

  if (!deferredPrompt) return null;

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
        <Button variant="ghost" onClick={() => setDeferredPrompt(null)}>
          {t('common.cancel')}
        </Button>
      </HStack>
    </Alert>
  );
};
