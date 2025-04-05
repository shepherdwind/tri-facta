import { Card } from '../Card';
import { CardPosition } from '../../types';

/**
 * Represents a suggestion for card placement
 */
export interface CardPlacementSuggestion {
  explanation: string;
  cards: Map<CardPosition, Card>;
}
