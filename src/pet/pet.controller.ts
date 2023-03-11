import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet as PetModel, Description as DescriptionModel, ImportantInformation as ImportantInformationModel, Gender, Language, CollarTag } from '@prisma/client';

@Controller('pet')
export class PetController {
    constructor(
        private readonly petService: PetService,
    ) { }

    //Pet
    @Get('getUserPets')
    async getUserPets(
    ): Promise<PetModel[]> {
        return this.petService.Pets(
            {
                where: {
                    pet_profile_username: 'test'
                },
            }
        );
    }

    @Get('getPet/:profile_id')
    async getUserPet(@Param('profile_id') profile_id: string
    ): Promise<PetModel> {
        return this.petService.Pet(
            { profile_id: Number(profile_id) }
        );
    }

    @Post('createPet')
    async createPet(
        @Body() data: {
            //!get user From logged in User token
            // useremail: string;
            pet_name: string;
            pet_gender?: string;
            pet_chip_id?: string | null;
            pet_owner_name?: string | null;
            pet_owner_email?: string | null;
            pet_owner_living_place?: string | null;
            pet_owner_facebook?: string | null;
            pet_owner_instagram?: string | null;
            pet_is_Lost: boolean;
        },
    ): Promise<PetModel> {
        return this.petService.createPet(
            {
                pet_profile_user: {
                    connect: {
                        useremail: 'test'
                    }
                },
                pet_name: data.pet_name,
                pet_gender: this.petService.parseGenderFromString(data.pet_gender),
                pet_chip_id: data.pet_chip_id,
                pet_owner_name: data.pet_owner_name,
                pet_owner_email: data.pet_owner_email,
                pet_owner_living_place: data.pet_owner_living_place,
                pet_owner_facebook: data.pet_owner_facebook,
                pet_owner_instagram: data.pet_owner_instagram,
                pet_is_Lost: data.pet_is_Lost,
            }
        );
    }

    @Post('updatePet')
    async updatePet(
        @Body() data: {
            profile_id: number;
            pet_name: string;
            pet_gender?: string;
            pet_chip_id?: string | null;
            pet_owner_name?: string | null;
            pet_owner_email?: string | null;
            pet_owner_living_place?: string | null;
            pet_owner_facebook?: string | null;
            pet_owner_instagram?: string | null;
            pet_is_Lost: boolean;
        },
    ): Promise<PetModel> {
        return this.petService.updatePet(
            {
                data: {
                    pet_name: data.pet_name,
                    pet_gender: this.petService.parseGenderFromString(data.pet_gender),
                    pet_chip_id: data.pet_chip_id,
                    pet_owner_name: data.pet_owner_name,
                    pet_owner_email: data.pet_owner_email,
                    pet_owner_living_place: data.pet_owner_living_place,
                    pet_owner_facebook: data.pet_owner_facebook,
                    pet_owner_instagram: data.pet_owner_instagram,
                    pet_is_Lost: data.pet_is_Lost,
                },
                where: {
                    profile_id: data.profile_id
                }
            }
        );
    }

    @Delete('deletePet')
    async deletePet(
        @Body() data: {
            petProfile_id: number;
        },
    ): Promise<PetModel> {
        return this.petService.deletePet(
            {
                profile_id: data.petProfile_id
            },
        );
    }

    //Description
    @Post('upsertDescription')
    async upsertDescription(
        @Body() data: {
            petProfile_id: number;
            language_key: string;
            description_text: string;
        },
    ): Promise<DescriptionModel> {
        return this.petService.upsertDescription(
            {
                create: {
                    description_language: {
                        connect: {
                            language_key: data.language_key
                        }
                    },
                    Pet: {
                        connect: {
                            profile_id: data.petProfile_id
                        }
                    },
                    description_text: data.description_text
                },
                update: {
                    description_text: data.description_text
                },
                where: {
                    petProfile_id_description_language_key: {
                        description_language_key: data.language_key,
                        petProfile_id: data.petProfile_id
                    }
                },
            }
        );
    }

    @Delete('deleteDescription')
    async deleteDescription(
        @Body() data: {
            petProfile_id: number;
            language_key: string;
        },
    ): Promise<DescriptionModel> {
        return this.petService.deleteDescription(
            {
                petProfile_id_description_language_key: {
                    description_language_key: data.language_key,
                    petProfile_id: data.petProfile_id
                }
            },
        );
    }

    //ImportantInformation
    @Post('upsertImportantInformation')
    async upsertImportantInformation(
        @Body() data: {
            petProfile_id: number;
            language_key: string;
            important_information_text: string;
        },
    ): Promise<ImportantInformationModel> {
        return this.petService.upsertImportantInformation(
            {
                create: {
                    important_information_language: {
                        connect: {
                            language_key: data.language_key
                        }
                    },
                    Pet: {
                        connect: {
                            profile_id: data.petProfile_id
                        }
                    },
                    important_information_text: data.important_information_text
                },
                update: {
                    important_information_text: data.important_information_text
                },
                where: {
                    petProfile_id_important_information_language_key: {
                        important_information_language_key: data.language_key,
                        petProfile_id: data.petProfile_id
                    }
                },
            }
        );
    }

    @Delete('deleteImportantInformation')
    async deleteImportantInformation(
        @Body() data: {
            petProfile_id: number;
            language_key: string;
        },
    ): Promise<ImportantInformationModel> {
        return this.petService.deleteImportantInformation(
            {
                petProfile_id_important_information_language_key: {
                    important_information_language_key: data.language_key,
                    petProfile_id: data.petProfile_id
                }
            },
        );
    }

    //Language
    @Get('getLanguages')
    async getLanguages(): Promise<Language[]> {
        return this.petService.Language({});
    }

    //Tags
    @Get('getUserTags')
    async getUserTags(): Promise<CollarTag[]> {
        return this.petService.Tags({
            where: {
                assigned_user: {
                    useremail: "test"
                }
            }
        });
    }

    @Post('createTag')
    async createTag(
        @Body() data: {
            activationCode: string;
            collarTag_id: string;
            appBackgroundColorHex: string;
            primaryColorName: string;
            secondaryColorName: string;
            baseColorName: string;
            letter: string;
            appPetTagPrimaryColor: string;
            appPetTagSecundaryColor: string;
        },
    ): Promise<CollarTag> {
        return this.petService.createTag(
            {
                activationCode: data.activationCode,
                collarTag_id: data.collarTag_id,
                CollarTagPersonalisation: {
                    create: {
                        appBackgroundColorHex: data.appBackgroundColorHex,
                        primaryColorName: data.primaryColorName,
                        secondaryColorName: data.secondaryColorName,
                        baseColorName: data.baseColorName,
                        letter: data.letter,
                        appPetTagPrimaryColor: data.appPetTagPrimaryColor,
                        appPetTagSecundaryColor: data.appPetTagSecundaryColor,

                    }
                }
            }
        );
    }

    @Post('connectTagFromPetProfile')
    async connectTagFromPetProfile(
        @Body() data: {
            profileId: number;
            collarTagId: string;
        },
    ): Promise<PetModel> {
        return this.petService.connectTagFromPetProfile({
            profileId: data.profileId,
            collarTagId: data.collarTagId,
        });
    }

    @Post('disconnectTagFromPetProfile')
    async disconnectTagFromPetProfile(
        @Body() data: {
            profileId: number;
            collarTagId: string;
        },
    ): Promise<PetModel> {
        return this.petService.disconnectTagFromPetProfile({
            profileId: data.profileId,
            collarTagId: data.collarTagId,
        });
    }

}
