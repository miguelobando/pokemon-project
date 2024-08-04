import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { Repository } from 'typeorm';
import { OwnedPokemon } from '../../../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../../../entities/registeredPokemon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';
import { Trades } from '../../../../../entities/trades.entity';

describe('PokemonService', () => {
  let service: PokemonService;
  let ownedPokemonRepository: jest.Mocked<Repository<OwnedPokemon>>;
  let registeredPokemonRepository: jest.Mocked<
    Repository<RegisteredPokemonEntity>
  >;
  let tradesRepository: jest.Mocked<Repository<Trades>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: getRepositoryToken(OwnedPokemon),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(RegisteredPokemonEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Trades),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    ownedPokemonRepository = module.get<Repository<OwnedPokemon>>(
      getRepositoryToken(OwnedPokemon),
    ) as jest.Mocked<Repository<OwnedPokemon>>;
    registeredPokemonRepository = module.get<
      Repository<RegisteredPokemonEntity>
    >(getRepositoryToken(RegisteredPokemonEntity)) as jest.Mocked<
      Repository<RegisteredPokemonEntity>
    >;
    tradesRepository = module.get<Repository<Trades>>(
      getRepositoryToken(Trades),
    ) as jest.Mocked<Repository<Trades>>;

    // Avoid console.log and console.error in tests
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOwnedPokemons', () => {
    it('should return owned pokemons with details', async () => {
      const ownerId = 1;
      const ownedPokemons = [
        { pokemon_id: '1', pokemon_owner: ownerId.toString() },
        { pokemon_id: '2', pokemon_owner: ownerId.toString() },
      ];
      const registeredPokemons = [
        {
          pokemon_id: '1',
          pokemon_name: 'Bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        },
        {
          pokemon_id: '2',
          pokemon_name: 'Charmander',
          pokemon_type: 'fire',
          pokemon_sprite: 'charmander.png',
        },
      ];

      jest
        .spyOn(ownedPokemonRepository, 'find')
        .mockResolvedValue(ownedPokemons as OwnedPokemon[]);
      jest
        .spyOn(registeredPokemonRepository, 'findOne')
        .mockImplementation(
          async (options: { where: { pokemon_id: string } }) => {
            const { pokemon_id } = options.where;
            return registeredPokemons.find(
              (pokemon) => pokemon.pokemon_id === pokemon_id,
            ) as RegisteredPokemonEntity;
          },
        );

      const result = await service.getOwnedPokemons(ownerId);

      expect(result).toEqual([
        {
          pokemon_id: '1',
          pokemon_name: 'Bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        },
        {
          pokemon_id: '2',
          pokemon_name: 'Charmander',
          pokemon_type: 'fire',
          pokemon_sprite: 'charmander.png',
        },
      ]);
      expect(ownedPokemonRepository.find).toHaveBeenCalledWith({
        where: { pokemon_owner: ownerId.toString() },
      });
      expect(registeredPokemonRepository.findOne).toHaveBeenCalledTimes(2);
    });

    it('should throw an HttpException if there is an error', async () => {
      jest
        .spyOn(ownedPokemonRepository, 'find')
        .mockRejectedValue(new Error('Test error'));
      jest.spyOn(registeredPokemonRepository, 'findOne');

      await expect(service.getOwnedPokemons(1)).rejects.toThrow(HttpException);
      await expect(service.getOwnedPokemons(1)).rejects.toEqual(
        new HttpException('Error with the backend services', 500),
      );

      expect(ownedPokemonRepository.find).toHaveBeenCalled();
      expect(registeredPokemonRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('getAvailableTrades', () => {
    it('should return available trades', async () => {
      const trades = [
        {
          exchange_id: 1,
          requested_pokemon_id: '1',
          trader_id: 1,
          completed: false,
        },
        {
          exchange_id: 2,
          requested_pokemon_id: '2',
          trader_id: 2,
          completed: false,
        },
      ];

      jest
        .spyOn(tradesRepository, 'find')
        .mockResolvedValue(trades as Trades[]);

      const result = await service.getAvailableTrades();

      expect(result).toEqual(trades);
      expect(tradesRepository.find).toHaveBeenCalledWith({
        where: { completed: false },
      });
    });

    it('should throw an HttpException if there is an error', async () => {
      jest
        .spyOn(tradesRepository, 'find')
        .mockRejectedValue(new Error('Test error'));

      await expect(service.getAvailableTrades()).rejects.toThrow(HttpException);
      await expect(service.getAvailableTrades()).rejects.toEqual(
        new HttpException('Error with the backend services', 500),
      );

      expect(tradesRepository.find).toHaveBeenCalled();
    });
  });
});
