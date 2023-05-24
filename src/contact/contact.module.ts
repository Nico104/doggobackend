import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaModule } from 'src/prisma.module';
import { S3uploadService } from 'src/s3upload/s3upload.service';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ContactController],
    providers: [ContactService, S3uploadService]
})
export class ContactModule { }
