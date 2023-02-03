import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma.module';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';

@Module({
  imports: [PrismaModule],
  controllers: [PetController],
  providers: [PetService],
})
export class PetModule { }
