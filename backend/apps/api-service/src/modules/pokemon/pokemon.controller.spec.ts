import { Test, TestingModule } from '@nestjs/testing';
import { PokemonController } from './pokemon.controller';
import { QueueService } from '../queue/queue.service';
import { HttpException } from '@nestjs/common';

describe('PokemonController', () => {
  let controller: PokemonController;
  let queueService: QueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        {
          provide: QueueService,
          useValue: {
            getPokemons: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    queueService = module.get<QueueService>(QueueService);
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
        new HttpException('Error with the backend services', 500),
      );
      expect(queueService.getPokemons).toHaveBeenCalled();
    });
  });
});
