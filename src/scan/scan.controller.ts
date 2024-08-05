import { Body, Controller, Get, Post, UseGuards, UseInterceptors, UploadedFiles, Param, Request, Ip } from '@nestjs/common';
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
        @Ip() ip,
        @Body() data: {
            petProfileId: number;
            // scan_city: string,
            // scan_country: string,
            // scan_ip_address: string,
            // scan_DateTime: string,
        },
    ): Promise<void> {
        const clientIp = req.headers['x-forwarded-for'];
        console.log(ip);
        console.log(req.header);
        // return this.scanService.createScan(
        //     {
        //         Pet: {
        //             connect: {
        //                 profile_id: data.petProfileId
        //             }
        //         },
        //         scan_city: "",
        //         scan_country: "",
        //         scan_ip_address: "",
        //         // scan_DateTime: Da,
        //     }
        // );
    }

}
