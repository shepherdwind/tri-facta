import { Card } from './Card';
import { CardGroup } from './CardGroup';
import { Deck } from './Deck';
import { Player } from './Player';
import { GameMode, GameState, GameEvent, CardPosition } from '../types';

export class Game {
  private mode: GameMode;
  private players: Player[];
  private deck: Deck;
  private currentPlayerIndex: number;
  private cardGroup: CardGroup;
  private state: GameState;
  private isFirstTurn: boolean;
  private eventListeners: ((event: GameEvent) => void)[];

  constructor(mode: GameMode, players: Player[]) {
    if (players.length < 2) {
      throw new Error('Game must have at least 2 players');
    }
    this.mode = mode;
    this.players = players;
    this.deck = new Deck();
    this.currentPlayerIndex = 0;
    this.cardGroup = new CardGroup(mode);
    this.state = GameState.INIT;
    this.isFirstTurn = true;
    this.eventListeners = [];
  }

  start(): void {
    if (this.state !== GameState.INIT) {
      throw new Error('Game can only be started from INIT state');
    }

    this.deck.shuffle();

    // Clear players' hands and staging areas
    for (const player of this.players) {
      player.clearHand();
      player.clearStagingArea();
    }

    // Deal initial cards (6 cards per player)
    for (const player of this.players) {
      const cards = this.deck.draw(6);
      for (const card of cards) {
        player.addCard(card);
      }
    }

    this.state = GameState.PLAYING;
    this.players[this.currentPlayerIndex].setCurrentTurn(true);
    this.emitEvent({ type: 'GameStarted' });
  }

  drawCard(playerId: string): Card {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    if (playerId !== this.players[this.currentPlayerIndex].getId()) {
      throw new Error("Not current player's turn");
    }

    if (this.deck.isEmpty()) {
      throw new Error('Deck is empty');
    }

    const card = this.deck.draw(1)[0];
    this.players[this.currentPlayerIndex].addCard(card);
    this.emitEvent({ type: 'CardsDrawn', payload: { playerId, card } });
    return card;
  }

  stageCard(player: Player, card: Card, position: CardPosition): void {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    if (!player.isCurrentPlayer()) {
      throw new Error("Not current player's turn");
    }

    if (!player.hasCard(card)) {
      throw new Error('Player does not have this card');
    }

    player.stageCard(card, position);
    this.emitEvent({ type: 'CardStaged', payload: { playerId: player.getId(), card, position } });
  }

  unstageCard(player: Player, position: CardPosition): void {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    if (!player.isCurrentPlayer()) {
      throw new Error("Not current player's turn");
    }

    player.unstageCard(position);
    this.emitEvent({ type: 'CardUnstaged', payload: { playerId: player.getId(), position } });
  }

  playCards(playerId: string): void {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    if (playerId !== this.players[this.currentPlayerIndex].getId()) {
      throw new Error("Not current player's turn");
    }

    const stagedCards = this.players[this.currentPlayerIndex].getStagedCards();
    if (stagedCards.size < 2 || stagedCards.size > 3) {
      throw new Error('Must stage 2 or 3 cards');
    }

    try {
      this.cardGroup.placeCards(stagedCards, playerId);
      if (this.cardGroup.validate()) {
        this.cardGroup.commit();
        this.players[this.currentPlayerIndex].discardStagedCards();
        this.emitEvent({ type: 'CardPlayed', payload: { playerId, cards: stagedCards } });
        
        // Check for winner
        if (this.players[this.currentPlayerIndex].hasWon()) {
          this.state = GameState.FINISHED;
          this.emitEvent({ type: 'GameWon', payload: { winnerId: playerId } });
          return;
        }
        
        this.endTurn();
      } else {
        // Return cards to player's hand if invalid
        this.players[this.currentPlayerIndex].clearStagingArea();
        throw new Error('Invalid card combination');
      }
    } catch (error) {
      // Return cards to player's hand if any error occurs
      this.players[this.currentPlayerIndex].clearStagingArea();
      throw error;
    }
  }

  endTurn(): void {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    this.players[this.currentPlayerIndex].setCurrentTurn(false);
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.players[this.currentPlayerIndex].setCurrentTurn(true);

    this.emitEvent({
      type: 'TurnEnded',
      payload: { nextPlayerId: this.players[this.currentPlayerIndex].getId() },
    });
  }

  skip(playerId: string): void {
    if (this.state !== GameState.PLAYING) {
      throw new Error('Game is not in PLAYING state');
    }

    if (playerId !== this.players[this.currentPlayerIndex].getId()) {
      throw new Error("Not current player's turn");
    }

    this.endTurn();
  }

  isFinished(): boolean {
    return this.state === GameState.FINISHED;
  }

  getWinner(): Player | null {
    if (!this.isFinished()) {
      return null;
    }

    return this.players.find((player) => player.hasWon()) || null;
  }

  addEventListener(listener: (event: GameEvent) => void): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: (event: GameEvent) => void): void {
    this.eventListeners = this.eventListeners.filter((l) => l !== listener);
  }

  private emitEvent(event: GameEvent): void {
    for (const listener of this.eventListeners) {
      listener(event);
    }
  }

  getState(): GameState {
    return this.state;
  }

  getMode(): GameMode {
    return this.mode;
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }

  getGameMode(): GameMode {
    return this.mode;
  }

  getCardGroup(): CardGroup {
    return this.cardGroup;
  }

  getDeck(): Deck {
    return this.deck;
  }

  getPlayers(): Player[] {
    return [...this.players];
  }

  commitCards(player: Player): void {
    if (player !== this.getCurrentPlayer()) {
      throw new Error("Not current player's turn");
    }

    const stagedCards = player.getStagedCards();
    if (stagedCards.size === 0) {
      throw new Error('No cards staged');
    }

    try {
      player.commitToCardGroup(this.cardGroup);
      this.switchToNextPlayer();
    } catch (error) {
      throw new Error('Invalid equation');
    }
  }

  private switchToNextPlayer(): void {
    this.players[this.currentPlayerIndex].setCurrentTurn(false);
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    this.players[this.currentPlayerIndex].setCurrentTurn(true);
  }

  hasPlayerWon(player: Player): boolean {
    return player.hasWon();
  }
}
