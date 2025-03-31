import React, { useState } from 'react';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { GameMode, CardPosition } from '../game/types';
import { Card } from '../game/models/Card';

// 样式常量
const useTriFactaStyles = () => {
  const cardBg = useColorModeValue('#f3e9d2', '#2D3748');
  const strokeColor = useColorModeValue('#5d534a', '#63B3ED');
  const textColor = useColorModeValue('#5d534a', 'white');
  const minusCircleFill = useColorModeValue('#e76f51', '#FC8181');
  const plusCircleFill = useColorModeValue('#7fb069', '#48BB78');
  const selectedTriangleFill = useColorModeValue('#a8d1ff', '#2B6CB0');
  const dragOverTriangleFill = useColorModeValue('#e2e8f0', '#4A5568');

  return {
    cardBg,
    strokeColor,
    textColor,
    minusCircleFill,
    plusCircleFill,
    selectedTriangleFill,
    dragOverTriangleFill,
  };
};

// 运算符圆圈组件
interface OperatorCircleProps {
  cx: number;
  cy: number;
  operator: string;
  fill: string;
  strokeColor: string;
  isMultiplication: boolean;
}

const OperatorCircle: React.FC<OperatorCircleProps> = ({
  cx,
  cy,
  operator,
  fill,
  strokeColor,
  isMultiplication,
}) => (
  <>
    <circle cx={cx} cy={cy} r="18" fill={fill} stroke={strokeColor} strokeWidth="2" />
    {isMultiplication ? (
      <text
        x={cx}
        y={cy + 8}
        fontFamily="Arial, sans-serif"
        fontSize="24"
        fontWeight="bold"
        textAnchor="middle"
        fill={strokeColor}
      >
        {operator}
      </text>
    ) : (
      <line x1={cx - 10} y1={cy} x2={cx + 10} y2={cy} stroke={strokeColor} strokeWidth="2.5" />
    )}
  </>
);

// 数字区域组件
interface NumberAreaProps {
  position: CardPosition;
  number: number;
  fill: string;
  strokeColor: string;
  textColor: string;
  textX: number;
  textY: number;
  trianglePath: string;
  rectanglePath: string;
  dragOverPosition: CardPosition | null;
  onDragOver: (e: React.DragEvent, position: CardPosition) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, position: CardPosition) => void;
  onTouchMove: (e: React.TouchEvent, position: CardPosition) => void;
  onTouchEnd: (e: React.TouchEvent, position: CardPosition) => void;
}

const NumberArea: React.FC<NumberAreaProps> = ({
  position,
  number,
  fill,
  strokeColor,
  textColor,
  textX,
  textY,
  trianglePath,
  rectanglePath,
  dragOverPosition,
  onDragOver,
  onDragLeave,
  onDrop,
  onTouchMove,
  onTouchEnd,
}) => (
  <g
    onDragOver={(e) => onDragOver(e, position)}
    onDragLeave={onDragLeave}
    onDrop={(e) => onDrop(e, position)}
    onTouchMove={(e) => onTouchMove(e, position)}
    onTouchEnd={(e) => onTouchEnd(e, position)}
  >
    <path d={trianglePath} fill={fill} stroke={strokeColor} strokeWidth="2" />
    <path
      d={rectanglePath}
      fill={fill}
      stroke={strokeColor}
      strokeWidth="2"
      style={{
        opacity: dragOverPosition === position ? 1 : 0,
        transition: 'opacity 0.2s ease-in-out',
      }}
    />
    <text
      x={textX}
      y={textY}
      fontFamily="Arial, sans-serif"
      fontSize="36"
      fontWeight="bold"
      textAnchor="middle"
      fill={textColor}
    >
      {number}
    </text>
  </g>
);

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
  const [dragOverPosition, setDragOverPosition] = useState<CardPosition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState<CardPosition | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const styles = useTriFactaStyles();
  const isMultiplication = gameMode === GameMode.MULTIPLICATION;

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
  };

  const handleTouchMove = (e: React.TouchEvent, position: CardPosition) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    // 只在位置发生变化时更新
    if (lastPosition !== position) {
      setLastPosition(position);
      setDragOverPosition(position);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, position: CardPosition) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    // 确保在触摸结束时使用最后的位置
    const finalPosition = lastPosition || position;

    // 直接调用 onTouchEnd 回调
    onTouchEnd?.(e, finalPosition);

    // 清理状态
    setDragOverPosition(null);
    setLastPosition(null);
    setIsDragging(false);
    setIsTouchDevice(false);
  };

  const handleTouchCancel = () => {
    setIsDragging(false);
    setDragOverPosition(null);
    setLastPosition(null);
    setIsTouchDevice(false);
  };

  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" p={4}>
      <Box position="relative" p={2}>
        <svg
          viewBox="50 50 300 275"
          width="100%"
          height="100%"
          onTouchStart={handleTouchStart}
          onTouchCancel={handleTouchCancel}
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
