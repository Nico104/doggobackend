import { Body, Controller, Get, Post, UseGuards, Request, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { ScanService } from './scan.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Scan } from '@prisma/client';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';


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

}
