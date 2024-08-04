import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OwnedPokemon } from '../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { DataSource, Repository } from 'typeorm';
import { getPokemonsService } from './getPokemons.service';

@Injectable()
export class AssignPokemonsService {
  constructor(
    @InjectRepository(RegisteredPokemonEntity)
    private readonly registeredPokemonRepository: Repository<RegisteredPokemonEntity>,
    private readonly getPokemonsWorkerService: getPokemonsService,
    private readonly dataSource: DataSource,
  ) {}
  async processAssignPokemonsToUser(id: number) {
    // Check if ther are pokemons in the database
    let pokemonCount = await this.registeredPokemonRepository.count();
    const pokemonsIdToAssign: number[] = [];

    if (pokemonCount === 0) {
      await this.getPokemonsWorkerService.processGetAllPokemon();
      // Retry the pokemon count
      pokemonCount = await this.registeredPokemonRepository.count();
    }

    // Assign random pokemons to the user
    for (let i = 0; i < 3; i++) {
      const randomPokemon = Math.floor(Math.random() * pokemonCount);
      pokemonsIdToAssign.push(randomPokemon);
    }

    await this.assignPokemonsToUser(id, pokemonsIdToAssign);
  }

  async assignPokemonsToUser(id: number, pokemonsIdToAssign: number[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const ownedPokemons = await Promise.all(
        pokemonsIdToAssign.map(async (pokemonId) => {
          const pokemon = await this.registeredPokemonRepository
            .createQueryBuilder()
            .orderBy('pokemon_id')
            .offset(pokemonId)
            .limit(1)
            .getOne();

          if (!pokemon) {
            throw new Error(`Pokemon at position ${pokemonId} not found`);
          }

          const ownedPokemon = new OwnedPokemon();
          ownedPokemon.pokemon_id = pokemon.pokemon_id;
          ownedPokemon.pokemon_owner = id.toString();
          return ownedPokemon;
        }),
      );

      await queryRunner.manager.save(OwnedPokemon, ownedPokemons);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error assigning Pokemons to user, rolling back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
