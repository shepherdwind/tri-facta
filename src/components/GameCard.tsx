import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { Card } from '../game/models/Card';

interface GameCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  isCurrentPlayer?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({
  card,
  isSelected = false,
  onClick,
  isCurrentPlayer = false,
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const selectedBg = useColorModeValue('blue.100', 'blue.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const selectedBorderColor = useColorModeValue('blue.500', 'blue.300');
  const textColor = useColorModeValue('gray.800', 'white');

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
      alignItems="center"
      justifyContent="center"
      cursor={onClick ? 'pointer' : 'default'}
      onClick={onClick}
      position="relative"
      transition="all 0.2s"
      _hover={onClick ? { transform: 'translateY(-4px)', boxShadow: 'lg' } : {}}
      _active={onClick ? { transform: 'translateY(0)' } : {}}
    >
      <Box fontSize="2xl" fontWeight="bold" color={textColor} textAlign="center">
        {card.getValue() === null ? '?' : card.getValue()}
      </Box>
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
