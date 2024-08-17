import bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SigninBodyDto, SignoutPayload, SignupBodyDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  async signup(dto: SignupBodyDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    const { accessToken, refreshToken } = this.generateTokens(user.user_id);
    await this.saveRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signin(dto: SigninBodyDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordsEqual = await bcrypt.compare(password, user.password);

    if (!isPasswordsEqual) {
      throw new BadRequestException('Invalid credentials');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.user_id);
    await this.saveRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signout({ userId, accessToken }: SignoutPayload) {
    // Workaround with the optional type. We'll always have the accessToken at this point
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.update({
      where: { user_id: userId },
      data: { refreshToken: null },
    });
    await this.prisma.accessTokenBlackList.create({
      data: { token: accessToken },
    });

    return { message: 'Logged out successfully' };
  }

  async refresh() {
    return;
  }

  generateTokens(userId: number) {
    const accessToken = this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '15m' }
    );
    const refreshToken = this.jwt.sign(
      { sub: userId },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 5);
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { refreshToken: hashedRefreshToken },
    });
  }

  async isAccessTokenBlacklisted(accessToken: string) {
    const isBlacklisted = await this.prisma.accessTokenBlackList.findFirst({
      where: { token: accessToken },
    });
    return !!isBlacklisted;
  }
}
