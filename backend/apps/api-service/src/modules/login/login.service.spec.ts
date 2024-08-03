import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginService } from './login.service';
import { User } from '../../entities/user.entity';
import { SingUpDto } from './dto/sing-up.dto';
import { HttpException } from '@nestjs/common';

describe('LoginService', () => {
  let service: LoginService;
  let usersRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
    usersRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw an error if user already exists', async () => {
      const signUpDto: SingUpDto = {
        email: 'test@example.com',
        password: 'password',
      };

      const userMocked = new User();
      userMocked.email = signUpDto.email;
      userMocked.password = signUpDto.password;

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(userMocked);

      await expect(service.signUp(signUpDto)).rejects.toThrow(HttpException);
      await expect(service.signUp(signUpDto)).rejects.toThrow(
        'Email is already registered',
      );
    });

    it('should create a new user if email is not registered', async () => {
      const signUpDto: SingUpDto = {
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(usersRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(usersRepo, 'save').mockResolvedValueOnce(signUpDto as any);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual(signUpDto);
      expect(usersRepo.save).toHaveBeenCalledWith(
        expect.objectContaining(signUpDto),
      );
    });
  });
});