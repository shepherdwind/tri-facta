import React from 'react';
import { CardPosition } from '../../game/types';

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

export const NumberArea: React.FC<NumberAreaProps> = ({
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
