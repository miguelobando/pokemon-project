import { useQuery } from 'react-query';
import axios from 'axios';
import { Pokemon } from '../interfaces/Pokemon';
import urlGenerator from '../utils/urlGenerator';


const axiosInstance = axios.create({
  baseURL: urlGenerator(),
});

const fetchAllPokemons = async (): Promise<Pokemon[]> => {
  const { data } = await axiosInstance.get<Pokemon[]>('/pokemons');
  return data;
};

const fetchOwnedPokemons = async (userId: number): Promise<Pokemon[]> => {
  const { data } = await axiosInstance.get<Pokemon[]>(`/pokemons/owned`, {
    params: { id: userId },
  });
  return data;
};

export const useAllPokemons = () => {
  return useQuery('allPokemons', fetchAllPokemons);
};

export const useOwnedPokemons = (userId?: number) => {
  return useQuery(
    ['ownedPokemons', userId],
    () => fetchOwnedPokemons(userId!),
    {
      enabled: !!userId,
    }
  );
};