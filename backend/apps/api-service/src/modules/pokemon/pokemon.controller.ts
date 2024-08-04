import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { QueueService } from '../queue/queue.service';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly queueService: QueueService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    try {
      const result = await this.queueService.getPokemons();
      return result;
    } catch (error) {
      console.error('Error getting pokemons:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }
}
