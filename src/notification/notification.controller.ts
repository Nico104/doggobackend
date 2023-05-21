import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Notification } from '@prisma/client';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('getUserContacts')
    async getUserContacts(@Request() req: any): Promise<Notification[]> {
        return this.notificationService.Notifications({
            where: {
                User: {
                    useremail: req.user.useremail
                }
            },
            orderBy: {
                creationDateTime: 'desc'
            }
        });
    }

    @UseGuards(JwtAuthGuard)
    @Post('readNotification')
    async connectContactToPet(
        @Request() req: any,
        @Body() data: {
            noticicationId_id: number;
        },
    ): Promise<Notification> {
        return this.notificationService.updateNotification(
            {
                where: {
                    notificationId: data.noticicationId_id
                },
                data: {
                    read: true
                }
            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteNotification')
    async deleteNotification(
        @Request() req: any,
        @Body() data: {
            noticicationId_id: number;
        },
    ): Promise<Notification> {
        return this.notificationService.deleteNotification(
            {
                notificationId: data.noticicationId_id
            },
        );
    }
}
