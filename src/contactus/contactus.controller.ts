import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { ContactusService } from './contactus.service';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';
import { ContactUs } from '@prisma/client';

@Controller('contactus')
export class ContactusController {
    constructor(
        private readonly contactusService: ContactusService,
    ) { }

    @UseGuards(TokenIdAuthGuard)
    @Post('createContactUsMessage')
    async createContactUsMessage(@Request() req: any,
        @Body() data: {
            categorie: string,
            text: string,
            declared_name: string,
            declared_email: string,
        },): Promise<ContactUs> {
        return this.contactusService.createContactUs({
            categorie: data.categorie,
            declared_email: data.declared_email,
            declared_name: data.declared_name,
            text: data.text,
            user: {
                connect: {
                    uid: req.user.uid,
                }
            }
        });
    }
}

