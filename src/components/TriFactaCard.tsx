import React from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { GameMode, CardPosition } from '../game/types';
import { Card } from '../game/models/Card';

interface TriFactaCardProps {
  topNumber: number;
  leftNumber: number;
  rightNumber: number;
  gameMode: GameMode;
  selectedCards?: Map<CardPosition, Card>;
}

const TriFactaCard: React.FC<TriFactaCardProps> = ({
  topNumber,
  leftNumber,
  rightNumber,
  gameMode,
  selectedCards = new Map(),
}) => {
  const cardBg = useColorModeValue('#f3e9d2', '#2D3748');
  const strokeColor = useColorModeValue('#5d534a', '#63B3ED');
  const textColor = useColorModeValue('#5d534a', 'white');
  const topTriangleFill = useColorModeValue('#e9c46a', '#4A90E2');
  const minusCircleFill = useColorModeValue('#e76f51', '#FC8181');
  const plusCircleFill = useColorModeValue('#7fb069', '#48BB78');
  const selectedTriangleFill = useColorModeValue('#a8d1ff', '#2B6CB0');

  const isMultiplication = gameMode === GameMode.MULTIPLICATION;
  const operatorSymbols = {
    left: isMultiplication ? '÷' : '−',
    right: isMultiplication ? '÷' : '−',
    bottom: isMultiplication ? '×' : '+',
  };

  const getTriangleFill = (position: CardPosition) => {
    return selectedCards.has(position) ? selectedTriangleFill : cardBg;
  };

  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" p={4}>
      <Box position="relative" p={2}>
        <svg viewBox="50 50 300 275" width="100%" height="100%">
          {/* 主三角形背景 */}
          <path d="M200 50 L50 325 L350 325 Z" fill={cardBg} stroke={strokeColor} strokeWidth="3" />

          {/* 顶部小三角形 */}
          <path
            d="M200 120 L160 185 L240 185 Z"
            fill={getTriangleFill(CardPosition.TOP)}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <text
            x="200"
            y="175"
            fontFamily="Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            textAnchor="middle"
            fill={textColor}
          >
            {topNumber}
          </text>

          {/* 左下角小三角形 */}
          <path
            d="M125 250 L85 310 L165 310 Z"
            fill={getTriangleFill(CardPosition.BOTTOM_LEFT)}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <text
            x="125"
            y="300"
            fontFamily="Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            textAnchor="middle"
            fill={textColor}
          >
            {leftNumber}
          </text>

          {/* 右下角小三角形 */}
          <path
            d="M275 250 L235 310 L315 310 Z"
            fill={getTriangleFill(CardPosition.BOTTOM_RIGHT)}
            stroke={strokeColor}
            strokeWidth="2"
          />
          <text
            x="275"
            y="300"
            fontFamily="Arial, sans-serif"
            fontSize="36"
            fontWeight="bold"
            textAnchor="middle"
            fill={textColor}
          >
            {rightNumber}
          </text>

          {/* 左侧减号圆圈 */}
          <circle
            cx="165"
            cy="215"
            r="18"
            fill={minusCircleFill}
            stroke={strokeColor}
            strokeWidth="2"
          />
          {isMultiplication ? (
            <text
              x="165"
              y="223"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="bold"
              textAnchor="middle"
              fill={strokeColor}
            >
              {operatorSymbols.left}
            </text>
          ) : (
            <line x1="155" y1="215" x2="175" y2="215" stroke={strokeColor} strokeWidth="2.5" />
          )}

          {/* 右侧减号圆圈 */}
          <circle
            cx="235"
            cy="215"
            r="18"
            fill={minusCircleFill}
            stroke={strokeColor}
            strokeWidth="2"
          />
          {isMultiplication ? (
            <text
              x="235"
              y="223"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="bold"
              textAnchor="middle"
              fill={strokeColor}
            >
              {operatorSymbols.right}
            </text>
          ) : (
            <line x1="225" y1="215" x2="245" y2="215" stroke={strokeColor} strokeWidth="2.5" />
          )}

          {/* 底部加号圆圈 */}
          <circle
            cx="200"
            cy="275"
            r="18"
            fill={plusCircleFill}
            stroke={strokeColor}
            strokeWidth="2"
          />
          {isMultiplication ? (
            <text
              x="200"
              y="283"
              fontFamily="Arial, sans-serif"
              fontSize="24"
              fontWeight="bold"
              textAnchor="middle"
              fill={strokeColor}
            >
              {operatorSymbols.bottom}
            </text>
          ) : (
            <>
              <line x1="190" y1="275" x2="210" y2="275" stroke={strokeColor} strokeWidth="2.5" />
              <line x1="200" y1="265" x2="200" y2="285" stroke={strokeColor} strokeWidth="2.5" />
            </>
          )}
        </svg>
      </Box>
    </Box>
  );
};

export default TriFactaCard;
