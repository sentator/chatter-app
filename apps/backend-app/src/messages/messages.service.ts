import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateMessagePayload,
  GetMessageListPayload,
  UpdateMessagePayload,
} from './dto/message.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../users/users.service';
import { isEqualUserIds } from '../users/utils/user.utils';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService
  ) {}
  async create(createMessageDto: CreateMessagePayload) {
    const { value, senderId, recipientId, userId } = createMessageDto;

    if (!isEqualUserIds(senderId, userId)) {
      throw new UnauthorizedException();
    }

    const sender = await this.userService.findOneById(senderId);
    const recipient = await this.userService.findOneById(recipientId);

    if (!sender || !recipient) {
      throw new BadRequestException('Sender or recipient does not exist');
    }

    const message = await this.prisma.message.create({
      data: { value, sender_id: senderId, recipient_id: recipientId },
    });

    return message;
  }

  async findAll(payload: GetMessageListPayload) {
    const {
      senderId,
      recipientId,
      userId,
      itemsPerPage,
      page,
      dateFrom,
      dateTo,
    } = payload;

    const isRequestRelatedToUser =
      isEqualUserIds(senderId, userId) || isEqualUserIds(recipientId, userId);

    if (!isRequestRelatedToUser) {
      throw new UnauthorizedException();
    }

    const result = await this.prisma.message.findMany({
      where: {
        sender_id: senderId,
        recipient_id: recipientId,
        created_at: {
          gte: new Date(dateFrom),
          lte: new Date(dateTo),
        },
      },
      take: itemsPerPage,
      skip: itemsPerPage * (page - 1),
      orderBy: { created_at: 'desc' },
    });

    return result;
  }

  async findOneById(id: number) {
    const message = await this.prisma.message.findUnique({ where: { id } });
    return message;
  }

  async findOne(userId: number, messageId: number) {
    const message = await this.findOneById(messageId);

    if (!message) {
      throw new BadRequestException('Message with such id does not exist');
    }

    const isMessageRelatedToUser =
      isEqualUserIds(message.sender_id, userId) ||
      isEqualUserIds(message.recipient_id, userId);

    if (!isMessageRelatedToUser) {
      throw new UnauthorizedException();
    }

    return message;
  }

  async update({ messageId, userId, value }: UpdateMessagePayload) {
    const message = await this.findOneById(messageId);

    if (!message) {
      throw new BadRequestException('Message with such id does not exist');
    }

    if (!isEqualUserIds(message.sender_id, userId)) {
      throw new UnauthorizedException();
    }

    const updatedMessage = await this.prisma.message.update({
      where: { id: messageId },
      data: { value },
    });

    return updatedMessage;
  }

  async remove(userId: number, messageId: number) {
    const message = await this.findOneById(messageId);

    if (!message) {
      throw new BadRequestException('Message with such id does not exist');
    }

    if (!isEqualUserIds(message.sender_id, userId)) {
      throw new UnauthorizedException();
    }

    await this.prisma.message.delete({
      where: { id: messageId, sender_id: userId },
    });

    return message;
  }
}
