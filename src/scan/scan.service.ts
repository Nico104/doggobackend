import { Injectable } from '@nestjs/common';
import { Prisma, Scan } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ScanService {
    constructor(private prisma: PrismaService) { }

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

    async createTag(data: Prisma.ScanCreateInput): Promise<Scan> {
        return this.prisma.scan.create({
            data,
        });
    }
}
