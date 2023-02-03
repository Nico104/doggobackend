import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PetModule } from './pet/pet.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PetModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
