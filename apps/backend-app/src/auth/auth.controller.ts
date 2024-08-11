import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import {
  SigninBodyDto,
  signinBodySchema,
  SignupBodyDto,
  signupBodySchema,
} from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupBodySchema))
  signup(@Body() dto: SignupBodyDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinBodySchema))
  signin(@Body() dto: SigninBodyDto) {
    return this.authService.signin(dto);
  }

  @Post('signout')
  signout() {
    return 'signout';
  }
}
