import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaModule } from 'src/prisma.module';
import { S3uploadService } from 'src/s3upload/s3upload.service';

@Module({
    imports: [PrismaModule],
    controllers: [ContactController],
    providers: [ContactService, S3uploadService]
})
export class ContactModule { }
