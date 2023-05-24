import { Injectable } from '@nestjs/common';
import { Prisma, Scan } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScanService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) { }

    async Scans(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ScanWhereUniqueInput;
        where?: Prisma.ScanWhereInput;
        orderBy?: Prisma.ScanOrderByWithRelationInput;
    }): Promise<Scan[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.scan.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createScan(data: Prisma.ScanCreateInput): Promise<Scan> {
        let Scan = await this.prisma.scan.create({
            data,
        });

        let Pet = await this.prisma.pet.findUnique({
            where: {
                profile_id: Scan.petProfile_id
            }
        });

        let notificationTitle: string = "Someone found " + Pet.pet_name;
        let notificationBody: string = Pet.pet_name + " just got scanned in " + Scan.scan_country;

        // create Notification
        this.notificationService.createNotification(
            {
                notificationTitle: notificationTitle,
                notificationBody: notificationBody,
                notificationType: "scan",
                User: {
                    connect: {
                        uid: Pet.uid
                    }
                }
            }
        );

        return Scan;
    }
}
