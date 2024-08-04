import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { WorkerProcessor } from './worker.processor';
import { getPokemonsService } from './getPokemons.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegisteredPokemonEntity } from 'entities/registeredPokemon.entity';
import { AssignPokemonsService } from './assignPokemons.service';
import { OwnedPokemon } from 'entities/ownedPokemon.entity';
import { RequestTradeService } from './requestTrade.service';
import { Activities } from 'entities/activities.entity';
import { Trades } from 'entities/trades.entity';
import { User } from 'entities/user.entity';
import { GivePokemonService } from './givePokemon.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
      isGlobal: true,
    }),
    HttpModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          RegisteredPokemonEntity,
          OwnedPokemon,
          Trades,
          Activities,
          User,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'task-queue',
    }),
    TypeOrmModule.forFeature([
      RegisteredPokemonEntity,
      OwnedPokemon,
      Trades,
      Activities,
      User,
    ]),
  ],
  providers: [
    WorkerProcessor,
    getPokemonsService,
    AssignPokemonsService,
    RequestTradeService,
    GivePokemonService,
  ],
  exports: [getPokemonsService],
})
export class WorkerServiceModule {}
