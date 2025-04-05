import { useTheme } from '../hooks/useTheme';

export const useTriFactaStyles = () => {
  const { isDarkMode } = useTheme();

  return {
    cardBg: isDarkMode ? '#2D3748' : '#f3e9d2',
    strokeColor: isDarkMode ? '#63B3ED' : '#5d534a',
    textColor: isDarkMode ? '#FFFFFF' : '#5d534a',
    minusCircleFill: isDarkMode ? '#FC8181' : '#e76f51',
    plusCircleFill: isDarkMode ? '#48BB78' : '#7fb069',
    selectedTriangleFill: isDarkMode ? '#2B6CB0' : '#a8d1ff',
    dragOverTriangleFill: isDarkMode ? '#4A5568' : '#e2e8f0',
  };
};
