// src/worker/getPokemonsWorker.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { getPokemonsWorkerService } from './getPokemonsWorker.service';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { PokemonApiResponse } from './interfaces/apiResponse';
import { PokemonDetails } from './interfaces/pokemonDetails';

describe('GetPokemonsWorkerService', () => {
  let service: getPokemonsWorkerService;
  let httpService: HttpService;
  let repository: Repository<RegisteredPokemonEntity>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        getPokemonsWorkerService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RegisteredPokemonEntity),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {
                save: jest.fn(),
              },
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<getPokemonsWorkerService>(getPokemonsWorkerService);
    httpService = module.get<HttpService>(HttpService);
    repository = module.get<Repository<RegisteredPokemonEntity>>(
      getRepositoryToken(RegisteredPokemonEntity),
    );
    dataSource = module.get<DataSource>(DataSource);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processGetAllPokemon', () => {
    it('should fetch and process all pokemons if database is empty', async () => {
      jest.spyOn(repository, 'count').mockResolvedValue(0);

      const apiResponse: AxiosResponse<PokemonApiResponse> = {
        data: {
          results: [
            { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          ],
          count: 0,
          next: '',
          previous: undefined,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      const pokemonDetailsResponse: AxiosResponse<PokemonDetails> = {
        data: {
          id: 1,
          name: 'bulbasaur',
          types: [
            {
              type: {
                name: 'grass',
                url: '',
              },
              slot: 0,
            },
          ],
          sprites: {
            front_default: 'bulbasaur.png',
            back_default: '',
            back_female: undefined,
            back_shiny: '',
            back_shiny_female: undefined,
            front_female: undefined,
            front_shiny: '',
            front_shiny_female: undefined,
            other: undefined,
            versions: undefined,
          },
          abilities: [],
          base_experience: 0,
          cries: undefined,
          forms: [],
          game_indices: [],
          height: 0,
          held_items: [],
          is_default: false,
          location_area_encounters: '',
          moves: [],
          order: 0,
          past_abilities: [],
          past_types: [],
          species: undefined,
          stats: [],
          weight: 0,
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => of(apiResponse))
        .mockImplementationOnce(() => of(pokemonDetailsResponse));

      const result = await service.processGetAllPokemon();

      expect(result).toEqual([
        {
          pokemon_id: '1',
          pokemon_name: 'bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        },
      ]);

      expect(httpService.get).toHaveBeenCalledTimes(2);
      expect(repository.count).toHaveBeenCalled();
    });

    it('should return pokemons from the database if not empty', async () => {
      const pokemons = [
        {
          pokemon_id: '1',
          pokemon_name: 'bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        } as RegisteredPokemonEntity,
      ];

      jest.spyOn(repository, 'count').mockResolvedValue(1);
      jest.spyOn(repository, 'find').mockResolvedValue(pokemons);

      const result = await service.processGetAllPokemon();

      expect(result).toEqual(pokemons);
      expect(httpService.get).not.toHaveBeenCalled();
      expect(repository.count).toHaveBeenCalled();
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('insertIntoDatabase', () => {
    it('should insert pokemons into the database in a transaction', async () => {
      const data: RegisteredPokemonEntity[] = [
        {
          pokemon_id: '1',
          pokemon_name: 'bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        } as RegisteredPokemonEntity,
      ];

      await service.insertIntoDatabase(data);

      const queryRunner = dataSource.createQueryRunner();

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.save).toHaveBeenCalledWith(
        RegisteredPokemonEntity,
        data,
      );
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });

    it('should rollback transaction on error', async () => {
      const data: RegisteredPokemonEntity[] = [
        {
          pokemon_id: '1',
          pokemon_name: 'bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        } as RegisteredPokemonEntity,
      ];

      const queryRunner = dataSource.createQueryRunner();
      jest
        .spyOn(queryRunner.manager, 'save')
        .mockRejectedValueOnce(new Error('Test error'));

      await expect(service.insertIntoDatabase(data)).rejects.toThrow(
        'Test error',
      );

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
