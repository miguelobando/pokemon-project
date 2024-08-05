import { useMutation } from 'react-query';
import axios from 'axios';
// import env from "react-dotenv";


interface LoginData {
  email: string;
  password: string;
}

const login = async (loginData: LoginData) => {
  const SERVER_URL = 'http://localhost:3000';

  if (!SERVER_URL)
    throw new Error('SERVER_URL is not set');
    const response = await axios.post(`${SERVER_URL}/login/sign-in`, loginData);
  return response.data;
};

export const useLogin = () => {
  return useMutation(login);
};