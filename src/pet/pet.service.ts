import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Pet, Prisma } from '@prisma/client';

@Injectable()
export class PetService {
    constructor(private prisma: PrismaService) { }

    async Pet(
        PetWhereUniqueInput: Prisma.PetWhereUniqueInput,
    ): Promise<Pet | null> {
        return this.prisma.pet.findUnique({
            where: PetWhereUniqueInput,
        });
    }

    async Pets(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PetWhereUniqueInput;
        where?: Prisma.PetWhereInput;
        orderBy?: Prisma.PetOrderByWithRelationInput;
    }): Promise<Pet[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.pet.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createPet(data: Prisma.PetCreateInput): Promise<Pet> {
        return this.prisma.pet.create({
            data,
        });
    }

    async updatePet(params: {
        where: Prisma.PetWhereUniqueInput;
        data: Prisma.PetUpdateInput;
    }): Promise<Pet> {
        const { where, data } = params;
        return this.prisma.pet.update({
            data,
            where,
        });
    }

    async deletePet(where: Prisma.PetWhereUniqueInput): Promise<Pet> {
        return this.prisma.pet.delete({
            where,
        });
    }
}