import { HttpException, Injectable } from '@nestjs/common';
import { SingUpDto } from './dto/sing-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async signUp(data: SingUpDto) {
    const existingUser = await this.usersRepo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException('Email is already registered', 400);
    }

    const user = new User();
    user.email = data.email;
    user.password = data.password;
    await this.usersRepo.save(user);
    return user;
  }
}