import React, { useState, useRef } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../game/models/Card';
import { CardPosition } from '../game/types';
import { GameStore } from '../stores/GameStore';

interface GameCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  isCurrentPlayer?: boolean;
  targetPosition?: CardPosition;
  onDragStart?: (e: React.DragEvent, card: Card) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  store: GameStore;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected = false,
  onClick,
  isCurrentPlayer = false,
  targetPosition,
  onDragStart,
  onDragEnd,
  store,
}) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState<number>(0);
  const [touchStartPosition, setTouchStartPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cardBg = useColorModeValue('white', 'gray.800');
  const selectedBg = useColorModeValue('blue.200', 'blue.800');
  const borderColor = useColorModeValue('gray.300', 'gray.500');
  const selectedBorderColor = useColorModeValue('blue.600', 'blue.400');
  const textColor = useColorModeValue('gray.900', 'white');
  const positionTextColor = useColorModeValue('blue.600', 'blue.400');

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

    // 设置长按计时器
    const timer = setTimeout(() => {
      setIsDragging(true);
      store.setDraggedCard(card);

      // 创建一个自定义的拖拽事件
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
    }, 500); // 500ms 长按阈值

    setLongPressTimer(timer);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPosition) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - touchStartPosition.y);

    // 如果移动距离太大，取消长按计时器
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
      e.preventDefault(); // 只在移动距离大时阻止默认行为
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // 清除长按计时器
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }

    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;

    // 如果不是拖拽状态，且触摸时间小于长按阈值，则认为是点击
    if (!isDragging && touchDuration < 500) {
      e.preventDefault(); // 阻止默认行为，防止触发其他事件
      onClick?.();
    }

    // 如果正在拖拽，触发拖拽结束事件
    if (isDragging) {
      const dragEndEvent = new DragEvent('dragend', {
        bubbles: true,
        cancelable: true,
      });
      cardRef.current?.dispatchEvent(dragEndEvent);
      onDragEnd?.(dragEndEvent as unknown as React.DragEvent);
    }

    // 重置状态
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
    <Box
      ref={cardRef}
      width="60px"
      height="80px"
      bg={isSelected ? selectedBg : cardBg}
      borderWidth="2px"
      borderColor={isSelected ? selectedBorderColor : borderColor}
      borderRadius="md"
      boxShadow="md"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      position="relative"
      transition="all 0.2s"
      transform={getTransform()}
      draggable={!!onClick && !isSelected}
      onDragStart={(e) => handleDragStart(e, card)}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      opacity={isDragging ? 0.5 : 1}
      sx={{
        touchAction: 'none',
        WebkitTapHighlightColor: 'transparent', // 移除移动端点击高亮
      }}
      _hover={
        onClick
          ? { transform: isSelected ? 'translateY(-4px)' : 'translateY(-2px)', boxShadow: 'lg' }
          : {}
      }
      _active={onClick ? { transform: isSelected ? 'translateY(-4px)' : 'translateY(0)' } : {}}
    >
      <Box fontSize="xl" fontWeight="bold" color={textColor} textAlign="center">
        {card.getValue() === null ? '?' : card.getValue()}
      </Box>
      {isSelected && targetPosition && (
        <Box
          fontSize="2xs"
          color={positionTextColor}
          position="absolute"
          bottom="2px"
          textAlign="center"
        >
          {getPositionText(targetPosition)}
        </Box>
      )}
      {isCurrentPlayer && (
        <Box
          position="absolute"
          top="0"
          right="0"
          width="6px"
          height="6px"
          bg="green.500"
          borderRadius="full"
          transform="translate(2px, -2px)"
        />
      )}
    </Box>
  );
};
