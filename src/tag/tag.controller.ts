import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { CollarTag } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {

    constructor(
        private readonly tagService: TagService,
    ) { }


    @UseGuards(JwtAuthGuard)
    @Get('getUserTags')
    async getUserTags(@Request() req: any): Promise<CollarTag[]> {
        return this.tagService.Tags({
            where: {
                assigned_user: {
                    useremail: req.user.useremail
                }
            }
        });
    }

    @Post('createTag')
    async createTag(
        @Body() data: {
            activationCode: string;
            collarTag_id: string;
            primaryColorName: string;
            secondaryColorName: string;
            baseColorName: string;
            letter: string;
            appBackgroundColorHex: string;
            appPetTagPrimaryColorHex: string;
            appPetTagSecundaryColorHex: string;
        },
    ): Promise<CollarTag> {
        return this.tagService.createTag(
            {
                activationCode: data.activationCode,
                collarTag_id: data.collarTag_id,
                CollarTagPersonalisation: {
                    create: {
                        appBackgroundColorHex: data.appBackgroundColorHex,
                        primaryColorName: data.primaryColorName,
                        secondaryColorName: data.secondaryColorName,
                        baseColorName: data.baseColorName,
                        letter: data.letter,
                        appPetTagPrimaryColor: data.appPetTagPrimaryColorHex,
                        appPetTagSecundaryColor: data.appPetTagSecundaryColorHex,

                    }
                }
            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('assignTagToUser')
    async assignTagToUser(
        @Request() req: any,
        @Body() data: {
            activationCode: string;
        },
    ): Promise<CollarTag> {
        console.log("Email = " + req.user.useremail);
        return this.tagService.connectTagToUser(
            {
                activationCode: data.activationCode,
                useremail: req.user.useremail,
            }
        );
    }

    //! Only Mod Rights
    @Post('disconnectTagFromUser')
    async disconnectTagFromUser(
        @Body() data: {
            tagId: string
        },
    ): Promise<CollarTag> {
        return this.tagService.disconnectTagFromUser(
            {
                tagId: data.tagId
            }
        );
    }
}
