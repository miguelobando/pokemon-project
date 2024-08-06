import { HttpException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sing-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { QueueService } from '../queue/queue.service';
import { sign } from 'jsonwebtoken';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly queueService: QueueService,
  ) {}

  async findByEmailAndId(email: string, id: number) {
    const result = this.usersRepo.findOne({ where: { email, id } });
    if (!result) {
      return false;
    } else {
      return true;
    }
  }

  async signIn(data: SignInDto) {
    const user = await this.usersRepo.findOne({
      where: { email: data.email, password: data.password },
    });
    if (!user) {
      throw new HttpException('Invalid email or password', 400);
    }

    const payload = { userId: user.id, email: user.email };
    const token = sign(payload, 'secret', { expiresIn: '1h' });
    return { user, token };
  }

  async signUp(data: SignUpDto) {
    const existingUser = await this.usersRepo.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new HttpException('Email is already registered', 400);
    }
    let id: number;
    try {
      const user = new User();
      user.email = data.email;
      user.password = data.password;
      user.name = data.name;
      user.gender = data.gender;
      const userCreated = await this.usersRepo.save(user);
      id = userCreated.id;
      await this.queueService.assignPokemonsToUser(userCreated.id);
      return user;
    } catch (error) {
      await this.usersRepo.delete(id);
      console.error('Error creating user:', error);
      throw new HttpException('Error creating user', 500);
    }
  }
}
