import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import {
  CreateMessageDto,
  createMessageDtoSchema,
  GetMessageListQueryParams,
  getMessageListQueryParamsSchema,
  UpdateMessageDto,
  updateMessageDtoSchema,
} from './dto/message.dto';
import { AccessTokenGuard } from '../guards/accessToken.guard';
import { ZodValidationPipe } from '../pipes/zodValidationPipe';
import { User } from '../decorators/user.decorator';
import { UserJwtPayload } from '../types';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  create(
    @Body(new ZodValidationPipe(createMessageDtoSchema))
    createMessageDto: CreateMessageDto,
    @User() user: UserJwtPayload
  ) {
    return this.messagesService.create({
      ...createMessageDto,
      userId: user.userId,
    });
  }

  @Get()
  @UseGuards(AccessTokenGuard)
  findAll(
    @Query(new ZodValidationPipe(getMessageListQueryParamsSchema))
    query: GetMessageListQueryParams,
    @User() user: UserJwtPayload
  ) {
    return this.messagesService.findAll({ ...query, userId: user.userId });
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  findOne(@Param('id') id: string, @User() user: UserJwtPayload) {
    return this.messagesService.findOne(user.userId, +id);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateMessageDtoSchema))
    updateMessageDto: UpdateMessageDto,
    @User() user: UserJwtPayload
  ) {
    return this.messagesService.update({
      messageId: +id,
      userId: user.userId,
      value: updateMessageDto.value,
    });
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  remove(@Param('id') id: string, @User() user: UserJwtPayload) {
    return this.messagesService.remove(user.userId, +id);
  }
}
