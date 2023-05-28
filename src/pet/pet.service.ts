import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Description, Gender, ImportantInformation, Pet, Language, Prisma, CollarTag, DocumentType as DocumentTypeEnum, PhoneNumber, Country, Document } from '@prisma/client';

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
                pet_pictures: true,
                Tag: true,
                pet_profile_scans: true,
                Contact: {
                    include: {
                        contact_telephone_numbers: {
                            include: {
                                Country: {
                                    include: {
                                        country_language: true
                                    }
                                }
                            }
                        },
                        contact_description: true
                    }
                }
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
                Contact: {
                    include: {
                        contact_telephone_numbers: {
                            include: {
                                Country: {
                                    include: {
                                        country_language: true
                                    }
                                }
                            }
                        },
                        contact_description: true,
                    }
                },
                pet_pictures: true,
                Tag: true,
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

    async isUserPetOwner(params: { profile_id: number; uid: string; }): Promise<Boolean> {
        return await this.prisma.pet.count({
            where: {
                AND: [
                    {
                        profile_id: params.profile_id
                    },
                    {
                        user: {
                            uid: params.uid
                        }
                    }
                ]
            }
        }) != 0;
    }

    // async isUserPhoneNumberOwner(params: { phone_number_id?: number; useremail: string; }): Promise<Boolean> {
    //     if (params.phone_number_id == null) {
    //         return false;
    //     } else {
    //         return await this.prisma.phoneNumber.count({
    //             where: {
    //                 AND: [
    //                     {
    //                         phone_number_id: params.phone_number_id
    //                     },
    //                     {

    //                         Pet: {
    //                             pet_profile_user: {
    //                                 useremail: params.useremail
    //                             }
    //                         }
    //                     }
    //                 ]
    //             }
    //         }) != 0;
    //     }

    // }

    async isUserPictureOwner(params: { pet_picture_id: number; uid: string; }): Promise<Boolean> {
        return await this.prisma.petPicture.count({
            where: {
                AND: [
                    {
                        pet_picture_id: params.pet_picture_id,
                    },
                    {
                        Pet: {
                            user: {
                                uid: params.uid
                            }
                        }
                    },
                ]
            }
        }) != 0;
    }

    async isUserDocumentOwner(params: { document_id: number; uid: string; }): Promise<Boolean> {
        return await this.prisma.document.count({
            where: {
                AND: [
                    {
                        document_id: params.document_id,
                    },
                    {
                        Pet: {
                            user: {
                                uid: params.uid
                            }
                        }
                    },
                ]
            }
        }) != 0;
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

    async createLanguage(data: Prisma.LanguageCreateInput): Promise<Language> {
        return this.prisma.language.create({
            data,
        });
    }

    //Country
    async Country(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.CountryWhereUniqueInput;
        where?: Prisma.CountryWhereInput;
        orderBy?: Prisma.CountryOrderByWithRelationInput;
    }): Promise<Country[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.country.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                country_language: true
            }
        });
    }

    async createCountry(data: Prisma.CountryCreateInput): Promise<Country> {
        return this.prisma.country.create({
            data,
        });
    }

    //Tags
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
            },
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

    //Docuement
    async updateDocument(params: {
        where: Prisma.DocumentWhereUniqueInput;
        data: Prisma.DocumentUpdateInput;
    }): Promise<Document> {
        const { where, data } = params;
        return this.prisma.document.update({
            data,
            where,
        });
    }



    parseGenderFromString(gender?: string): Gender {
        if (gender == null) {
            return null;
        }
        switch (gender.toUpperCase()) {
            case "MALE":
                return Gender.MALE;
            case "FEMALE":
                return Gender.FEMALE;
            default:
                return Gender.NONE;
        }
    }

    stringToDocumentType(document_type: string): DocumentTypeEnum {
        switch (document_type.toLowerCase()) {
            case "allergies":
                return DocumentTypeEnum.Allergies;
            case "dewormers":
                return DocumentTypeEnum.Dewormers;
            case "health":
                return DocumentTypeEnum.Health;
            case "medicine":
                return DocumentTypeEnum.Medicine;
            default:
                return DocumentTypeEnum.Noid;
        }
    }

    documentTypeToString(document_type: DocumentTypeEnum): string {
        switch (document_type) {
            case DocumentTypeEnum.Allergies:
                return "allergies";
            case DocumentTypeEnum.Dewormers:
                return "dewormers";
            case DocumentTypeEnum.Health:
                return "health";
            case DocumentTypeEnum.Medicine:
                return "medicine";
            default:
                return "noid";
        }
    }
}