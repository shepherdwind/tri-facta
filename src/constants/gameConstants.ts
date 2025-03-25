export enum GameMode {
  STANDARD = 'standard',
  ADVANCED = 'advanced',
}

export const GameConfig = {
  INITIAL_HAND_SIZE: 6,
  MAX_CARDS: 42,
  WILDCARDS_COUNT: 2,
  MAX_NUMBER_VALUE: 20,
  CARDS_PER_NUMBER: 2,
  CARDS_TO_MATCH: 3,
} as const;

export enum CardType {
  NUMBER = 'number',
  WILDCARD = 'wildcard',
}

export enum ActionType {
  START_GAME = 'START_GAME',
  PLACE_CARD = 'PLACE_CARD',
  COMMIT_CARDS = 'COMMIT_CARDS',
  REPLACE_CARDS = 'REPLACE_CARDS',
  DRAW_CARD = 'DRAW_CARD',
  END_TURN = 'END_TURN',
  END_GAME = 'END_GAME',
}
