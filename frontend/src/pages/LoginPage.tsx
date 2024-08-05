import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Link,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export const LoginPage = () => {
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      m="auto"
      mt={8}
      bg="white"
      shadow="md"
    >
      <VStack spacing={4} align="stretch">
        <Heading as="h2" size="lg" textAlign="center">
          Pokemon Project
        </Heading>
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button colorScheme="blue" size="lg">
          Login
        </Button>
        <Link as={RouterLink} to="/register" color="blue.500" textAlign="center">
          Register
        </Link>
        <Link as={RouterLink} to="/forgot-password" color="blue.500" textAlign="center">
          Forgot Password
        </Link>
      </VStack>
    </Box>
  );
}