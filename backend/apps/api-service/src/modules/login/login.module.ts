import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
