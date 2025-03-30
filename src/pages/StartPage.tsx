import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react';

type GameMode = 'addition' | 'multiplication';

export const StartPage: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('addition');

  const cardBg = useColorModeValue('brand.card', 'gray.700');
  const textColor = useColorModeValue('brand.text', 'white');
  const primaryColor = useColorModeValue('brand.primary', 'blue.400');

  const handleStartGame = () => {
    // TODO: Implement game start logic
    console.log('Starting game in mode:', selectedMode);
  };

  return (
    <Container maxW="1200px" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Heading size="lg" color={primaryColor}>
            tri-FACTa!™
          </Heading>
          <Stack direction="row" spacing={4}>
            <Button variant="ghost">历史记录</Button>
            <Button variant="ghost">帮助</Button>
            <Button variant="ghost">设置</Button>
          </Stack>
        </Flex>

        {/* Game Title */}
        <Box textAlign="center">
          <Heading size="2xl" mb={4}>
            数学思维训练游戏
          </Heading>
          <Text fontSize="xl" color={textColor}>
            通过有趣的三角形卡片，提升你的数学运算能力！
          </Text>
        </Box>

        {/* Game Logo */}
        <Box bg={cardBg} p={8} borderRadius="lg" boxShadow="lg" textAlign="center">
          <Box
            width="200px"
            height="200px"
            margin="0 auto"
            bg={primaryColor}
            clipPath="polygon(50% 0%, 0% 100%, 100% 100%)"
            opacity={0.8}
          />
        </Box>

        {/* Game Mode Selection */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              选择游戏模式
            </Text>
            <Stack direction="row" spacing={4}>
              <Button
                colorScheme={selectedMode === 'addition' ? 'blue' : 'gray'}
                onClick={() => setSelectedMode('addition')}
                size="lg"
              >
                加减法模式
              </Button>
              <Button
                colorScheme={selectedMode === 'multiplication' ? 'blue' : 'gray'}
                onClick={() => setSelectedMode('multiplication')}
                size="lg"
              >
                乘除法模式
              </Button>
            </Stack>
          </VStack>
        </Box>

        {/* Game Instructions */}
        <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="lg">
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              游戏说明
            </Text>
            <Text>• 双人对战模式</Text>
            <Text>• 清空手牌获胜</Text>
            <Text>• 支持万能牌</Text>
          </VStack>
        </Box>

        {/* Start Button */}
        <Box textAlign="center">
          <Button colorScheme="blue" size="lg" width="200px" onClick={handleStartGame}>
            开始游戏
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
