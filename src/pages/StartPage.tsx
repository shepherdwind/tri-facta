import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useColorMode,
  useColorModeValue,
  IconButton,
  Select,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useTranslation } from 'react-i18next';
import { Logo } from '../components/Logo';
import { GameMode } from '../game/types';

export const StartPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.ADDITION);
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const handleStartGame = () => {
    // TODO: Implement game start logic
    console.log('Starting game in mode:', selectedMode);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg" color={primaryColor}>
            {t('header.title')}
          </Heading>
          <Stack direction="row" spacing={4}>
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
            <Button variant="ghost">{t('common.help')}</Button>
            <Button variant="ghost">{t('common.settings')}</Button>
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

        {/* Game Mode Selection */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              {t('game.modeSelection')}
            </Text>
            <Stack direction="row" spacing={4}>
              <Button
                colorScheme={selectedMode === GameMode.ADDITION ? 'blue' : 'gray'}
                onClick={() => setSelectedMode(GameMode.ADDITION)}
                size="lg"
              >
                {t('game.additionMode')}
              </Button>
              <Button
                colorScheme={selectedMode === GameMode.MULTIPLICATION ? 'blue' : 'gray'}
                onClick={() => setSelectedMode(GameMode.MULTIPLICATION)}
                size="lg"
              >
                {t('game.multiplicationMode')}
              </Button>
            </Stack>
          </VStack>
        </Box>

        {/* Game Instructions */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              {t('game.instructions')}
            </Text>
            <Text>{t('game.instructionItems.multiplayer')}</Text>
            <Text>{t('game.instructionItems.winCondition')}</Text>
            <Text>{t('game.instructionItems.wildcard')}</Text>
          </VStack>
        </Box>

        {/* Start Button */}
        <Box textAlign="center">
          <Button colorScheme="blue" size="lg" width="200px" onClick={handleStartGame}>
            {t('common.startGame')}
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
