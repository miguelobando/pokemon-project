 import { useQuery } from 'react-query';
import axios from 'axios';
import urlGenerator from '../utils/urlGenerator';
import { TradePokemon } from '../interfaces/tradePokemon';


const axiosInstance = axios.create({
  baseURL: urlGenerator(),
});

const fetchAlreadyAskedPokemon = async (userId: number): Promise<string[]> => {
  const { data } = await axiosInstance.get<TradePokemon[]>(`/pokemons/asked-pokemons`, {
    params: { id: userId },
  });

    return data.map((pokemon: TradePokemon) => pokemon.requested_pokemon_id);
};

export const useAlreadyAskedPokemon = (userId?: number) => {
  return useQuery(
    ['alreadyAskedPokemon', userId],
    () => fetchAlreadyAskedPokemon(userId!),
    {
      enabled: !!userId,
    }
  );
};
