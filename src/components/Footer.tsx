import React from 'react';
import { Box, Link, Text, useColorModeValue } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Box as="footer" py={4} textAlign="center">
      <Text color={textColor} fontSize="sm">
        {t('footer.sourceCode')}{' '}
        <Link
          href="https://github.com/shepherdwind/tri-facta"
          isExternal
          color="blue.500"
          _hover={{ color: 'blue.600' }}
        >
          GitHub
        </Link>
      </Text>
    </Box>
  );
};
