import bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  CreateUserDto,
  UpdateUserDto,
  UserEntity,
  UserListQueryParams,
} from './dto/user.dto';
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

  async findAll(query: UserListQueryParams) {
    const { search, itemsPerPage, page } = query;
    const offset = (page - 1) * itemsPerPage;

    const queryWithSearch = async (search: string) => {
      return await this.prisma.$queryRaw<
        UserEntity[]
      >`SELECT * FROM public."User" U
       WHERE (concat(concat(U."first_name", ' '), U."last_name") ilike ${`%${search}%`})
       ORDER BY U."user_id"
       OFFSET ${offset}
       LIMIT ${itemsPerPage};`;
    };
    const queryWithoutSearch = async () => {
      return await this.prisma.$queryRaw<
        UserEntity[]
      >`SELECT * FROM public."User" U
       ORDER BY U."user_id"
       OFFSET ${offset}
       LIMIT ${itemsPerPage};`;
    };

    const users = search
      ? await queryWithSearch(search)
      : await queryWithoutSearch();

    return users.map(createResponseDtoFromUserEntity);
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
