import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PetModule } from './pet/pet.module';
import { UserModule } from './user/user.module';
import { TagController } from './tag/tag.controller';
import { TagModule } from './tag/tag.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { S3uploadService } from './s3upload/s3upload.service';
import { S3uploadModule } from './s3upload/s3upload.module';
import { ScanModule } from './scan/scan.module';
import { ContactController } from './contact/contact.controller';
import { ContactService } from './contact/contact.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [PetModule, UserModule, AuthModule, TagModule, MailModule, S3uploadModule, ScanModule, ContactModule,
    //    MailerModule.forRoot({
    //   // transport: 'smtps://user@domain.com:pass@smtp.domain.com',
    //   transport: {
    //     host: "smtp.gmail.com",
    //     service: "Gmail",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: 'testemailnicoproject@gmail.com',
    //       pass: 'hnclicgggnmitjal',
    //     },
    //   },
    //   // defaults: {
    //   //   // from: '"No Reply" <testpopokakamann@gmail.com>',
    //   //   from: '"Draft2" <testemailnicoproject@gmail.com>',
    //   // },
    //   template: {
    //     //! Found out what problem with --dirname is
    //     // dir: join(__dirname, 'templates'),
    //     dir: 'src/mail/templates',
    //     adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService, S3uploadService],
})
export class AppModule { }
