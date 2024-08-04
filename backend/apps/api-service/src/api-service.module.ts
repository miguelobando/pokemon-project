import { Module } from '@nestjs/common';
import { ApiServiceController } from './api-service.controller';
import { ApiServiceService } from './api-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginModule } from './modules/login/login.module';
import { User } from '../../../entities/user.entity';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { QueueModule } from './modules/queue/queue.module';
import { OwnedPokemon } from 'entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from 'entities/registeredPokemon.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, OwnedPokemon, RegisteredPokemonEntity],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    LoginModule,
    PokemonModule,
    QueueModule,
  ],
  controllers: [ApiServiceController],
  providers: [ApiServiceService],
})
export class ApiServiceModule {}
