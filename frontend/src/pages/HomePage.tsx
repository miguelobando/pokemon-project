import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Link,
  Text,
  CircularProgress,
} from '@chakra-ui/react';
import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { UserData, UserDataContext } from '../interfaces/userInfo';
import UserContext from '../context/users';
import { getUserCookie, setUserCookie } from '../utils/cookies';
const errorMessage = 'Invalid email or password';
import { useNavigate } from "react-router-dom";
import { useQueryClient } from 'react-query';


export const HomePage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const {  setUser } = useContext(UserContext) as UserDataContext;
  const navigate = useNavigate();
const queryClient = useQueryClient();

  const { mutate: handleLogin, isLoading } = useLogin();

  useEffect(() => {
    const session = getUserCookie();
    if (session) {
      setUser(session);
      navigate('/dashboard');
    }
  }, []);

  const handleSubmit = async () => {
    setError(false);
    try {
      handleLogin(
        { email, password },
        {
          onSuccess: (result: UserData) => {
            setUser(result);
            setUserCookie(JSON.stringify(result));
            queryClient.setQueryData(['user'], result);
            navigate('/dashboard');
            
          },
          onError: () => {
            setError(true);

          },
        }
      );
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  }

  
  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={6}
      m="auto"
      mt={'10%'}
      bg="white"
      shadow="md"
    >
      <VStack spacing={4} align="stretch">

        <Heading as="h2" size="lg" textAlign="center">
          Pokemon Project
        </Heading>

        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input type="email" onChange= {(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <Input type="password"  onChange={(e) => setPassword(e.target.value)} />
        </FormControl>

        <Button disabled={isLoading} colorScheme="blue" size="lg" onClick={() => handleSubmit()}>
          { isLoading ? <CircularProgress isIndeterminate /> : 'Login' }
        </Button>

        {error && <Text color={'red.500'} fontSize={'sm'}>{errorMessage}</Text>}

        <Link color="blue.500" textAlign="center" onClick={() => handleRegister()}>
          Register
        </Link>
        
        <Link as={RouterLink} to="/forgot-password" color="blue.500" textAlign="center">
          Forgot Password
        </Link>
      
      </VStack>
    </Box>
  );
}