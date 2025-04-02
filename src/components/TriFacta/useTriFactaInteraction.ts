import { useState, useEffect } from 'react';
import { CardPosition } from '../../game/types';

interface UseTriFactaInteractionProps {
  onDrop?: (e: React.DragEvent, position: CardPosition) => void;
  onTouchEnd?: (e: React.TouchEvent, position: CardPosition) => void;
}

export const useTriFactaInteraction = ({ onDrop, onTouchEnd }: UseTriFactaInteractionProps) => {
  const [dragOverPosition, setDragOverPosition] = useState<CardPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState<CardPosition | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const getPositionFromTouch = (touch: React.Touch): CardPosition | null => {
    const svgElement = document.querySelector('svg');
    if (!svgElement) return null;

    const rect = svgElement.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (y < 200 && x > 160 && x < 240) return CardPosition.TOP;
    if (y > 230 && y < 330) {
      if (x > 85 && x < 165) return CardPosition.BOTTOM_LEFT;
      if (x > 235 && x < 315) return CardPosition.BOTTOM_RIGHT;
    }
    return null;
  };

  const handleDragOver = (e: React.DragEvent, position: CardPosition) => {
    if (isTouchDevice) return;
    e.preventDefault();
    e.stopPropagation();
    if (dragOverPosition !== position) {
      setDragOverPosition(position);
    }
  };

  const handleDragLeave = () => {
    if (isTouchDevice) return;
    setDragOverPosition(null);
    setLastPosition(null);
  };

  const handleDrop = (e: React.DragEvent, position: CardPosition) => {
    if (isTouchDevice) return;
    e.preventDefault();
    e.stopPropagation();
    setDragOverPosition(null);
    setLastPosition(null);
    setIsDragging(false);
    onDrop?.(e, position);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsTouchDevice(true);
    setIsDragging(true);
    setLastPosition(null);
    const touch = e.touches[0];
    if (touch) {
      const position = getPositionFromTouch(touch);
      if (position) {
        setDragOverPosition(position);
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0];
    if (!touch) return;

    const position = getPositionFromTouch(touch);
    if (position && lastPosition !== position) {
      setLastPosition(position);
      setDragOverPosition(position);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const finalPosition = lastPosition;
    if (finalPosition) {
      onTouchEnd?.(e, finalPosition);
    }

    setDragOverPosition(null);
    setLastPosition(null);
    setIsDragging(false);
    setIsTouchDevice(false);
  };

  const handleTouchCancel = () => {
    setDragOverPosition(null);
    setLastPosition(null);
    setIsDragging(false);
    setIsTouchDevice(false);
  };

  useEffect(() => {
    const handleGlobalTouchEnd = (e: TouchEvent) => {
      if (isDragging) {
        handleTouchEnd(e as unknown as React.TouchEvent);
      }
    };

    const handleGlobalTouchCancel = () => {
      handleTouchCancel();
    };

    document.addEventListener('touchend', handleGlobalTouchEnd);
    document.addEventListener('touchcancel', handleGlobalTouchCancel);

    return () => {
      document.removeEventListener('touchend', handleGlobalTouchEnd);
      document.removeEventListener('touchcancel', handleGlobalTouchCancel);
    };
  }, [isDragging]);

  return {
    dragOverPosition,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  };
};
