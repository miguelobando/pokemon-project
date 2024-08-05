import React from 'react';
import { Box } from '@chakra-ui/react';

export const Footer: React.FC = () => {
  return (
    <Box
      as="footer"
      width="100%"
      bg="gray.200"
      color="black"
      textAlign="center"
      py={2}
      position="fixed"
      bottom={0}
    >
      Made with ❤️ by Miguel Obando
    </Box>
  );
};

