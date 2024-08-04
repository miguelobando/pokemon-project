import { Test, TestingModule } from '@nestjs/testing';
import { AssignPokemonsService } from './assignPokemons.service';
import { getPokemonsService } from './getPokemons.service';
import { Repository } from 'typeorm';
import { OwnedPokemon } from '../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../entities/registeredPokemon.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

describe('AssignPokemonsService', () => {
  let service: AssignPokemonsService;
  let registeredPokemonRepository: Repository<RegisteredPokemonEntity>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let ownedPokemonRepository: Repository<OwnedPokemon>;
  let getPokemonsWorkerServiceMock: jest.Mocked<getPokemonsService>;
  let dataSource: DataSource;
  let queryRunner: any;

  beforeEach(async () => {
    queryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        save: jest.fn(),
      },
    };

    dataSource = {
      createQueryRunner: jest.fn().mockReturnValue(queryRunner),
    } as any;

    getPokemonsWorkerServiceMock = {
      processGetAllPokemon: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignPokemonsService,
        {
          provide: getRepositoryToken(RegisteredPokemonEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OwnedPokemon),
          useClass: Repository,
        },
        {
          provide: getPokemonsService,
          useValue: getPokemonsWorkerServiceMock,
        },
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    service = module.get<AssignPokemonsService>(AssignPokemonsService);
    registeredPokemonRepository = module.get<
      Repository<RegisteredPokemonEntity>
    >(getRepositoryToken(RegisteredPokemonEntity));
    ownedPokemonRepository = module.get<Repository<OwnedPokemon>>(
      getRepositoryToken(OwnedPokemon),
    );

    // Mock console.log and console.error
    jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn());
    jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processAssignPokemonsToUser', () => {
    it('should fetch pokemons if database is empty and assign them to the user', async () => {
      jest
        .spyOn(registeredPokemonRepository, 'count')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(10);
      jest
        .spyOn(registeredPokemonRepository, 'createQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue({ pokemon_id: '1' }),
        } as any);

      await service.processAssignPokemonsToUser(1);

      expect(
        getPokemonsWorkerServiceMock.processGetAllPokemon,
      ).toHaveBeenCalled();
      expect(registeredPokemonRepository.count).toHaveBeenCalledTimes(2);
      expect(queryRunner.manager.save).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should assign pokemons to the user if database is not empty', async () => {
      jest.spyOn(registeredPokemonRepository, 'count').mockResolvedValue(10);
      jest
        .spyOn(registeredPokemonRepository, 'createQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue({ pokemon_id: '1' }),
        } as any);

      await service.processAssignPokemonsToUser(1);

      expect(
        getPokemonsWorkerServiceMock.processGetAllPokemon,
      ).not.toHaveBeenCalled();
      expect(registeredPokemonRepository.count).toHaveBeenCalledTimes(1);
      expect(queryRunner.manager.save).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });
  });

  describe('assignPokemonsToUser', () => {
    it('should save pokemons and commit transaction', async () => {
      const pokemonsIdToAssign = [0, 1, 2];
      jest
        .spyOn(registeredPokemonRepository, 'createQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue({ pokemon_id: '1' }),
        } as any);

      await service.assignPokemonsToUser(1, pokemonsIdToAssign);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.save).toHaveBeenCalled();
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
    });

    it('should rollback transaction if there is an error', async () => {
      const pokemonsIdToAssign = [0, 1, 2];
      jest
        .spyOn(registeredPokemonRepository, 'createQueryBuilder')
        .mockReturnValue({
          orderBy: jest.fn().mockReturnThis(),
          offset: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockRejectedValue(new Error('Test error')),
        } as any);

      await expect(
        service.assignPokemonsToUser(1, pokemonsIdToAssign),
      ).rejects.toThrow('Test error');

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
