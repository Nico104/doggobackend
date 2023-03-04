import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Description, Gender, ImportantInformation, Pet, Prisma } from '@prisma/client';

@Injectable()
export class PetService {
    constructor(private prisma: PrismaService) { }

    async Pet(
        PetWhereUniqueInput: Prisma.PetWhereUniqueInput,
    ): Promise<Pet | null> {
        return this.prisma.pet.findUnique({
            where: PetWhereUniqueInput,
            include: {
                pet_description: {
                    include: {
                        description_language: true
                    }
                },
                pet_important_information: {
                    include: {
                        important_information_language: true
                    }
                },
                pet_documents: true,
                pet_owner_telephone_numbers: true,
                pet_pictures: true,
                Tag: {
                    include: {
                        CollarTagPersonalisation: true
                    }
                },
                pet_profile_scans: true,
            }
        });
    }

    async Pets(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.PetWhereUniqueInput;
        where?: Prisma.PetWhereInput;
        orderBy?: Prisma.PetOrderByWithRelationInput;
    }): Promise<Pet[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.pet.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                pet_description: {
                    include: {
                        description_language: true
                    }
                },
                pet_important_information: {
                    include: {
                        important_information_language: true
                    }
                },
                pet_documents: true,
                pet_owner_telephone_numbers: true,
                pet_pictures: true,
                Tag: {
                    include: {
                        CollarTagPersonalisation: true
                    }
                },
                pet_profile_scans: true,
            }
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

    //Description
    async upsertDescription(params: {
        create: Prisma.DescriptionCreateInput;
        update: Prisma.DescriptionUpdateInput;
        where: Prisma.DescriptionWhereUniqueInput;
    }): Promise<Description> {
        const { create, update, where } = params;
        return this.prisma.description.upsert({
            create,
            update,
            where,
        });
    }

    async deleteDescription(where: Prisma.DescriptionWhereUniqueInput): Promise<Description> {
        return this.prisma.description.delete({
            where,
        });
    }

    //Important Information
    async upsertImportantInformation(params: {
        create: Prisma.ImportantInformationCreateInput;
        update: Prisma.ImportantInformationUpdateInput;
        where: Prisma.ImportantInformationWhereUniqueInput;
    }): Promise<ImportantInformation> {
        const { create, update, where } = params;
        return this.prisma.importantInformation.upsert({
            create,
            update,
            where,
        });
    }

    async deleteImportantInformation(where: Prisma.ImportantInformationWhereUniqueInput): Promise<ImportantInformation> {
        return this.prisma.importantInformation.delete({
            where,
        });
    }

    parseGenderFromString(gender: string): Gender {
        if (gender.toUpperCase() == "MALE") {
            return Gender.MALE;
        } else {
            return Gender.FEMALE;
        }
    }
}