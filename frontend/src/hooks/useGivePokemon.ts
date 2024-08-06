import { useMutation } from 'react-query';
import axios from 'axios';
import urlGenerator from '../utils/urlGenerator';

export interface GivePokemondata {
    senderId: number;
    receptorId: number;
    pokemonId: string;
}

const givePokemon = async (givePokemonData: GivePokemondata) => {
    const SERVER_URL = urlGenerator();

    if (!SERVER_URL)
        throw new Error('SERVER_URL is not set');
    const response = await axios.post(`${SERVER_URL}/pokemons/give-pokemon`, givePokemonData);
    return response.data;
};

export const useGivePokemon = () => {
    return useMutation(givePokemon);
};