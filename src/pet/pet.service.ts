import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Description, Gender, ImportantInformation, Pet, Language, Prisma, CollarTag } from '@prisma/client';

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
                pet_owner_telephone_numbers: {
                    include: {
                        phone_number_Language: true
                    }
                },
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

    //Language
    async Language(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.LanguageWhereUniqueInput;
        where?: Prisma.LanguageWhereInput;
        orderBy?: Prisma.LanguageOrderByWithRelationInput;
    }): Promise<Language[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.language.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    //Tags
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

    async connectTagFromPetProfile(data: {
        collarTagId: string,
        profileId: number,
    }): Promise<Pet> {
        return this.prisma.pet.update({
            where: {
                profile_id: data.profileId
            },
            data: {
                Tag: {
                    connect: {
                        collarTag_id: data.collarTagId
                    }
                }
            }
        });
    }

    async disconnectTagFromPetProfile(data: {
        collarTagId: string,
        profileId: number,
    }): Promise<Pet> {
        return this.prisma.pet.update({
            where: {
                profile_id: data.profileId
            },
            data: {
                Tag: {
                    disconnect: {
                        collarTag_id: data.collarTagId
                    }
                }
            }
        });
    }


    parseGenderFromString(gender: string): Gender {
        switch (gender.toUpperCase()) {
            case "MALE":
                return Gender.MALE;
            case "FEMALE":
                return Gender.FEMALE;
            default:
                return Gender.NONE;
        }
    }
}