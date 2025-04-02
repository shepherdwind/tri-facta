import React from 'react';

interface OperatorCircleProps {
  cx: number;
  cy: number;
  operator: string;
  fill: string;
  strokeColor: string;
  isMultiplication: boolean;
}

export const OperatorCircle: React.FC<OperatorCircleProps> = ({
  cx,
  cy,
  operator,
  fill,
  strokeColor,
}) => (
  <>
    <circle cx={cx} cy={cy} r="18" fill={fill} stroke={strokeColor} strokeWidth="2" />
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
  </>
);
