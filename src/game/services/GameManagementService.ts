import { Game } from '../models/Game';
import { Player } from '../models/Player';
import { GameMode, GameState } from '../types';

export class GameManagementService {
  private games: Map<string, Game>;

  constructor() {
    this.games = new Map();
  }

  createGame(mode: GameMode, players: Player[]): Game {
    const game = new Game(mode, players);
    const gameId = this.generateGameId();
    this.games.set(gameId, game);
    return game;
  }

  startGame(gameId: string): void {
    const game = this.getGame(gameId);
    if (game.getState() !== GameState.INIT) {
      throw new Error('Game can only be started from INIT state');
    }
    game.start();
  }

  endGame(): void {
    // In this implementation, we don't need to do anything special to end the game
    // The game will naturally end when a player wins
  }

  saveGame(): void {
    // In this implementation, we don't need to do anything special to save the game
    // The game state is already maintained in memory
  }

  loadGame(gameId: string): Game {
    return this.getGame(gameId);
  }

  private getGame(gameId: string): Game {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error(`Game with ID ${gameId} not found`);
    }
    return game;
  }

  private generateGameId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}
