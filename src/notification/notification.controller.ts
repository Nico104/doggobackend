import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Notification } from '@prisma/client';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';

@Controller('notification')
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    @UseGuards(TokenIdAuthGuard)
    @Get('getUserNotifications')
    async getUserNotifications(@Request() req: any): Promise<Notification[]> {
        return this.notificationService.Notifications({
            where: {
                User: {
                    uid: req.user.uid
                }
            },
            orderBy: {
                creationDateTime: 'desc'
            }
        });
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getUnseenUserNotificationsCount')
    async getUnseenUserNotificationsCount(@Request() req: any): Promise<number> {
        let unreadNotification = await this.notificationService.Notifications({
            where: {
                User: {
                    uid: req.user.uid
                },
                seen: false,
            }
        });

        return unreadNotification.length;
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('readAllUserNotifications')
    async readAllUserNotifications(
        @Request() req: any,
    ) {
        return this.notificationService.readAllUserNotifications(
            {
                uid: req.user.uid

            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('seenAllUserNotifications')
    async seenAllUserNotifications(
        @Request() req: any,
    ) {
        return this.notificationService.seenAllUserNotifications(
            {
                uid: req.user.uid

            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
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

    @UseGuards(TokenIdAuthGuard)
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

    @UseGuards(TokenIdAuthGuard)
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



    @UseGuards(TokenIdAuthGuard)
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

