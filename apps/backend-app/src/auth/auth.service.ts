import bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SigninBodyDto, SignupBodyDto } from './dto/auth.dto';

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

    await this.prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return { message: 'User successfully created' };
  }
  async signin(dto: SigninBodyDto) {
    const { email, password } = dto;

    const foundUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordsEqual = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordsEqual) {
      throw new BadRequestException('Invalid credentials');
    }
  }
  async signout() {
    return;
  }
}
