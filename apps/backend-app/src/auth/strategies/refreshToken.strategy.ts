import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { extractRefreshTokenFromCookies } from '../../utils';

type JwtPayload = {
  sub: number;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractRefreshTokenFromCookies,
      ]),
      secretOrKey: process.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = extractRefreshTokenFromCookies(req);
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const isRefreshTokenBlacklisted =
      await this.authService.isRefreshTokenBlacklisted(refreshToken);

    if (isRefreshTokenBlacklisted) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub };
  }
}
