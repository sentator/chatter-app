import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { UserService } from '../users/users.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, UserService],
})
export class MessagesModule {}
