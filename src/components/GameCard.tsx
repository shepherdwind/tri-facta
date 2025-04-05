import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { Card } from '../game/models/Card';
import { CardPosition } from '../game/types';
import { GameStore } from '../stores/GameStore';
import { cn } from '../utils/cn';

interface GameCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  targetPosition?: CardPosition;
  onDragStart?: (e: React.DragEvent, card: Card) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const GameCard = observer<GameCardProps>(
  ({ card, isSelected = false, onClick, targetPosition, onDragStart, onDragEnd }) => {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [touchStartTime, setTouchStartTime] = useState<number>(0);
    const [touchStartPosition, setTouchStartPosition] = useState<{ x: number; y: number } | null>(
      null
    );
    const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const store = GameStore.getInstance();

    const getPositionText = (position?: CardPosition) => {
      if (!position) return '';
      switch (position) {
        case CardPosition.TOP:
          return t('game.position.top');
        case CardPosition.BOTTOM_LEFT:
          return t('game.position.bottomLeft');
        case CardPosition.BOTTOM_RIGHT:
          return t('game.position.bottomRight');
        default:
          return '';
      }
    };

    const handleDragStart = (e: React.DragEvent, card: Card) => {
      setIsDragging(true);
      e.dataTransfer.setData('cardString', card.toString());
      store.setDraggedCard(card);
      onDragStart?.(e, card);
    };

    const handleDragEnd = (e: React.DragEvent) => {
      setIsDragging(false);
      store.setDraggedCard(null);
      onDragEnd?.(e);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setTouchStartTime(Date.now());
      setTouchStartPosition({ x: touch.clientX, y: touch.clientY });
      setIsDragging(false);

      const timer = setTimeout(() => {
        setIsDragging(true);
        store.setDraggedCard(card);

        const dragEvent = new DragEvent('dragstart', {
          bubbles: true,
          cancelable: true,
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.setData('cardString', card.toString());
        Object.defineProperty(dragEvent, 'dataTransfer', {
          value: dataTransfer,
        });
        cardRef.current?.dispatchEvent(dragEvent);
        onDragStart?.(dragEvent as unknown as React.DragEvent, card);
      }, 500);

      setLongPressTimer(timer);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!touchStartPosition) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
      const deltaY = Math.abs(touch.clientY - touchStartPosition.y);

      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimer) {
          clearTimeout(longPressTimer);
          setLongPressTimer(null);
        }
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }

      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;

      if (!isDragging && touchDuration < 500) {
        e.preventDefault();
        onClick?.();
      }

      if (isDragging) {
        const dragEndEvent = new DragEvent('dragend', {
          bubbles: true,
          cancelable: true,
        });
        cardRef.current?.dispatchEvent(dragEndEvent);
        onDragEnd?.(dragEndEvent as unknown as React.DragEvent);
      }

      setIsDragging(false);
      setTouchStartTime(0);
      setTouchStartPosition(null);
      store.setDraggedCard(null);
    };

    const getTransform = () => {
      if (isDragging) {
        return 'scale(0.8)';
      }
      if (isSelected) {
        return 'translateY(-4px)';
      }
      return 'translateY(0)';
    };

    return (
      <div
        ref={cardRef}
        className={cn(
          'w-[60px] h-[80px] rounded-md shadow-md flex flex-col items-center justify-center relative transition-all duration-200',
          'border-2',
          isSelected
            ? 'bg-blue-200 dark:bg-blue-800 border-blue-600 dark:border-blue-400'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-500',
          onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5' : 'cursor-default',
          isDragging ? 'opacity-50' : 'opacity-100'
        )}
        style={{ transform: getTransform() }}
        onClick={onClick}
        draggable={!!onClick && !isSelected}
        onDragStart={(e) => handleDragStart(e, card)}
        onDragEnd={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {card.getValue() === null ? '?' : card.getValue()}
        </div>
        {isSelected && targetPosition && (
          <div className="absolute bottom-0.5 text-[10px] text-blue-600 dark:text-blue-400 text-center">
            {getPositionText(targetPosition)}
          </div>
        )}
        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-green-500 rounded-full transform translate-x-0.5 -translate-y-0.5" />
      </div>
    );
  }
);
