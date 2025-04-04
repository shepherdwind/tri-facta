import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, QuestionIcon } from '@chakra-ui/icons';
import { I18nIcon } from '../components/icons/I18nIcon';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { GameSettings } from '../components/GameSettings';
import { GameMode } from '../game/types';

export const StartPage: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('brand.text', 'white');
  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="xl" color={primaryColor}>
            tri-FACTa!™
          </Heading>
          <HStack spacing={0}>
            <Tooltip label={t('common.toggleTheme')}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                size="lg"
              />
            </Tooltip>
            <Tooltip label={t('common.toggleLanguage')}>
              <IconButton
                aria-label="Toggle language"
                icon={<I18nIcon />}
                onClick={toggleLanguage}
                variant="ghost"
                size="lg"
              />
            </Tooltip>
            <Tooltip label={t('common.help')}>
              <IconButton
                aria-label="Help"
                icon={<QuestionIcon />}
                onClick={handleHelpClick}
                variant="ghost"
                size="lg"
              />
            </Tooltip>
          </HStack>
        </Flex>

        {/* Game Title */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            {t('game.title')}
          </Heading>
          <Text fontSize="xl" color={textColor}>
            {t('game.subtitle')}
          </Text>
        </Box>
        {/* Game Logo */}
        <Box bg={cardBg} borderRadius="lg" boxShadow="lg" textAlign="center">
          <Logo size={200} gameMode={GameMode.ADDITION} />
        </Box>

        {/* Game Settings */}
        <Box bg={cardBg}>
          <GameSettings />
        </Box>

        {/* Game Instructions */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              {t('game.instructions.title')}
            </Text>
            <Text>{t('game.instructionItems.winCondition')}</Text>
            <Text>{t('game.instructionItems.dragAndDrop')}</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
