import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PokemonApiResponse } from './interfaces/apiResponse';
import { AxiosResponse } from 'axios';
import { PokemonDetails } from './interfaces/pokemonDetails';
import { RegisteredPokemon } from './interfaces/registeredPokemon';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

const API_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=25&offset=0';

@Injectable()
export class getPokemonsWorkerService {
  constructor(
    @InjectRepository(RegisteredPokemonEntity)
    private readonly registeredPokemonRepository: Repository<RegisteredPokemonEntity>,
    private readonly httpService: HttpService,
    private readonly dataSource: DataSource,
  ) {}

  async processGetAllPokemon(): Promise<any> {
    const pokemonCount = await this.registeredPokemonRepository.count();

    // Check if there are no pokemons in the database
    if (pokemonCount === 0) {
      const response: AxiosResponse<PokemonApiResponse> = await lastValueFrom(
        this.httpService.get<PokemonApiResponse>(API_URL),
      );

      const data: PokemonApiResponse = response.data;
      const procesedData = await this.GetPokemonDetailsFromApi(data);
      await this.insertIntoDatabase(procesedData);
      return procesedData;
    }

    // Else return the pokemons from the database
    const pokemons = await this.registeredPokemonRepository.find();
    return pokemons;
  }

  async GetPokemonDetailsFromApi(
    data: PokemonApiResponse,
  ): Promise<RegisteredPokemon[]> {
    const pokemonPromises = data.results.map(async (pokemon_item) => {
      try {
        const response: AxiosResponse<PokemonDetails> = await lastValueFrom(
          this.httpService.get<PokemonDetails>(pokemon_item.url),
        );
        const dataToInsert = response.data;
        return {
          pokemon_id: dataToInsert.id.toString(),
          pokemon_name: dataToInsert.name,
          pokemon_type: dataToInsert.types[0].type.name,
          pokemon_sprite: dataToInsert.sprites.front_default,
        };
      } catch (error) {
        console.error(
          `Error fetching details for ${pokemon_item.name}:`,
          error,
        );
        return null;
      }
    });

    const results = await Promise.all(pokemonPromises);
    return results.filter(
      (result): result is RegisteredPokemon => result !== null,
    );
  }

  async insertIntoDatabase(data: RegisteredPokemonEntity[]) {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      await queryRunner.manager.save(RegisteredPokemonEntity, data);
      await queryRunner.commitTransaction();
      console.log(`${data.length} Pokemons saved successfully.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error saving Pokemons in batch, rolling back:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
