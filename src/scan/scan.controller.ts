import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFiles, Param, Request } from '@nestjs/common';
import { ScanService } from './scan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Scan } from '@prisma/client';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';
import { Request as Req } from 'express';


@Controller('scan')
export class ScanController {
    constructor(
        private readonly scanService: ScanService,
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
        await this.scanService.createScan(
            {
                Pet: {
                    connect: {
                        profile_id: data.petProfileId
                    }
                },
                // scan_city: ipDetails.city,
                // scan_country: ipDetails.country_name,
                // scan_ip_address: ipDetails.ip as string,
                scan_city: "",
                scan_country: "",
                scan_ip_address: ipDetails.ip as string,
                // scan_DateTime: Da,
            }
        );
    }

    @Post('sendLocation')
    async sendLocation(
        @Body() data: {
            petProfileId: number;
            lat: string;
            lon: string;
        },
    ): Promise<void> {
        this.scanService.sendLocation(data.petProfileId, data.lat, data.lon);
    }

    @Post('sendContactInformation')
    async sendContactInformation(
        @Body() data: {
            petProfileId: number;
            contactInformation: string;
        },
    ): Promise<void> {
        this.scanService.sendContactInformation(data.petProfileId, data.contactInformation);
    }

}
