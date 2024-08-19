import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFiles, Param, Request } from '@nestjs/common';
import { ScanService } from './scan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Scan, User } from '@prisma/client';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';
import { Request as Req } from 'express';
import { UserService } from 'src/user/user.service';


@Controller('scan')
export class ScanController {
    constructor(
        private readonly scanService: ScanService,
        private readonly userService: UserService,
    ) { }

    @UseGuards(TokenIdAuthGuard)
    @Get('getProfileScans/:petProfileId')
    async getUserTags(@Request() req: any, @Param('petProfileId') petProfileId: string): Promise<Scan[]> {
        return this.scanService.Scans({
            where: {
                petProfile_id: Number(petProfileId),
            },
            orderBy: {
                scan_DateTime: 'desc'
            }
        });
    }

    @Post('createScan')
    async createScan(
        @Request() req: Req,
        @Body() data: {
            notification: boolean;
            petProfileId: number;
            // scan_city: string,
            // scan_country: string,
            // scan_ip_address: string,
            // scan_DateTime: string,
        },
    ): Promise<void> {
        const clientIp: string = req.headers['x-forwarded-for'] as string;
        console.log("Client" + clientIp);

        const ipDetails = await this.scanService.getIpDetails(clientIp);

        console.log(req.header);
        if (data.notification == false) {
            console.log("createScanWithoutNotification");
            await this.scanService.createScanWithoutNotification(
                {
                    Pet: {
                        connect: {
                            profile_id: data.petProfileId
                        }
                    },
                    scan_city: ipDetails.city,
                    scan_country: ipDetails.country_name,
                    scan_ip_address: ipDetails.ip,
                    // scan_DateTime: Da,
                }

            );
        } else {
            console.log("createScan");
            console.log(await this.getLangKeyFromPetId(data.petProfileId));
            await this.scanService.createScan(
                {
                    Pet: {
                        connect: {
                            profile_id: data.petProfileId
                        }
                    },
                    scan_city: ipDetails.city,
                    scan_country: ipDetails.country_name,
                    scan_ip_address: ipDetails.ip,
                }
                , await this.getLangKeyFromPetId(data.petProfileId)
            );
        }

    }

    @Post('sendLocation')
    async sendLocation(
        @Body() data: {
            petProfileId: number;
            lat: string;
            lon: string;
        },
    ): Promise<void> {
        this.scanService.sendLocation(data.petProfileId, data.lat, data.lon, await this.getLangKeyFromPetId(data.petProfileId));
    }

    @Post('sendContactInformation')
    async sendContactInformation(
        @Body() data: {
            petProfileId: number;
            contactInformation: string;
        },
    ): Promise<void> {



        this.scanService.sendContactInformation(data.petProfileId, data.contactInformation, await this.getLangKeyFromPetId(data.petProfileId));
    }


    async getLangKeyFromPetId(petProfileId: number): Promise<string> {
        let user: User = await this.userService.FirstUserByPet(
            petProfileId
        );

        let lang_key: string = user['UserSettings']['userAppLanguageKey'];

        return lang_key;
    }

}
