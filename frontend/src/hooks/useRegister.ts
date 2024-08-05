import { useMutation } from 'react-query';
import axios from 'axios';
import urlGenerator from '../utils/urlGenerator';

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    gender: string;
}

const register = async (registerData: RegisterData) => {
    const SERVER_URL = urlGenerator();

    if (!SERVER_URL)
        throw new Error('SERVER_URL is not set');
    const response = await axios.post(`${SERVER_URL}/login/sign-up`, registerData);
    return response.data;
};

export const useRegister = () => {
    return useMutation(register);
};