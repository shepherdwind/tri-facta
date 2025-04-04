import { CardPosition, GameMode, GameState } from './index';

export interface CardJSON {
  value: number | null;
  isWildcard: boolean;
}

export interface PlayerJSON {
  id: string;
  name: string;
  hand: CardJSON[];
  isCurrentTurn: boolean;
  stagingArea: { position: CardPosition; card: CardJSON }[];
}

export interface DeckJSON {
  cards: CardJSON[];
  gameMode: GameMode;
}

export interface CardGroupStateJSON {
  topCard: CardJSON | null;
  bottomLeftCard: CardJSON | null;
  bottomRightCard: CardJSON | null;
  playerId: string | null;
}

export interface CardGroupJSON {
  workingArea: CardGroupStateJSON;
  committedState: CardGroupStateJSON;
  gameMode: GameMode;
}

export interface GameJSON {
  mode: GameMode;
  players: PlayerJSON[];
  deck: DeckJSON;
  currentPlayerIndex: number;
  cardGroup: CardGroupJSON;
  state: GameState;
}
