import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Prisma, Scan } from '@prisma/client';
import { AxiosResponse } from 'axios';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

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

    async createScanWithoutNotification(data: Prisma.ScanCreateInput): Promise<Scan> {
        let Scan = await this.prisma.scan.create({
            data,
        });

        return Scan;
    }

    async createScan(data: Prisma.ScanCreateInput, lang_key: string): Promise<Scan> {
        let Scan = await this.prisma.scan.create({
            data,
        });

        let Pet = await this.prisma.pet.findUnique({
            where: {
                profile_id: Scan.petProfile_id
            }
        });

        // let notificationTitle: string = "Someone found " + Pet.pet_name;
        // let notificationBody: string = Pet.pet_name + " just got scanned in " + Scan.scan_country;
        let notificationTitle: string = Pet.pet_name + this.getTranslation("notification_scan_Title", lang_key);
        let notificationBody: string = this.getTranslation("notification_scan_Text", lang_key) + Scan.scan_country;

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

    async sendLocation(petProfileId: number,
        lat: string,
        lon: string, lang_key: string): Promise<any> {

        let Pet = await this.prisma.pet.findUnique({
            where: {
                profile_id: petProfileId
            }
        });

        let notificationTitle: string = Pet.pet_name + this.getTranslation("notification_location_Title", lang_key);
        let notificationBody: string = this.getTranslation("notification_location_Text", lang_key) + "Lat: " + lat + " " + "Lon: " + lon;

        // create Notification
        this.notificationService.createNotification(
            {
                notificationTitle: notificationTitle,
                notificationBody: notificationBody,
                notificationType: "location",
                User: {
                    connect: {
                        uid: Pet.uid
                    }
                }
            }
        );
    }

    async sendContactInformation(petProfileId: number,
        contactInformation: string, lang_key: string): Promise<any> {

        let Pet = await this.prisma.pet.findUnique({
            where: {
                profile_id: petProfileId
            }
        });

        let notificationTitle: string = this.getTranslation("notification_contact_Title", lang_key) + Pet.pet_name;
        let notificationBody: string = this.getTranslation("notification_contact_Text", lang_key) + contactInformation;

        // create Notification
        this.notificationService.createNotification(
            {
                notificationTitle: notificationTitle,
                notificationBody: notificationBody,
                notificationType: "contact",
                User: {
                    connect: {
                        uid: Pet.uid
                    }
                }
            }
        );
    }

    async getIpDetails(ip: string, format: string = 'json'): Promise<any> {
        // const url = `https://freeipapi.com/api/json/${ip}`;
        const url = `https://ipinfo.io/${ip}?token=dada5e453c5e98`;

        console.log(url);

        try {
            // const response: AxiosResponse<any> = await this.httpService.get(url).toPromise();

            const response: AxiosResponse<any> = await firstValueFrom(this.httpService.get(url));
            const data = response.data;

            // Extract the relevant information
            const extractedData = {
                // ip: data.ipAddress,

                // city: data.cityName,

                // country_name: data.countryName,

                ip: data.ip,

                city: data.city + ', ' + data.region,

                country_name: data.country,

            };

            return extractedData;
        } catch (error) {
            console.error(`Failed to fetch IP details: ${error.message}`);
            throw error;
        }
    }

    getTranslation(key: string, locale: string): string {
        try {
            // let localesPath = path.join(__dirname, '..', 'locales');
            let localesPath = '/home/nico/backend/locales';
            const filePath = path.join(localesPath, `${locale}.json`);
            if (!fs.existsSync(filePath)) {
                throw new Error(`Locale file ${locale}.json not found`);
            }

            const fileContent = fs.readFileSync(filePath, 'utf8');
            const translations = JSON.parse(fileContent);

            if (translations[key] === undefined) {
                throw new Error(`Key "${key}" not found in ${locale}.json`);
            }

            return translations[key];
        } catch (error) {
            console.error(error.message);
            return null; // or handle the error as you prefer
        }
    }
}
