import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pet/pet.module';
import { UserModule } from './user/user.module';
import { TagController } from './tag/tag.controller';
import { TagModule } from './tag/tag.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [PetModule, UserModule, AuthModule, TagModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
