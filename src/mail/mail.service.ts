import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
//? maybe no need for googleapi package in project since app pw
// import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';
// import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private readonly configService: ConfigService,) { }

    async sendUserConfirmation(username: string, useremail: string, password: string) {
        // const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: useremail,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
            // template: 'src/mail/templates/confirmation.hbs',
            context: { // ✏️ filling curly brackets with content
                name: username,
                password,
            },
        });
    }

    // public async sendMail() {
    //     await this.setTransport();
    //     this.mailerService
    //         .sendMail({
    //             transporterName: 'gmail',
    //             to: 'nicolascarraro104@gmail.com', // list of receivers
    //             // from: 'testemailnicoproject@gmail.com', // sender address
    //             subject: 'Verficiaction Code', // Subject line
    //             template: './confirmation',
    //             context: {
    //                 // Data to be sent to template engine..
    //                 code: '38320',
    //             },
    //         })
    //         .then((success) => {
    //             console.log(success);
    //         })
    //         .catch((err) => {
    //             console.log("Error");
    //             console.log(err);
    //         });
    // }

    async sendEmailConfirmationCode(useremail: string, code: string) {
        // const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: useremail,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Ligma',
            template: './confirmation', // `.hbs` extension is appended automatically
            // template: 'src/mail/templates/confirmation.hbs',
            // template: 'confirmation.hbs',
            context: { // ✏️ filling curly brackets with content
                code: code,
            },
        });
    }

    // private async setTransport() {
    //     const OAuth2 = google.auth.OAuth2;
    //     // console.log(this.configService.get('CLIENT_ID'));
    //     const oauth2Client = new OAuth2(
    //         this.configService.get('CLIENT_ID'),
    //         this.configService.get('CLIENT_SECRET'),
    //         'https://developers.google.com/oauthplayground',
    //     );

    //     // const accessToken = await oauth2Client.getAccessToken();
    //     // console.log(accessToken);

    //     oauth2Client.setCredentials({
    //         refresh_token: process.env.REFRESH_TOKEN,
    //     });

    //     const accessToken: string = await new Promise((resolve, reject) => {
    //         oauth2Client.getAccessToken((err, token) => {
    //             console.log("Err: " + err);
    //             console.log("Token: " + token);
    //             if (err) {
    //                 reject('Failed to create access token');
    //             }
    //             resolve(token);
    //         });
    //     });

    //     oauth2Client.setCredentials({
    //         access_token: accessToken
    //     });

    //     const config: Options = {
    //         service: 'gmail',

    //         auth: {
    //             type: 'OAuth2',
    //             user: this.configService.get('EMAIL'),
    //             clientId: this.configService.get('CLIENT_ID'),
    //             clientSecret: this.configService.get('CLIENT_SECRET'),
    //             accessToken,
    //         },
    //     };
    //     this.mailerService.addTransporter('gmail', config);
    // }


}
