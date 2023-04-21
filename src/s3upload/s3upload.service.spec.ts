import { Test, TestingModule } from '@nestjs/testing';
import { S3uploadService } from './s3upload.service';

describe('S3uploadService', () => {
  let service: S3uploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3uploadService],
    }).compile();

    service = module.get<S3uploadService>(S3uploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
