import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GivePokemonDto {
  @IsNumber()
  @IsNotEmpty()
  senderId: number;
  @IsNumber()
  @IsNotEmpty()
  receptorId: number;
  @IsNotEmpty()
  @IsString()
  pokemonId: string;
}
