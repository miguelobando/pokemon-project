import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../../../../entities/user.entity';
import { QueueModule } from '../queue/queue.module';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), QueueModule],
  providers: [LoginService],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}
