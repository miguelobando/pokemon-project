import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SingUpDto {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
