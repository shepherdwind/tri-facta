import React from 'react';
import { Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface ErrorAlertProps {
  message: string | null;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => {
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <Alert status="error" borderRadius="md">
      <AlertIcon />
      <AlertTitle>{t('game.error')}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
