import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [QueueModule],
  controllers: [PokemonController],
})
export class PokemonModule {}
