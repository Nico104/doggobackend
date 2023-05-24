import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

import { S3uploadService } from 'src/s3upload/s3upload.service';
import { S3uploadModule } from 'src/s3upload/s3upload.module';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [PetController],
  providers: [PetService, S3uploadService],
})
export class PetModule { }
