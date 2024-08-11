import { Injectable } from '@nestjs/common';
import { CollarTag, Prisma, TagModel } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) { }

    //Model
    async createTagModel(data: Prisma.TagModelCreateInput): Promise<TagModel> {
        return this.prisma.tagModel.create({
            data,
        });
    }


    //Individual Tag

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
                model: true
            }
        });
    }


    async Tag(CollarTagWhereUniqueInput: Prisma.CollarTagWhereUniqueInput): Promise<CollarTag> {
        return this.prisma.collarTag.findUnique({
            where: CollarTagWhereUniqueInput,
            include: {
                model: true
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
        uid: string
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
                    user: {
                        connect: {
                            uid: params.uid
                        }
                    },
                    assignedDate: new Date(),
                },
                include: {
                    model: true
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
                        user: null,
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
                user: {
                    disconnect: true
                },
                assigned_pet: {
                    disconnect: true
                }
            }
        });

    }

    //!Administration Function
    async checkTagIdAvailable(params: {
        tagId: string
    }): Promise<Boolean> {
        return await this.prisma.collarTag.count({
            where: {
                collarTag_id: params.tagId
            },
        }) == 0;
    }

    //! Check that activitionCode isnt double
}
