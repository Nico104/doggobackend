import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { PrismaModule } from 'src/prisma.module';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, AuthModule, HttpModule],
  controllers: [ScanController],
  providers: [ScanService, NotificationService,]
})
export class ScanModule { }
