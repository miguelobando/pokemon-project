import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnedPokemon } from '../../../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../../../entities/registeredPokemon.entity';
import { Repository } from 'typeorm';
import { Trades } from '../../../../../entities/trades.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(OwnedPokemon)
    private readonly ownedPokemonRepository: Repository<OwnedPokemon>,
    @InjectRepository(RegisteredPokemonEntity)
    private readonly registeredPokemonRepository: Repository<RegisteredPokemonEntity>,
    @InjectRepository(Trades)
    private readonly tradesRepository: Repository<Trades>,
  ) {}

  async getOwnedPokemons(id: number) {
    try {
      const ownedPokemons = await this.ownedPokemonRepository.find({
        where: { pokemon_owner: id.toString() },
      });

      const getPokemonDetails = async (pokemonId: string) => {
        const pokemon = await this.registeredPokemonRepository.findOne({
          where: { pokemon_id: pokemonId },
        });
        return pokemon;
      };

      const pokemons = await Promise.all(
        ownedPokemons.map(async (ownedPokemon) => {
          const pokemon = await getPokemonDetails(ownedPokemon.pokemon_id);
          return {
            pokemon_id: pokemon.pokemon_id,
            pokemon_name: pokemon.pokemon_name,
            pokemon_type: pokemon.pokemon_type,
            pokemon_sprite: pokemon.pokemon_sprite,
          };
        }),
      );

      return pokemons;
    } catch (error) {
      console.error('Error getting owned pokemons:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }

  async getAvailableTrades(): Promise<Trades[]> {
    try {
      // Get all trades that are not completed
      const trades = await this.tradesRepository.find({
        where: { completed: false },
      });

      return trades;
    } catch (error) {
      console.error('Error getting available trades:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }

  async getAskedPokemons(id: number) {
    try {
      const askedPokemons = await this.tradesRepository.find({
        where: { trader_id: id, completed: false },
        select: ['requested_pokemon_id'],
      });

      return askedPokemons;
    } catch (error) {
      console.error('Error getting asked pokemons:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }
}
