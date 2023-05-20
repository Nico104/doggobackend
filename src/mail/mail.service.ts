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

    async sendEmailVerificationCode(email: string, code: string) {
        // const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Ligma',
            template: './verification', // `.hbs` extension is appended automatically
            // template: 'src/mail/templates/confirmation.hbs',
            // template: 'confirmation.hbs',
            context: { // ✏️ filling curly brackets with content
                code: code,
            },
        });
    }



}
