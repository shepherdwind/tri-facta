import React from 'react';
import {
  Flex,
  Text,
  HStack,
  IconButton,
  Button,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, QuestionIcon } from '@chakra-ui/icons';
import { I18nIcon } from '../icons/I18nIcon';
import { useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExit }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  return (
    <Flex justify="space-between" align="center" py={2}>
      <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
        {t('game.title')}
      </Text>
      <HStack spacing={2}>
        <Tooltip label={i18n.language === 'en' ? '切换到中文' : 'Switch to English'}>
          <IconButton
            aria-label={i18n.language === 'en' ? 'Switch to Chinese' : 'Switch to English'}
            icon={<I18nIcon />}
            onClick={toggleLanguage}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        <Tooltip label={colorMode === 'light' ? t('header.darkMode') : t('header.lightMode')}>
          <IconButton
            aria-label={colorMode === 'light' ? t('header.darkMode') : t('header.lightMode')}
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        <Tooltip label={t('common.help')}>
          <IconButton
            aria-label={t('common.help')}
            icon={<QuestionIcon />}
            onClick={() => (window.location.href = '/help')}
            variant="ghost"
            size="sm"
          />
        </Tooltip>
        <Button variant="ghost" size="sm" onClick={onExit}>
          {t('common.exit')}
        </Button>
      </HStack>
    </Flex>
  );
};
