import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ScanService } from './scan.service';
import { PrismaModule } from 'src/prisma.module';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  imports: [PrismaModule],
  controllers: [ScanController],
  providers: [ScanService, NotificationService]
})
export class ScanModule { }
