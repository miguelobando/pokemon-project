import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RequestTradeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsString()
  pokemonId: string;
}
