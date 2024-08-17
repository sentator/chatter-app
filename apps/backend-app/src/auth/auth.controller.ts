import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import {
  SigninBodyDto,
  signinBodySchema,
  SignupBodyDto,
  signupBodySchema,
} from './dto/auth.dto';
import { AUTH_COOKIES_MAX_AGE } from '../constants';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { User } from '../decorators/user.decorator';
import { UserJwtPayload } from '../types';
import { extractTokenFromHeader } from '../utils';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signupBodySchema))
  async signup(@Body() dto: SignupBodyDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signup(dto);
    res.cookie('refreshToken', refreshToken, {
      maxAge: AUTH_COOKIES_MAX_AGE,
      httpOnly: true,
    });
    res.json({ accessToken });
  }

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signinBodySchema))
  async signin(@Body() dto: SigninBodyDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.signin(dto);
    res.cookie('refreshToken', refreshToken, {
      maxAge: AUTH_COOKIES_MAX_AGE,
      httpOnly: true,
    });
    res.json({ accessToken });
  }

  @Post('signout')
  @UseGuards(AccessTokenGuard)
  signout(@Req() req: Request, @User() user: UserJwtPayload) {
    const accessToken = extractTokenFromHeader(req);
    return this.authService.signout({ userId: user.userId, accessToken });
  }

  @Get('refresh')
  refresh() {
    return;
  }
}
