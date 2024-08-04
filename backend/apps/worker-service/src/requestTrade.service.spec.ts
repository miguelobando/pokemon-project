import { Test, TestingModule } from '@nestjs/testing';
import { RequestTradeService } from './requestTrade.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { User } from '../../../entities/user.entity';
import { Trades } from '../../../entities/trades.entity';
import { Activities } from '../../../entities/activities.entity';
import { OwnedPokemon } from '../../../entities/ownedPokemon.entity';
import { Repository } from 'typeorm';

describe('RequestTradeService', () => {
  let service: RequestTradeService;
  let registeredPokemonRepository: jest.Mocked<
    Repository<RegisteredPokemonEntity>
  >;
  let userRepository: jest.Mocked<Repository<User>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let tradesRepository: jest.Mocked<Repository<Trades>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let activitiesRepository: jest.Mocked<Repository<Activities>>;
  let ownedPokemonRepository: jest.Mocked<Repository<OwnedPokemon>>;

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestTradeService,
        {
          provide: getRepositoryToken(RegisteredPokemonEntity),
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(User),
          useFactory: () => ({
            findOne: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(Trades),
          useFactory: () => ({
            manager: {
              connection: {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
              },
            },
          }),
        },
        {
          provide: getRepositoryToken(Activities),
          useFactory: () => ({
            manager: {
              connection: {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
              },
            },
          }),
        },
        {
          provide: getRepositoryToken(OwnedPokemon),
          useFactory: () => ({
            find: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<RequestTradeService>(RequestTradeService);
    registeredPokemonRepository = module.get(
      getRepositoryToken(RegisteredPokemonEntity),
    );
    userRepository = module.get(getRepositoryToken(User));
    tradesRepository = module.get(getRepositoryToken(Trades));
    activitiesRepository = module.get(getRepositoryToken(Activities));
    ownedPokemonRepository = module.get(getRepositoryToken(OwnedPokemon));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processRequestTrade', () => {
    it('should process a trade request successfully', async () => {
      const userId = 1;
      const pokemonId = 'poke123';

      userRepository.findOne.mockResolvedValue({
        id: userId,
        name: 'Ash',
      } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
      } as RegisteredPokemonEntity);
      jest.spyOn(service, 'notifyUsers').mockResolvedValue();

      const result = await service.processRequestTrade(userId, pokemonId);

      expect(result).toEqual({ success: true });
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.any(Trades),
      );
      expect(service.notifyUsers).toHaveBeenCalledWith(pokemonId, 'Ash');
    });

    it('should throw an error if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.processRequestTrade(1, 'poke123')).rejects.toThrow(
        'User not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw an error if pokemon is not found', async () => {
      userRepository.findOne.mockResolvedValue({ id: 1, name: 'Ash' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.processRequestTrade(1, 'poke123')).rejects.toThrow(
        'Pokemon not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction if an error occurs after saving the trade', async () => {
      const userId = 1;
      const pokemonId = 'poke123';

      userRepository.findOne.mockResolvedValue({
        id: userId,
        name: 'Ash',
      } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
      } as RegisteredPokemonEntity);

      // Mock the save operation to succeed
      mockQueryRunner.manager.save.mockResolvedValue(new Trades());

      // Mock the notifyUsers method to throw an error
      jest
        .spyOn(service, 'notifyUsers')
        .mockRejectedValue(new Error('Notification failed'));

      await expect(
        service.processRequestTrade(userId, pokemonId),
      ).rejects.toThrow('Notification failed');

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.any(Trades),
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe('notifyUsers', () => {
    it('should notify users successfully', async () => {
      const pokemonId = 'poke123';
      const userName = 'Ash';

      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
        pokemon_name: 'Pikachu',
      } as RegisteredPokemonEntity);
      ownedPokemonRepository.find.mockResolvedValue([
        { pokemon_owner: '1' },
        { pokemon_owner: '2' },
      ] as OwnedPokemon[]);

      await service.notifyUsers(pokemonId, userName);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledTimes(2);
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Ash wants a Pikachu',
          is_readed: false,
        }),
      );
    });

    it('should handle errors and rollback transaction', async () => {
      registeredPokemonRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      await service.notifyUsers('poke123', 'Ash');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
