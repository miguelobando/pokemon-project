import { useQuery } from 'react-query';
import axios from 'axios';
import { TradePokemon } from '../interfaces/tradePokemon';
import urlGenerator from '../utils/urlGenerator';
import { Pokemon } from '../interfaces/Pokemon';
import { AvailableTrades } from '../interfaces/AvailableTrades';

const axiosInstance = axios.create({
  baseURL: urlGenerator(),
});

const fetchAvailableTrades = async ( userId: number): Promise<AvailableTrades[]> => {
  const { data } = await axiosInstance.get<TradePokemon[]>('/pokemons/available-trades');

  const { data: ownedPokemons } = await axiosInstance.get<Pokemon[]>(`/pokemons/owned`, {
    params: { id: userId },
  }); 

  const result: AvailableTrades[] = [];

  data.forEach((trade: TradePokemon) => {
    const owned = ownedPokemons.find(
      (ownedPokemon: Pokemon) =>
        ownedPokemon.pokemon_id === trade.requested_pokemon_id
    );

    if (owned) {
      result.push({ ...trade, owned: true, alreadyGiven: false });
    } else {
      result.push({ ...trade, owned: false, alreadyGiven: false });
    }
  });
   
    

  return result;
};

export const useAvailableTrades = (userId?: number) => {
  return useQuery(
    ['availableTrades', userId],
    () => fetchAvailableTrades(userId!),
    {
      enabled: !!userId,
    }
  );
};




