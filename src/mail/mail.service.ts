import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
// import { User } from '@prisma/client';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(username: string, useremail: string, password: string) {
        // const url = `example.com/auth/confirm?token=${token}`;

        await this.mailerService.sendMail({
            to: useremail,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './confirmation', // `.hbs` extension is appended automatically
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
            context: { // ✏️ filling curly brackets with content
                code: code,
            },
        });
    }
}
