import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { S3uploadService } from 'src/s3upload/s3upload.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TagController],
  providers: [TagService, S3uploadService,]
})
export class TagModule { }
