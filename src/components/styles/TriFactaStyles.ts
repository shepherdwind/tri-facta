import { useColorModeValue } from '@chakra-ui/react';

export const useTriFactaStyles = () => {
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
