import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

import { S3uploadService } from 'src/s3upload/s3upload.service';
import { S3uploadModule } from 'src/s3upload/s3upload.module';

@Module({
  imports: [PrismaModule],
  controllers: [PetController],
  providers: [PetService, S3uploadService],
})
export class PetModule { }
