import bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createResponseDtoFromUserEntity } from './utils/user.utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { password } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 5);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return createResponseDtoFromUserEntity(user);
  }

  async findAll() {
    // TODO: implement pagination & search
    const users = await this.prisma.user.findMany({
      skip: 0,
      take: 10,
    });

    return users;
  }

  async findOneById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      return null;
    }

    return createResponseDtoFromUserEntity(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return createResponseDtoFromUserEntity(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new BadRequestException();
    }

    const updatedUser = await this.prisma.user.update({
      where: { user_id: id },
      data: updateUserDto,
    });

    return createResponseDtoFromUserEntity(updatedUser);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);

    if (!user) {
      throw new BadRequestException();
    }

    await this.prisma.user.delete({
      where: { user_id: id },
    });

    return user;
  }
}
