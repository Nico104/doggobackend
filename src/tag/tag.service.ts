import { Injectable } from '@nestjs/common';
import { CollarTag, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    async Tags(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CollarTagWhereUniqueInput;
        where?: Prisma.CollarTagWhereInput;
        orderBy?: Prisma.CollarTagOrderByWithRelationInput;
    }): Promise<CollarTag[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.collarTag.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                CollarTagPersonalisation: true
            }
        });
    }

    async createTag(data: Prisma.CollarTagCreateInput): Promise<CollarTag> {
        return this.prisma.collarTag.create({
            data,
        });
    }

    async connectTagToUser(params: {
        activationCode: string,
        useremail: string
    }): Promise<CollarTag> {
        if (await this.checkTagAssignedWithActivationCode(
            { activationCode: params.activationCode }
        )) {
            return this.prisma.collarTag.update({
                where: {
                    // collarTag_id: params.tagId,
                    activationCode: params.activationCode,
                },
                data: {
                    assigned_user: {
                        connect: {
                            useremail: params.useremail
                        }
                    }
                }
            });
        } else {
            return null;
        }

    }


    ///Returns true if Tag can be assigned, false if tag does not exist or is already assigned
    async checkTagAssignedWithActivationCode(params: {
        activationCode: string
    }): Promise<Boolean> {
        return await this.prisma.collarTag.count({
            where: {
                AND: [
                    {
                        activationCode: params.activationCode
                    },
                    {
                        assigned_user: null,
                        // assignedUseremail: null
                    },
                ]
            },
        }) != 0;
    }


    async disconnectTagFromUser(params: {
        tagId: string,
    }): Promise<CollarTag> {
        return this.prisma.collarTag.update({
            where: {
                collarTag_id: params.tagId,
            },
            data: {
                assigned_user: {
                    disconnect: true
                },
                assigned_pet: {
                    disconnect: true
                }
            }
        });

    }
}
