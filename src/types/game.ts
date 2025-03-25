export type GameMode = 'addition' | 'multiplication';

export type CardType = 'number' | 'wildcard';

export interface Card {
  id: string;
  type: CardType;
  value: number;
  isWildcard: boolean;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  score: number;
}

export interface GameState {
  id: string;
  mode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  deck: Card[];
  placedCards: Card[];
  isGameStarted: boolean;
  isGameEnded: boolean;
  winner: string | null;
  lastAction: GameAction | null;
  createdAt: Date;
  updatedAt: Date;
}

export type GameAction =
  | { type: 'START_GAME'; payload: { mode: GameMode; players: Player[] } }
  | { type: 'PLACE_CARDS'; payload: { playerId: string; cards: Card[] } }
  | { type: 'REPLACE_CARDS'; payload: { playerId: string; oldCards: Card[]; newCards: Card[] } }
  | { type: 'DRAW_CARD'; payload: { playerId: string; card: Card } }
  | { type: 'END_TURN'; payload: { playerId: string } }
  | { type: 'END_GAME'; payload: { winnerId: string } };
