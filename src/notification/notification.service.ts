import { Injectable } from '@nestjs/common';
import { Prisma, Notification, User, DeviceMessagingToken } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import * as admin from 'firebase-admin';

interface NotificationParam {
    token: string[]
    title: string
    body: string
    type: string
}

@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService) { }

    async Notifications(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.NotificationWhereUniqueInput;
        where?: Prisma.NotificationWhereInput;
        orderBy?: Prisma.NotificationOrderByWithRelationInput;
    }): Promise<Notification[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.notification.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async updateNotification(params: {
        where: Prisma.NotificationWhereUniqueInput;
        data: Prisma.NotificationUpdateInput;
    }): Promise<Notification> {
        const { where, data } = params;
        return this.prisma.notification.update({
            data,
            where,
        });
    }

    async deleteNotification(where: Prisma.NotificationWhereUniqueInput): Promise<Notification> {
        return this.prisma.notification.delete({
            where,
        });
    }

    //Never tested function
    async createNotification(data: Prisma.NotificationCreateInput): Promise<Notification> {
        const Notification = await prisma.notification.create({
            data
        });

        let deviceMessagingTokens: DeviceMessagingToken[] = await prisma.deviceMessagingToken.findMany({
            where: {
                User: {
                    useremail: Notification.userUseremail
                }
            }
        });

        let tokens: string[] = [];

        deviceMessagingTokens.forEach(element => {
            tokens.push(element.token);
        });

        this.sendMessages(
            {
                token: tokens,
                body: Notification.notificationBody,
                title: Notification.notificationTitle,
                type: Notification.notificationType
            }
        );

        return Notification;
    }

    async sendMessages({ token, title, body, type }: NotificationParam): Promise<any> {
        const registrationTokens = token;

        const message = {
            notification: { title: title, body: body },
            data: { type: type },
            tokens: registrationTokens,
        };

        admin.messaging().sendEachForMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(registrationTokens[idx]);
                        }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }
            });
    }

}
