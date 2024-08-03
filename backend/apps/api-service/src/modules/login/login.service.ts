import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sing-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async signIn(data: SignInDto) {
    console.log(data);
  }

  async signUp(data: SignUpDto) {
    const existingUser = await this.usersRepo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException('Email is already registered', 400);
    }

    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.name = data.name;
    user.gender = data.gender;
    await this.usersRepo.save(user);
    return user;
  }
}
