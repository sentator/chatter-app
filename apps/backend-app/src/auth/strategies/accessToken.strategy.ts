import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { extractTokenFromHeader } from '../../utils';

type JwtPayload = {
  sub: number;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const accessToken = extractTokenFromHeader(req);

    if (!accessToken) {
      throw new UnauthorizedException();
    }

    const isAccessTokenBlacklisted =
      await this.authService.isAccessTokenBlacklisted(accessToken);

    if (isAccessTokenBlacklisted) {
      throw new UnauthorizedException();
    }

    return { userId: payload.sub };
  }
}
