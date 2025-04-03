import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  VStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { GameMode } from '../game/types';
import { Game } from '../game/models/Game';
import { Player } from '../game/models/Player';
import { GameStatePersistence } from '../stores/persistence/GameStatePersistence';
import { GameStore } from '../stores/GameStore';

const PLAYER_NAMES_STORAGE_KEY = 'player_names';

interface PlayerNames {
  player1: string;
  player2: string;
}

interface GameSettingsProps {
  onGameStart?: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({ onGameStart }) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>(GameMode.ADDITION);
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved game state
    const gameStatePersistence = GameStatePersistence.getInstance();
    const storedState = gameStatePersistence.loadState();
    setHasSavedGame(!!storedState);

    // Load saved player names
    const savedNames = localStorage.getItem(PLAYER_NAMES_STORAGE_KEY);
    if (savedNames) {
      try {
        const { player1, player2 } = JSON.parse(savedNames) as PlayerNames;
        setPlayer1Name(player1);
        setPlayer2Name(player2);
      } catch (error) {
        console.error('Failed to parse saved player names:', error);
      }
    }
  }, []);

  const savePlayerNames = (player1: string, player2: string) => {
    const names: PlayerNames = { player1, player2 };
    localStorage.setItem(PLAYER_NAMES_STORAGE_KEY, JSON.stringify(names));
  };

  const handleStartGame = () => {
    GameStore.reset();
    const player1 = new Player('player1', player1Name);
    const player2 = new Player('player2', player2Name);
    const game = new Game(selectedMode, [player1, player2]);
    GameStore.initialize(game);
    savePlayerNames(player1Name, player2Name);
    navigate('/game');
    onGameStart?.();
  };

  const handleRestoreGame = () => {
    navigate('/game');
    onGameStart?.();
  };

  return (
    <Box p={6} borderRadius="lg" boxShadow="lg">
      <VStack spacing={6}>
        {/* Player Names */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
          <FormControl>
            <FormLabel>{t('game.player1')}</FormLabel>
            <Input
              value={player1Name}
              onChange={(e) => setPlayer1Name(e.target.value)}
              placeholder={t('game.player1')}
              size="lg"
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('game.player2')}</FormLabel>
            <Input
              value={player2Name}
              onChange={(e) => setPlayer2Name(e.target.value)}
              placeholder={t('game.player2')}
              size="lg"
            />
          </FormControl>
        </Stack>

        {/* Game Mode Selection */}
        <FormControl>
          <FormLabel>{t('game.modeSelection')}</FormLabel>
          <RadioGroup
            value={selectedMode}
            onChange={(value) => setSelectedMode(value as GameMode)}
            size="lg"
          >
            <Stack direction={{ base: 'column', md: 'row' }} spacing={4}>
              <Radio value={GameMode.ADDITION} size="lg">
                {t('game.modes.addition')}
              </Radio>
              <Radio value={GameMode.MULTIPLICATION} size="lg">
                {t('game.modes.multiplication')}
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        {/* Action Buttons */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
          <Button
            colorScheme="blue"
            size="lg"
            width={{ base: '100%', md: '200px' }}
            onClick={handleStartGame}
          >
            {t('common.start')}
          </Button>
          {hasSavedGame && (
            <Button
              colorScheme="green"
              size="lg"
              width={{ base: '100%', md: '200px' }}
              onClick={handleRestoreGame}
            >
              {t('game.restore')}
            </Button>
          )}
        </Stack>
      </VStack>
    </Box>
  );
};
