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
    @Get('getUserNotifications')
    async getUserNotifications(@Request() req: any): Promise<Notification[]> {
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
    @Get('getUnseenUserNotificationsCount')
    async getUnseenUserNotificationsCount(@Request() req: any): Promise<number> {
        let unreadNotification = await this.notificationService.Notifications({
            where: {
                User: {
                    useremail: req.user.useremail
                },
                seen: false,
            }
        });

        return unreadNotification.length;
    }

    @UseGuards(JwtAuthGuard)
    @Post('readAllUserNotifications')
    async readAllUserNotifications(
        @Request() req: any,
    ) {
        return this.notificationService.readAllUserNotifications(
            {
                useremail: req.user.useremail

            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('seenAllUserNotifications')
    async seenAllUserNotifications(
        @Request() req: any,
    ) {
        return this.notificationService.seenAllUserNotifications(
            {
                useremail: req.user.useremail

            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('readNotification')
    async readNotification(
        @Request() req: any,
        @Body() data: {
            notificationId: number;
        },
    ): Promise<Notification> {
        return this.notificationService.updateNotification(
            {
                where: {
                    notificationId: data.notificationId
                },
                data: {
                    read: true,
                    seen: true
                }
            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('unseeNotification')
    async unreadNotification(
        @Request() req: any,
        @Body() data: {
            notificationId: number;
        },
    ): Promise<Notification> {
        return this.notificationService.updateNotification(
            {
                where: {
                    notificationId: data.notificationId
                },
                data: {
                    read: false,
                }
            }
        );
    }

    @UseGuards(JwtAuthGuard)
    @Post('seenNotification')
    async seenNotification(
        @Request() req: any,
        @Body() data: {
            notificationId: number;
        },
    ): Promise<Notification> {
        return this.notificationService.updateNotification(
            {
                where: {
                    notificationId: data.notificationId
                },
                data: {
                    seen: true
                }
            }
        );
    }



    @UseGuards(JwtAuthGuard)
    @Delete('deleteNotification')
    async deleteNotification(
        @Request() req: any,
        @Body() data: {
            notificationId: number;
        },
    ): Promise<Notification> {
        return this.notificationService.deleteNotification(
            {
                notificationId: data.notificationId
            },
        );
    }
}
