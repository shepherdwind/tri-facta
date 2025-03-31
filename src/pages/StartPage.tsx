import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
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
import { GamePage } from './GamePage';

export const StartPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.ADDITION);
  const [game, setGame] = useState<Game | null>(null);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const handleStartGame = () => {
    const player1 = new Player('player1', player1Name);
    const player2 = new Player('player2', player2Name);
    const newGame = new Game(selectedMode, [player1, player2]);
    newGame.start();
    setGame(newGame);
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en');
  };

  const handleExitGame = () => {
    setGame(null);
  };

  const handleHelpClick = () => {
    navigate('/help');
  };

  if (game) {
    return <GamePage game={game} onExit={handleExitGame} />;
  }

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Heading size="lg" color={primaryColor}>
            {t('header.title')}
          </Heading>
          <Stack direction="row" spacing={0}>
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
                onClick={handleHelpClick}
                variant="ghost"
                size="sm"
              />
            </Tooltip>
          </Stack>
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
            <Text>{t('game.instructionItems.wildcard')}</Text>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};
