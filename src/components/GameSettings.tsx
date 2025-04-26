import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameMode } from '../game/types';
import { Game } from '../game/models/Game';
import { Player } from '../game/models/Player';
import { GameStatePersistence } from '../stores/persistence/GameStatePersistence';
import { GameStore } from '../stores/GameStore';
import { Combobox } from '@headlessui/react';
import { router } from '../router';

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
    router.navigate('/game');
    onGameStart?.();
  };

  const handleRestoreGame = () => {
    router.navigate('/game');
    onGameStart?.();
  };

  return (
    <div className="space-y-6">
      {/* Player Names */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1">
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('game.player1')}
          </label>
          <Combobox value={player1Name} onChange={setPlayer1Name}>
            <div className="relative">
              <Combobox.Input
                className="w-full px-4 py-2 text-lg border-2 border-gray-400 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:bg-gray-800 dark:text-white"
                placeholder={t('game.player1')}
                displayValue={(name: string) => name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPlayer1Name(e.target.value)
                }
              />
            </div>
          </Combobox>
        </div>
        <div className="flex-1">
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('game.player2')}
          </label>
          <Combobox value={player2Name} onChange={setPlayer2Name}>
            <div className="relative">
              <Combobox.Input
                className="w-full px-4 py-2 text-lg border-2 border-gray-400 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:bg-gray-800 dark:text-white"
                placeholder={t('game.player2')}
                displayValue={(name: string) => name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPlayer2Name(e.target.value)
                }
              />
            </div>
          </Combobox>
        </div>
      </div>

      {/* Game Mode Selection */}
      <div>
        <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('game.modeSelection')}
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="gameMode"
              value={GameMode.ADDITION}
              checked={selectedMode === GameMode.ADDITION}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedMode(e.target.value as GameMode)
              }
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-400"
            />
            <span className="text-lg text-gray-700 dark:text-gray-300">
              {t('game.modes.addition')}
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="gameMode"
              value={GameMode.MULTIPLICATION}
              checked={selectedMode === GameMode.MULTIPLICATION}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSelectedMode(e.target.value as GameMode)
              }
              className="w-5 h-5 text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:focus:ring-blue-400"
            />
            <span className="text-lg text-gray-700 dark:text-gray-300">
              {t('game.modes.multiplication')}
            </span>
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <button
          onClick={handleStartGame}
          className="w-full md:w-[200px] px-4 py-2 text-lg font-medium text-white bg-blue-600 dark:bg-blue-700 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {t('common.start')}
        </button>
        {hasSavedGame && (
          <button
            onClick={handleRestoreGame}
            className="w-full md:w-[200px] px-4 py-2 text-lg font-medium text-white bg-green-600 dark:bg-green-700 rounded-md hover:bg-green-700 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {t('game.restore')}
          </button>
        )}
      </div>
    </div>
  );
};
