import { Box, VStack, Heading, FormControl, FormLabel, Input, Button, Select, Text, CircularProgress } from "@chakra-ui/react"
import { useContext, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { setUserCookie } from "../utils/cookies";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../interfaces/userInfo";
import UserContext from "../context/users";

export const RegisterPage = () => {
  const [ email , setEmail] = useState(''); 
  const [confirmEmail, setConfirmEmail] = useState('');
  const [ name , setName] = useState('');
  const [ gender , setGender] = useState('Male');
  const [ password , setPassword] = useState('');
  const [ confirmPassword , setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate: handleRegister, isLoading } = useRegister();
  const navigate = useNavigate();
  const {  setUser } = useContext(UserContext) as UserDataContext;


    const handleSubmit = () => {
      if (email !== confirmEmail) {
        setError(true);
        setErrorMessage('Emails do not match');
        return;
      }
      if (password !== confirmPassword) {
        setError(true);
        setErrorMessage('Passwords do not match');
        return;
      }
      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(true);
        setErrorMessage('Invalid email');
        return;
      }

      setError(false);
      setErrorMessage('');

      handleRegister(
        { email, password, name, gender },
        {
          onSuccess: (result) => {
            setUserCookie(JSON.stringify(result));
            setUser(result);
            navigate('/dashboard');
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            setError(true);
            if (error.response && error.response.data && error.response.data.message) {
              setErrorMessage(error.response.data.message);
            } else {
              setErrorMessage('An error occurred during registration');
            }
            console.log(error);
          },
        }
      )
      

    };
  
  
  
  return (
    <Box
    maxW="lg"
    borderWidth="1px"
    borderRadius="lg"
    overflow="hidden"
    p={6}
    m="auto"
    mt={'1%'}
    bg="white"
    shadow="md"
  >
    <VStack spacing={4} align="stretch">

      <Heading as="h2" size="lg" textAlign="center">
        Register for Pokemon Project
      </Heading>
        
        {error && <Text color={'red.500'} fontSize={'sm'}>{errorMessage}</Text>}


      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input type="email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>

      <FormControl id="confirm_email">
        <FormLabel>Confirm Email</FormLabel>
        <Input type="email" onChange={(e) => setConfirmEmail(e.target.value)} />
      </FormControl>

      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <Input type="password"  onChange={(e) => setPassword(e.target.value)} />
      </FormControl>

      <FormControl id="confirm_password">
        <FormLabel>Confirm password</FormLabel>
        <Input type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
      </FormControl>

      

      <FormControl id="name">
        <FormLabel>Name</FormLabel>
        <Input type="text" onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl id="gender">
        <FormLabel>Gender</FormLabel>
        <Select onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          </Select>
      </FormControl>




      <Button colorScheme="blue" disabled={isLoading} size="lg" mt={4} onClick={() => handleSubmit()}>
        { isLoading ? <CircularProgress isIndeterminate /> : 'Register' }
      </Button>


      
    </VStack>
  </Box>
  )
}