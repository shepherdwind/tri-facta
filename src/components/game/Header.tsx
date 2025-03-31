import React from 'react';
import {
  Flex,
  Text,
  HStack,
  Select,
  IconButton,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useColorMode } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  onExit: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExit }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Flex justify="space-between" align="center">
      <Text fontSize="xl" fontWeight="bold" color={primaryColor}>
        {t('game.title')}
      </Text>
      <HStack spacing={4}>
        <Select size="sm" width="100px" value={i18n.language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="zh">中文</option>
        </Select>
        <IconButton
          aria-label={colorMode === 'light' ? t('header.darkMode') : t('header.lightMode')}
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
        />
        <Button variant="ghost" onClick={onExit}>
          {t('common.exit')}
        </Button>
      </HStack>
    </Flex>
  );
};
