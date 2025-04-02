import React from 'react';
import { Box } from '@chakra-ui/react';
import { GameMode, CardPosition } from '../../game/types';
import { Card } from '../../game/models/Card';
import { useTriFactaStyles } from '../styles/TriFactaStyles';
import { OperatorCircle } from './OperatorCircle';
import { NumberArea } from './NumberArea';
import { useTriFactaInteraction } from './useTriFactaInteraction';

interface TriFactaCardProps {
  topNumber: number;
  leftNumber: number;
  rightNumber: number;
  gameMode: GameMode;
  selectedCards?: Map<CardPosition, Card>;
  onDrop?: (e: React.DragEvent, position: CardPosition) => void;
  onTouchEnd?: (e: React.TouchEvent, position: CardPosition) => void;
}

const TriFactaCard: React.FC<TriFactaCardProps> = ({
  topNumber,
  leftNumber,
  rightNumber,
  gameMode,
  selectedCards = new Map(),
  onDrop,
  onTouchEnd,
}) => {
  const styles = useTriFactaStyles();
  const isMultiplication = gameMode === GameMode.MULTIPLICATION;

  const {
    dragOverPosition,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel,
  } = useTriFactaInteraction({ onDrop, onTouchEnd });

  const operatorSymbols = {
    left: isMultiplication ? '÷' : '−',
    right: isMultiplication ? '÷' : '−',
    bottom: isMultiplication ? '×' : '+',
  };

  const getTriangleFill = (position: CardPosition) => {
    if (dragOverPosition === position) {
      return styles.dragOverTriangleFill;
    }
    return selectedCards.has(position) ? styles.selectedTriangleFill : styles.cardBg;
  };

  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" p={4}>
      <Box position="relative" p={2}>
        <svg
          viewBox="50 50 300 275"
          width="100%"
          height="100%"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchCancel}
          style={{ touchAction: 'none' }}
        >
          {/* 主三角形背景 */}
          <path
            d="M200 50 L50 325 L350 325 Z"
            fill={styles.cardBg}
            stroke={styles.strokeColor}
            strokeWidth="3"
          />

          {/* 顶部区域 */}
          <NumberArea
            position={CardPosition.TOP}
            number={topNumber}
            fill={getTriangleFill(CardPosition.TOP)}
            strokeColor={styles.strokeColor}
            textColor={styles.textColor}
            textX={200}
            textY={175}
            trianglePath="M200 120 L160 185 L240 185 Z"
            rectanglePath="M160 100 L240 100 L240 200 L160 200 Z"
            dragOverPosition={dragOverPosition}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* 左下角区域 */}
          <NumberArea
            position={CardPosition.BOTTOM_LEFT}
            number={leftNumber}
            fill={getTriangleFill(CardPosition.BOTTOM_LEFT)}
            strokeColor={styles.strokeColor}
            textColor={styles.textColor}
            textX={125}
            textY={300}
            trianglePath="M125 250 L85 310 L165 310 Z"
            rectanglePath="M85 230 L165 230 L165 330 L85 330 Z"
            dragOverPosition={dragOverPosition}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* 右下角区域 */}
          <NumberArea
            position={CardPosition.BOTTOM_RIGHT}
            number={rightNumber}
            fill={getTriangleFill(CardPosition.BOTTOM_RIGHT)}
            strokeColor={styles.strokeColor}
            textColor={styles.textColor}
            textX={275}
            textY={300}
            trianglePath="M275 250 L235 310 L315 310 Z"
            rectanglePath="M235 230 L315 230 L315 330 L235 330 Z"
            dragOverPosition={dragOverPosition}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          {/* 运算符圆圈 */}
          <OperatorCircle
            cx={165}
            cy={215}
            operator={operatorSymbols.left}
            fill={styles.minusCircleFill}
            strokeColor={styles.strokeColor}
            isMultiplication={isMultiplication}
          />

          <OperatorCircle
            cx={235}
            cy={215}
            operator={operatorSymbols.right}
            fill={styles.minusCircleFill}
            strokeColor={styles.strokeColor}
            isMultiplication={isMultiplication}
          />

          <OperatorCircle
            cx={200}
            cy={275}
            operator={operatorSymbols.bottom}
            fill={styles.plusCircleFill}
            strokeColor={styles.strokeColor}
            isMultiplication={isMultiplication}
          />
        </svg>
      </Box>
    </Box>
  );
};

export default TriFactaCard;
