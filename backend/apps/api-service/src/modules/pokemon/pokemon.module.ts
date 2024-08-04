import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { QueueModule } from '../queue/queue.module';
import { PokemonService } from './pokemon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnedPokemon } from '../../../../../entities/ownedPokemon.entity';
import { RegisteredPokemonEntity } from '../../../../../entities/registeredPokemon.entity';
import { Trades } from '../../../../../entities/trades.entity';

@Module({
  imports: [
    QueueModule,
    TypeOrmModule.forFeature([OwnedPokemon, RegisteredPokemonEntity, Trades]),
  ],
  controllers: [PokemonController],
  providers: [PokemonService],
})
export class PokemonModule {}
