import { useMutation } from 'react-query';
import axios from 'axios';
import urlGenerator from '../utils/urlGenerator';

export interface AskPokemonData {
    userId: number;
    pokemonId: string;
}

const askPokemon = async (askPokemonData: AskPokemonData) => {
    const SERVER_URL = urlGenerator();

    if (!SERVER_URL)
        throw new Error('SERVER_URL is not set');
    const response = await axios.post(`${SERVER_URL}/pokemons/request-trade`, askPokemonData);
    return response.data;
};

export const useAskPokemon = () => {
    return useMutation(askPokemon);
};
