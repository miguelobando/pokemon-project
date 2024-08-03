import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { SingUpDto } from './dto/sing-up.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() singUpDto: SingUpDto) {
    return this.loginService.signUp(singUpDto);
  }
}
