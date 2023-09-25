import { Injectable } from '@nestjs/common';
import { ContactUs, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ContactusService {
    constructor(private prisma: PrismaService) { }

    async ContactusMessages(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ContactUsWhereUniqueInput;
        where?: Prisma.ContactUsWhereInput;
        orderBy?: Prisma.ContactUsOrderByWithRelationInput;
    }): Promise<ContactUs[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.contactUs.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createContactUs(data: Prisma.ContactUsCreateInput): Promise<ContactUs> {
        return this.prisma.contactUs.create({
            data,
        });
    }
}
