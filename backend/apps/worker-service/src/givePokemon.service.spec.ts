import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GivePokemonService } from './givePokemon.service';
import { OwnedPokemon } from '../../../entities/ownedPokemon.entity';
import { User } from '../../../entities/user.entity';
import { Trades } from '../../../entities/trades.entity';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { Activities } from '../../../entities/activities.entity';
import { Repository } from 'typeorm';

describe('GivePokemonService', () => {
  let service: GivePokemonService;
  let ownedPokemonRepository: jest.Mocked<Repository<OwnedPokemon>>;
  let userRepository: jest.Mocked<Repository<User>>;
  let tradesRepository: jest.Mocked<Repository<Trades>>;
  let registeredPokemonRepository: jest.Mocked<
    Repository<RegisteredPokemonEntity>
  >;

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
        GivePokemonService,
        {
          provide: getRepositoryToken(OwnedPokemon),
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
            findOne: jest.fn(),
            manager: {
              connection: {
                createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
              },
            },
          }),
        },
        {
          provide: getRepositoryToken(RegisteredPokemonEntity),
          useFactory: () => ({
            findOne: jest.fn(),
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
      ],
    }).compile();

    service = module.get<GivePokemonService>(GivePokemonService);
    ownedPokemonRepository = module.get(getRepositoryToken(OwnedPokemon));
    userRepository = module.get(getRepositoryToken(User));
    tradesRepository = module.get(getRepositoryToken(Trades));
    registeredPokemonRepository = module.get(
      getRepositoryToken(RegisteredPokemonEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processGivePokemon', () => {
    it('should process giving a Pokemon successfully and create notifications', async () => {
      const senderId = 1;
      const receptorId = 2;
      const pokemonId = 'poke123';

      userRepository.findOne
        .mockResolvedValueOnce({ id: senderId, name: 'Ash' } as User)
        .mockResolvedValueOnce({ id: receptorId, name: 'Misty' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
        pokemon_name: 'Pikachu',
      } as RegisteredPokemonEntity);
      tradesRepository.findOne.mockResolvedValue({
        completed: false,
      } as Trades);
      ownedPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
        pokemon_owner: senderId.toString(),
      } as OwnedPokemon);

      await service.processGivePokemon(senderId, receptorId, pokemonId);

      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();

      // Check for Trades update
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        Trades,
        expect.objectContaining({ completed: true }),
      );

      // Check for OwnedPokemon update
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        OwnedPokemon,
        expect.objectContaining({
          pokemon_id: pokemonId,
          pokemon_owner: receptorId.toString(),
        }),
      );

      // Check for Activities (notifications) creation
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
        Activities,
        expect.arrayContaining([
          expect.objectContaining({
            description: 'Ash gave you a Pikachu',
            user_id: receptorId,
            is_readed: false,
          }),
          expect.objectContaining({
            description: 'Misty received a Pikachu',
            user_id: senderId,
            is_readed: false,
          }),
        ]),
      );
    });

    it('should throw an error if sender is not found', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);

      await expect(service.processGivePokemon(1, 2, 'poke123')).rejects.toThrow(
        'Sender not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw an error if receptor is not found', async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Ash' } as User)
        .mockResolvedValueOnce(null);

      await expect(service.processGivePokemon(1, 2, 'poke123')).rejects.toThrow(
        'Receptor not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw an error if pokemon is not found', async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Ash' } as User)
        .mockResolvedValueOnce({ id: 2, name: 'Misty' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.processGivePokemon(1, 2, 'poke123')).rejects.toThrow(
        'Pokemon not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw an error if trade is not found', async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Ash' } as User)
        .mockResolvedValueOnce({ id: 2, name: 'Misty' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: 'poke123',
        pokemon_name: 'Pikachu',
      } as RegisteredPokemonEntity);
      tradesRepository.findOne.mockResolvedValue(null);

      await expect(service.processGivePokemon(1, 2, 'poke123')).rejects.toThrow(
        'Trade not found',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should throw an error if sender does not have the pokemon', async () => {
      userRepository.findOne
        .mockResolvedValueOnce({ id: 1, name: 'Ash' } as User)
        .mockResolvedValueOnce({ id: 2, name: 'Misty' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: 'poke123',
        pokemon_name: 'Pikachu',
      } as RegisteredPokemonEntity);
      tradesRepository.findOne.mockResolvedValue({
        completed: false,
      } as Trades);
      ownedPokemonRepository.findOne.mockResolvedValue(null);

      await expect(service.processGivePokemon(1, 2, 'poke123')).rejects.toThrow(
        'Sender does not have that pokemon',
      );
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction if something goes wrong', async () => {
      const senderId = 1;
      const receptorId = 2;
      const pokemonId = 'poke123';

      userRepository.findOne
        .mockResolvedValueOnce({ id: senderId, name: 'Ash' } as User)
        .mockResolvedValueOnce({ id: receptorId, name: 'Misty' } as User);
      registeredPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
        pokemon_name: 'Pikachu',
      } as RegisteredPokemonEntity);
      tradesRepository.findOne.mockResolvedValue({
        completed: false,
      } as Trades);
      ownedPokemonRepository.findOne.mockResolvedValue({
        pokemon_id: pokemonId,
        pokemon_owner: senderId.toString(),
      } as OwnedPokemon);

      mockQueryRunner.manager.save.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.processGivePokemon(senderId, receptorId, pokemonId),
      ).rejects.toThrow('Database error');

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
