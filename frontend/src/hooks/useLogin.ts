import { useMutation } from 'react-query';
import axios from 'axios';
import urlGenerator from '../utils/urlGenerator';
import { LoginInterface } from '../interfaces/LoginInterface';


interface LoginData {
  email: string;
  password: string;
}

const login = async (loginData: LoginData) => {
  const SERVER_URL = urlGenerator();

  if (!SERVER_URL)
    throw new Error('SERVER_URL is not set');
    const response = await axios.post<LoginInterface>(`${SERVER_URL}/login/sign-in`, loginData);
  const data = response.data;
  return data.user;
};

export const useLogin = () => {
  return useMutation(login);
};