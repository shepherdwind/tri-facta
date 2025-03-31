import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  VStack,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { GameMode } from '../game/types';

interface GameSettingsProps {
  player1Name: string;
  player2Name: string;
  selectedMode: GameMode;
  onPlayer1NameChange: (name: string) => void;
  onPlayer2NameChange: (name: string) => void;
  onModeChange: (mode: GameMode) => void;
  onStartGame: () => void;
}

export const GameSettings: React.FC<GameSettingsProps> = ({
  player1Name,
  player2Name,
  selectedMode,
  onPlayer1NameChange,
  onPlayer2NameChange,
  onModeChange,
  onStartGame,
}) => {
  const { t } = useTranslation();

  return (
    <Box p={6} borderRadius="lg" boxShadow="lg">
      <VStack spacing={6}>
        {/* Player Names */}
        <Stack direction={{ base: 'column', md: 'row' }} spacing={4} width="100%">
          <FormControl>
            <FormLabel>{t('game.player1')}</FormLabel>
            <Input
              value={player1Name}
              onChange={(e) => onPlayer1NameChange(e.target.value)}
              placeholder={t('game.player1')}
              size="lg"
            />
          </FormControl>
          <FormControl>
            <FormLabel>{t('game.player2')}</FormLabel>
            <Input
              value={player2Name}
              onChange={(e) => onPlayer2NameChange(e.target.value)}
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
            onChange={(value) => onModeChange(value as GameMode)}
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

        {/* Start Button */}
        <Button
          colorScheme="blue"
          size="lg"
          width={{ base: '100%', md: '200px' }}
          onClick={onStartGame}
        >
          {t('common.start')}
        </Button>
      </VStack>
    </Box>
  );
};
