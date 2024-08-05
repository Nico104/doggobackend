import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma, Scan } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScanService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
        private readonly httpService: HttpService
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

    async getIpDetails(ip: string, format: string = 'json'): Promise<any> {
        const url = `https://ipapi.co/${ip}/${format}/`;

        try {
            const response: AxiosResponse<any> = await this.httpService.get(url).toPromise();
            const data = response.data;

            // Extract the relevant information
            const extractedData = {
                ip: data.ip,
                version: data.version,
                city: data.city,
                region: data.region,
                region_code: data.region_code,
                country_code: data.country_code,
                country_code_iso3: data.country_code_iso3,
                country_name: data.country_name,
                country_capital: data.country_capital,
                country_tld: data.country_tld,
                continent_code: data.continent_code,
                in_eu: data.in_eu,
                postal: data.postal,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone,
                utc_offset: data.utc_offset,
                country_calling_code: data.country_calling_code,
                currency: data.currency,
                currency_name: data.currency_name,
                languages: data.languages,
                country_area: data.country_area,
                country_population: data.country_population,
                asn: data.asn,
                org: data.org,
                hostname: data.hostname
            };

            return extractedData;
        } catch (error) {
            console.error(`Failed to fetch IP details: ${error.message}`);
            throw error;
        }
    }
}
