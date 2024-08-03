import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { SignUpDto } from './dto/sing-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async singUp(@Body() singUpDto: SignUpDto) {
    return this.loginService.signUp(singUpDto);
  }

  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto) {
    return this.loginService.signIn(signInDto);
  }
}
