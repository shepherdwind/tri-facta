import React from 'react';
import { Box, Link, Text, useColorModeValue, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const version = import.meta.env.VITE_APP_VERSION;
  const toast = useToast();

  const handleClearCache = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }

        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));

        toast({
          title: t('footer.cacheCleared'),
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        // Reload the page to ensure clean state
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: t('footer.cacheClearError'),
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box as="footer" py={4} textAlign="center" marginBottom={8}>
      <Text color={textColor} fontSize="sm">
        {t('footer.sourceCode')}{' '}
        <Link
          href="https://github.com/shepherdwind/tri-facta"
          isExternal
          color="blue.500"
          _hover={{ color: 'blue.600' }}
        >
          GitHub
        </Link>
        {` · v${version}`}{' '}
        <Link
          as="button"
          onClick={handleClearCache}
          color="blue.500"
          _hover={{ color: 'blue.600' }}
          textDecoration="none"
        >
          {t('footer.clearCache')}
        </Link>
      </Text>
    </Box>
  );
};
