import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        //! Does not work in dorm network!
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'testemailnicoproject@gmail.com',
          pass: 'ytpawshiaxfoiisp',
        },
      },
      defaults: {
        // from: '"No Reply" <testpopokakamann@gmail.com>',
        from: '"Draft2" <testemailnicoproject@gmail.com>',
      },
      template: {
        //! Found out what problem with --dirname is
        // dir: join(__dirname, 'templates'),
        dir: 'src/mail/templates',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
    // MailerModule.forRoot({
    //   transport: 'smtps://user@domain.com:pass@smtp.domain.com',
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
  providers: [MailService, ConfigService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule { }
