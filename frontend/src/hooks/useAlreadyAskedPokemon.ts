 import { useQuery } from 'react-query';
import axios from 'axios';
import { Pokemon } from '../interfaces/Pokemon';
import urlGenerator from '../utils/urlGenerator';


const axiosInstance = axios.create({
  baseURL: urlGenerator(),
});

const fetchAlreadyAskedPokemon = async (userId: number): Promise<Pokemon[]> => {
  const { data } = await axiosInstance.get<Pokemon[]>(`/pokemons/asked-pomeons`, {
    params: { id: userId },
  });
  return data;
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
