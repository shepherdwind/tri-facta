import React, { useState } from 'react';
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
import { Game } from '../game/models/Game';
import { Player } from '../game/models/Player';
import { GameStore } from '../stores/GameStore';

export const StartPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.ADDITION);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const textColor = useColorModeValue('brand.text', 'white');
  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const handleStartGame = () => {
    GameStore.reset();
    const player1 = new Player('player1', player1Name);
    const player2 = new Player('player2', player2Name);
    const game = new Game(selectedMode, [player1, player2]);
    GameStore.initialize(game);
    navigate('/game');
  };

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
          <HStack spacing={4}>
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
          <Logo size={200} gameMode={selectedMode} />
        </Box>

        {/* Game Settings */}
        <Box bg={cardBg}>
          <GameSettings
            player1Name={player1Name}
            player2Name={player2Name}
            selectedMode={selectedMode}
            onPlayer1NameChange={setPlayer1Name}
            onPlayer2NameChange={setPlayer2Name}
            onModeChange={setSelectedMode}
            onStartGame={handleStartGame}
          />
        </Box>

        {/* Game Instructions */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              {t('game.instructions.title')}
            </Text>
            <Text>{t('game.instructionItems.multiplayer')}</Text>
            <Text>{t('game.instructionItems.winCondition')}</Text>
            <Text>{t('game.instructionItems.dragAndDrop')}</Text>
            <Text>{t('game.instructionItems.clickToSelect')}</Text>
            <Text>{t('game.instructionItems.clickToDeselect')}</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
