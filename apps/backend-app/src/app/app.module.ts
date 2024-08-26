import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
