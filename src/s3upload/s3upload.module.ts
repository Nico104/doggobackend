import { Module } from '@nestjs/common';
import { S3uploadService } from './s3upload.service';

@Module({
  providers: [S3uploadService],
  // exports: [S3uploadService]
})
export class S3uploadModule { }
