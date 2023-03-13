import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet as PetModel, Description as DescriptionModel, ImportantInformation as ImportantInformationModel, Gender, Language, CollarTag, User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pet')
export class PetController {
    constructor(
        private readonly petService: PetService,
    ) { }

    //Pet
    @UseGuards(JwtAuthGuard)
    @Get('getUserPets')
    async getUserPets(@Request() req: any): Promise<PetModel[]> {
        console.log(req.user);
        return this.petService.Pets(
            {
                where: {
                    pet_profile_username: req.user.useremail
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

    @UseGuards(JwtAuthGuard)
    @Post('createPet')
    async createPet(
        @Request() req: any,
        @Body() data: {
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
                        useremail: req.user.useremail
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

    @UseGuards(JwtAuthGuard)
    @Post('updatePet')
    async updatePet(
        @Request() req: any,
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
        if (await this.petService.isUserPetOwner({
            profile_id: data.profile_id,
            useremail: req.user.useremail,
        })) {
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
    }

    @UseGuards(JwtAuthGuard)
    @Delete('deletePet')
    async deletePet(
        @Request() req: any,
        @Body() data: {
            profile_id: number;
        },
    ): Promise<PetModel> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.profile_id,
            useremail: req.user.useremail,
        })) {
            return this.petService.deletePet(
                {
                    profile_id: data.profile_id
                },
            );
        }

    }

    //Description
    @UseGuards(JwtAuthGuard)
    @Post('upsertDescription')
    async upsertDescription(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
            description_text: string;
        },
    ): Promise<DescriptionModel> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            useremail: req.user.useremail,
        })) {
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

    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteDescription')
    async deleteDescription(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
        },
    ): Promise<DescriptionModel> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            useremail: req.user.useremail,
        })) {
            return this.petService.deleteDescription(
                {
                    petProfile_id_description_language_key: {
                        description_language_key: data.language_key,
                        petProfile_id: data.petProfile_id
                    }
                },
            );
        }

    }

    //ImportantInformation
    @UseGuards(JwtAuthGuard)
    @Post('upsertImportantInformation')
    async upsertImportantInformation(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
            important_information_text: string;
        },
    ): Promise<ImportantInformationModel> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            useremail: req.user.useremail,
        })) {
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

    }

    @UseGuards(JwtAuthGuard)
    @Delete('deleteImportantInformation')
    async deleteImportantInformation(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
        },
    ): Promise<ImportantInformationModel> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            useremail: req.user.useremail,
        })) {
            return this.petService.deleteImportantInformation(
                {
                    petProfile_id_important_information_language_key: {
                        important_information_language_key: data.language_key,
                        petProfile_id: data.petProfile_id
                    }
                },
            );
        }

    }

    //Language
    @Get('getLanguages')
    async getLanguages(): Promise<Language[]> {
        return this.petService.Language({});
    }

    //Tags
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
