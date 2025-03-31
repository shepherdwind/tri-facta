import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Card } from '../game/models/Card';
import { CardPosition } from '../game/types';

interface GameCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  isCurrentPlayer?: boolean;
  targetPosition?: CardPosition;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected = false,
  onClick,
  isCurrentPlayer = false,
  targetPosition,
}) => {
  const { t } = useTranslation();
  const cardBg = useColorModeValue('white', 'gray.700');
  const selectedBg = useColorModeValue('blue.100', 'blue.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.800', 'white');
  const positionTextColor = useColorModeValue('blue.500', 'blue.300');

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

  return (
    <Box
      width="80px"
      height="120px"
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
      transform={isSelected ? 'translateY(-8px)' : 'translateY(0)'}
      _hover={
        onClick
          ? { transform: isSelected ? 'translateY(-8px)' : 'translateY(-4px)', boxShadow: 'lg' }
          : {}
      }
      _active={onClick ? { transform: isSelected ? 'translateY(-8px)' : 'translateY(0)' } : {}}
    >
      <Box fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
        {card.getValue() === null ? '?' : card.getValue()}
      </Box>
      {isSelected && targetPosition && (
        <Box
          fontSize="xs"
          color={positionTextColor}
          position="absolute"
          bottom="4px"
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
          width="12px"
          height="12px"
          bg="green.500"
          borderRadius="full"
          transform="translate(4px, -4px)"
        />
      )}
    </Box>
  );
};
