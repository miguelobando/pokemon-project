import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  HttpException,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { QueueService } from '../queue/queue.service';
import { PokemonService } from './pokemon.service';
import { RequestTradeDto } from './dto/requestTrade.dto';
import { GivePokemonDto } from './dto/givePokemon.dto';

@Controller('pokemons')
export class PokemonController {
  constructor(
    private readonly queueService: QueueService,
    private readonly pokemonService: PokemonService,
  ) {}

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

  @Get('owned')
  @HttpCode(HttpStatus.OK)
  async findOwned(@Query('id') id: number) {
    try {
      const result = await this.pokemonService.getOwnedPokemons(id);
      return result;
    } catch (error) {
      console.error('Error getting owned pokemons:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }

  @Post('request-trade')
  @HttpCode(HttpStatus.OK)
  async requestTrade(@Body() requestTradeDto: RequestTradeDto) {
    try {
      const result = await this.queueService.requestTrade(
        requestTradeDto.userId,
        requestTradeDto.pokemonId,
      );
      return result;
    } catch (error) {
      console.error('Error requesting trade:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }

  @Post('give-pokemon')
  @HttpCode(HttpStatus.OK)
  async givePokemon(@Body() givePokemonDto: GivePokemonDto) {
    try {
      const result = await this.queueService.givePokemon(
        givePokemonDto.senderId,
        givePokemonDto.receptorId,
        givePokemonDto.pokemonId,
      );
      return result;
    } catch (error) {
      console.error('Error giving pokemon:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }

  @Get('available-trades')
  @HttpCode(HttpStatus.OK)
  async getAvailableTrades() {
    try {
      const result = await this.pokemonService.getAvailableTrades();
      return result;
    } catch (error) {
      console.error('Error getting available trades:', error);
      throw new HttpException('Error with the backend services', 500);
    }
  }
}
