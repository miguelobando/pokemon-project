import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { QueueService } from '../queue/queue.service';
import { PokemonService } from './pokemon.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RequestTradeDto } from './dto/requestTrade.dto';
import { validate } from 'class-validator';

describe('PokemonController', () => {
  let controller: PokemonController;
  let queueService: QueueService;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: QueueService,
          useValue: {
            getPokemons: jest.fn(),
            requestTrade: jest.fn(),
          },
        },
        {
          provide: PokemonService,
          useValue: {
            getOwnedPokemons: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    queueService = module.get<QueueService>(QueueService);
    pokemonService = module.get<PokemonService>(PokemonService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return pokemons when queueService.getPokemons is successful', async () => {
      const mockPokemons = [{ name: 'bulbasaur' }];
      jest.spyOn(queueService, 'getPokemons').mockResolvedValue(mockPokemons);

      const result = await controller.findAll();

      expect(result).toEqual(mockPokemons);
      expect(queueService.getPokemons).toHaveBeenCalled();
    });

    it('should throw an HttpException when queueService.getPokemons fails', async () => {
      jest
        .spyOn(queueService, 'getPokemons')
        .mockRejectedValue(new Error('Test error'));

      await expect(controller.findAll()).rejects.toThrow(HttpException);
      await expect(controller.findAll()).rejects.toEqual(
        new HttpException(
          'Error with the backend services',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(queueService.getPokemons).toHaveBeenCalled();
    });
  });

  describe('findOwned', () => {
    it('should return owned pokemons when pokemonService.getOwnedPokemons is successful', async () => {
      const mockOwnedPokemons = [
        {
          pokemon_id: '1',
          pokemon_name: 'Bulbasaur',
          pokemon_type: 'grass',
          pokemon_sprite: 'bulbasaur.png',
        },
      ];
      jest
        .spyOn(pokemonService, 'getOwnedPokemons')
        .mockResolvedValue(mockOwnedPokemons);

      const result = await controller.findOwned(1);

      expect(result).toEqual(mockOwnedPokemons);
      expect(pokemonService.getOwnedPokemons).toHaveBeenCalledWith(1);
    });

    it('should throw an HttpException when pokemonService.getOwnedPokemons fails', async () => {
      jest
        .spyOn(pokemonService, 'getOwnedPokemons')
        .mockRejectedValue(new Error('Test error'));

      await expect(controller.findOwned(1)).rejects.toThrow(HttpException);
      await expect(controller.findOwned(1)).rejects.toEqual(
        new HttpException(
          'Error with the backend services',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
      expect(pokemonService.getOwnedPokemons).toHaveBeenCalledWith(1);
    });
  });

  describe('requestTrade', () => {
    it('should return result when requestTrade is successful', async () => {
      const requestTradeDto: RequestTradeDto = {
        userId: 1,
        pokemonId: '1',
      };
      const expectedResult = { success: true };

      jest
        .spyOn(queueService, 'requestTrade')
        .mockResolvedValue(expectedResult);

      const result = await controller.requestTrade(requestTradeDto);

      expect(result).toEqual(expectedResult);
      expect(queueService.requestTrade).toHaveBeenCalledWith(
        requestTradeDto.userId,
        requestTradeDto.pokemonId,
      );
    });

    it('should throw an HttpException if requestTrade fails', async () => {
      const requestTradeDto: RequestTradeDto = {
        userId: 1,
        pokemonId: '1',
      };

      jest
        .spyOn(queueService, 'requestTrade')
        .mockRejectedValue(new Error('Test error'));

      await expect(controller.requestTrade(requestTradeDto)).rejects.toThrow(
        HttpException,
      );
      await expect(controller.requestTrade(requestTradeDto)).rejects.toEqual(
        new HttpException(
          'Error with the backend services',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(queueService.requestTrade).toHaveBeenCalledWith(
        requestTradeDto.userId,
        requestTradeDto.pokemonId,
      );
    });

    it('should validate RequestTradeDto correctly', async () => {
      const invalidDto1: any = {
        userId: null,
        pokemonId: '1',
      };
      const invalidDto2: any = {
        userId: 1,
        pokemonId: '',
      };
      const validDto: RequestTradeDto = {
        userId: 1,
        pokemonId: '1',
      };

      let errors = await validate(
        Object.assign(new RequestTradeDto(), invalidDto1),
      );
      expect(errors.length).toBeGreaterThan(0);

      errors = await validate(
        Object.assign(new RequestTradeDto(), invalidDto2),
      );
      expect(errors.length).toBeGreaterThan(0);

      errors = await validate(validDto);
      expect(errors.length).toEqual(0);
    });
  });
});
