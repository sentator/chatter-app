import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  UnauthorizedException,
  BadRequestException,
  Res,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './users.service';
import {
  UpdateUserDto,
  updateUserDtoSchema,
  UserListQueryParams,
  userListQueryParamsSchema,
} from './dto/user.dto';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { User } from '../decorators/user.decorator';
import { UserJwtPayload } from '../types';
import { isEqualUserIds } from './utils/user.utils';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  findAll(
    @Query(new ZodValidationPipe(userListQueryParamsSchema))
    query: UserListQueryParams
  ) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const user = await this.usersService.findOneById(+id);

    if (!user) {
      throw new BadRequestException('User with such id does not exist');
    }

    res.json(user);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  @UsePipes(new ZodValidationPipe(updateUserDtoSchema))
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserJwtPayload
  ) {
    if (!isEqualUserIds(+id, user.userId)) {
      throw new UnauthorizedException();
    }

    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @User() user: UserJwtPayload) {
    if (!isEqualUserIds(+id, user.userId)) {
      throw new UnauthorizedException();
    }

    return this.usersService.remove(+id);
  }
}
