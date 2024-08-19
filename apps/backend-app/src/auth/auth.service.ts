import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import {
  RefreshPayload,
  SigninBodyDto,
  SignoutPayload,
  SignupBodyDto,
} from './dto/auth.dto';
import { UserService } from '../users/users.service';
import { compareValueWithHash, getHashedValue } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private userService: UserService
  ) {}
  async signup(dto: SignupBodyDto) {
    const foundUser = await this.userService.findOneByEmail(dto.email);

    if (foundUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.userService.create(dto);
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

    const isPasswordsEqual = await compareValueWithHash(
      password,
      user.password
    );

    if (!isPasswordsEqual) {
      throw new BadRequestException('Invalid credentials');
    }

    const { accessToken, refreshToken } = this.generateTokens(user.user_id);
    await this.saveRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken };
  }

  async signout({ userId, accessToken, refreshToken }: SignoutPayload) {
    // Workaround with the optional type. We'll always have the tokens at this point
    if (!accessToken || !refreshToken) {
      throw new UnauthorizedException();
    }

    await this.prisma.user.update({
      where: { user_id: userId },
      data: { refresh_token: null },
    });
    await this.prisma.accessTokenBlackList.create({
      data: { token: accessToken },
    });
    await this.prisma.refreshTokenBlackList.create({
      data: { token: refreshToken },
    });
  }

  async refresh({ userId, refreshToken }: RefreshPayload) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });

    // Check if user exists (with such id from the jwt payload)
    if (!user?.refresh_token) {
      throw new UnauthorizedException();
    }

    const isEqualTokens = await compareValueWithHash(
      refreshToken,
      user.refresh_token
    );

    if (!isEqualTokens) {
      throw new UnauthorizedException();
    }

    const { accessToken } = this.generateTokens(user.user_id);

    return { accessToken };
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
    const hashedRefreshToken = await getHashedValue(refreshToken);
    await this.prisma.user.update({
      where: { user_id: userId },
      data: { refresh_token: hashedRefreshToken },
    });
  }

  async isAccessTokenBlacklisted(accessToken: string) {
    const isBlacklisted = await this.prisma.accessTokenBlackList.findFirst({
      where: { token: accessToken },
    });
    return !!isBlacklisted;
  }

  async isRefreshTokenBlacklisted(refreshToken: string) {
    const isBlacklisted = await this.prisma.refreshTokenBlackList.findFirst({
      where: { token: refreshToken },
    });
    return !!isBlacklisted;
  }
}
