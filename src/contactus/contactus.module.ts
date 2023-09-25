import { Module } from '@nestjs/common';
import { ContactusController } from './contactus.controller';
import { ContactusService } from './contactus.service';
import { PrismaModule } from 'src/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ContactusController],
    providers: [ContactusService],
})
export class ContactusModule { }
