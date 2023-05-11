import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { S3uploadService } from 'src/s3upload/s3upload.service';

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService, S3uploadService]
})
export class TagModule { }
