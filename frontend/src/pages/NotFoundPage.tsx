import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      textAlign="center"
      bg="gray.50"
      p={4}
    >
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="lg" mb={4}>
        Oops! The page you're looking for doesn't exist.
      </Text>
      <Button as={RouterLink} to="/" colorScheme="teal" size="lg">
        Go Back Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;