import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet, Description, Gender, Language, CollarTag, User, PhoneNumber, Document, PetPicture, BehaviourInformation, MedicalInformation, HealthIssue } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MediaType, S3uploadService } from 'src/s3upload/s3upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { unlink } from 'fs';
import { GlobalService } from 'src/utils/global.service';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';

var directoryPath = GlobalService.rootPath + 'MediaFiles/';


var maxDocuemntFileSizePerPetProfileInMB: number = 1024 * 5;
var maxPictureFileSizePerPetProfileInMB: number = 1024 * 5;

@Controller('pet')
export class PetController {
    constructor(
        private readonly petService: PetService,
        private readonly s3uploadService: S3uploadService,
    ) { }


    //Picture Upload

    /**
     * Updates the User's Profile Information
     * @param picture for the new Profile Picture file
     * @param profileBio for the new Profile Bio
     */
    @UseGuards(TokenIdAuthGuard)
    @Post('uploadPicture/:profile_id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1, },
    ], {
        storage: diskStorage({
            destination: directoryPath + "uploads",
        }),
    }
    ))
    async uploadPicture(
        @Request() req,
        @UploadedFiles() files: { picture?: Express.Multer.File[] },
        @Param('profile_id') profile_id: string
    ): Promise<any> {
        // var picturePath = 'uploads/default/defaultProfilePicture.png';
        // let spacesPicturePath: string = 'profile/default/defaultProfilePicture';
        if (files.picture != null) {
            console.log("picture is not null");

            // var fs = require("fs"); // Load the filesystem module
            // var stats = fs.statSync(files.picture[0]['path'])
            // var fileSizeInBytes = stats.size;
            // // Convert the file size to megabytes (optional)
            // var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);

            let pictureFileSize = await this.petService.sizePetPictures({
                profileId: Number(profile_id)
            }) + files.picture[0]['size'] / (1024 * 1024);

            console.log(pictureFileSize);

            if (pictureFileSize > maxPictureFileSizePerPetProfileInMB) {
                console.log("pictures amount to too much storage space for this Pet Profile");
                return "ErrorStorageFull";
            }

            let filename: string = files.picture[0]['filename'];

            /**
            * Processes and resized the uploaded Thumbnail File
            */
            var picturePath = 'uploads/' + filename + '.png';


            let bucketName: string = 'petpictures';
            let key: string = 'petpictures/';
            let s3PicturePath: string = bucketName + '/' + key + filename;


            await this.s3uploadService.resizeAndSaveImageJpeg(directoryPath + picturePath, files.picture[0]['path'], 500, 500, 80);


            /**
            * Upload Pet Picture to Vultr
            */
            await this.s3uploadService.upload(directoryPath + picturePath,
                filename, MediaType.Image, key, bucketName);


            await this.petService.updatePet(
                {
                    where: {
                        profile_id: Number(profile_id)
                    },
                    data: {
                        pet_pictures: {
                            create: {
                                pet_picture_link: s3PicturePath,
                                pet_picture_priority: 0,
                                size_megabyte: files.picture[0]['size'] / (1024 * 1024),
                            }
                        }
                    }
                }
            );

            return;
        } else {
            console.log("picture is null");
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('deletePicture')
    async deletePicture(
        @Request() req,
        @Body() data: {
            pet_picture_id: string;
            pet_picture_link: string;
            profile_id: string;
        },
    ): Promise<void> {
        let isUserPictureOwner: Boolean = await this.petService.isUserPictureOwner({
            pet_picture_id: Number(data.pet_picture_id),
            uid: req.user.uid,
        });

        if (isUserPictureOwner) {

            // let s3PicturePath: string = 'petpictures/' + bucketName + '/' + filename;
            // await resizeAndSaveImageJpeg(directoryPath + picturePath, files.picture[0]['path'], 500, 500, 90);

            var str = data.pet_picture_link;
            let key: string = str.substring(str.indexOf("/") + 1);
            let bucket: string = str.substring(0, str.indexOf("/"));
            console.log("Key: " + key);
            console.log("Bucket: " + bucket);

            await this.petService.updatePet(
                {
                    where: {
                        profile_id: Number(data.profile_id)
                    },
                    data: {
                        pet_pictures: {
                            delete: {
                                pet_picture_id: Number(data.pet_picture_id),
                            }
                        }
                    }
                }
            );

            /**
            * Delete Pet Picture from Vultr
            */
            await this.s3uploadService.delete(key, bucket);
        } else {
            console.log("picture is null");
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getPetPictures/:profile_id')
    async getPetPictures(@Request() req: any, @Param('profile_id') profile_id: string): Promise<PetPicture[]> {
        return this.petService.PetPictures(
            {
                where: {
                    petProfile_id: Number(profile_id)
                },
            }
        );
    }




    //Picture Upload

    /**
     * Updates the User's Profile Information
     * @param picture for the new Profile Picture file
     * @param profileBio for the new Profile Bio
     */
    @UseGuards(TokenIdAuthGuard)
    @Post('uploadDocument/:profile_id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'document', maxCount: 1, },
    ], {
        storage: diskStorage({
            destination: directoryPath + "uploads",
        }),
    }
    ))
    async uploadDocument(
        @Request() req,
        @UploadedFiles() files: { document?: Express.Multer.File[] },
        @Param('profile_id') profile_id: string,
        @Body() data: {
            document_name: string;
            document_type: string;
            content_type: string;
        },
    ): Promise<void> {
        if (files.document != null) {
            console.log("document is not null");

            let documentFileSize = await this.petService.sizePetDocuments({
                profileId: Number(profile_id)
            }) + files.document[0]['size'] / (1024 * 1024);

            if (documentFileSize > maxDocuemntFileSizePerPetProfileInMB) {
                console.log("docuemnts amount to too much storage space for this Pet Profile");
                return;
            }

            let filename: string = files.document[0]['filename'];

            // let document_type: DocumentTypeEnum = this.petService.stringToDocumentType(data.document_type);

            let bucketName: string = 'petdocuments';
            let key: string = 'documents/';
            let s3PicturePath: string = bucketName + '/' + key + filename;



            /**
            * Upload Pet Doucment to Vultr
            */
            if (data.content_type == 'pdf' || 'image') {
                let content_type: MediaType = MediaType.Image;
                if (data.content_type == 'pdf') {
                    content_type = MediaType.PDF;
                    // s3PicturePath += ".pdf";
                }
                await this.s3uploadService.upload(files.document[0]['path'],
                    filename, content_type, key, bucketName);


                await this.petService.updatePet(
                    {
                        where: {
                            profile_id: Number(profile_id)
                        },
                        data: {
                            pet_documents: {
                                create: {
                                    document_link: s3PicturePath,
                                    document_name: data.document_name,
                                    // document_type: document_type,
                                    content_type: data.content_type,
                                    size_megabyte: files.document[0]['size'] / (1024 * 1024),
                                }
                            }
                        }
                    }
                );
            }
            return;
        } else {
            console.log("document is null");
        }
    }



    @UseGuards(TokenIdAuthGuard)
    @Post('deleteDocument')
    async deleteDocument(
        @Request() req,
        @Body() data: {
            pet_document_id: string;
            pet_document_link: string;
            profile_id: string;
        },
    ): Promise<void> {
        let isUserDocumentOwner: Boolean = await this.petService.isUserDocumentOwner({
            document_id: Number(data.pet_document_id),
            uid: req.user.uid,
        });

        if (isUserDocumentOwner) {

            // let s3PicturePath: string = 'petpictures/' + bucketName + '/' + filename;
            // await resizeAndSaveImageJpeg(directoryPath + picturePath, files.picture[0]['path'], 500, 500, 90);

            var str = data.pet_document_link;
            let key: string = str.substring(str.indexOf("/") + 1);
            let bucket: string = str.substring(0, str.indexOf("/"));
            console.log("Key: " + key);
            console.log("Bucket: " + bucket);

            await this.petService.updatePet(
                {
                    where: {
                        profile_id: Number(data.profile_id)
                    },
                    data: {
                        pet_documents: {
                            delete: {
                                document_id: Number(data.pet_document_id),
                            }
                        }
                    }
                }
            );

            /**
            * Delete Pet Picture from Vultr
            */
            await this.s3uploadService.delete(key, bucket);
        } else {
            console.log("deletable document is null");
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateDocument')
    async updateDocument(
        @Request() req: any,
        @Body() data: {
            document_id: number;
            document_name: string;
            document_type: string;
        },
    ): Promise<Document> {
        return this.petService.updateDocument(
            {
                data: {
                    document_name: data.document_name,
                    // document_type: this.petService.stringToDocumentType(data.document_type),
                },
                where: {
                    document_id: data.document_id
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateContactVisibility')
    async updateContactVisibility(
        @Request() req: any,
        @Body() data: {
            contact_visbility: boolean;
            petProfileId: number;
        },
    ): Promise<Pet> {
        return this.petService.updatePet(
            {

                where: {
                    profile_id: data.petProfileId,
                },
                data: {
                    hide_contacts: data.contact_visbility,
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getPetDocuments/:profile_id')
    async getPetDocuments(@Request() req: any, @Param('profile_id') profile_id: string): Promise<Document[]> {
        return this.petService.Documents(
            {
                where: {
                    petProfile_id: Number(profile_id)
                },
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getDocument/:document_id')
    async getDocument(@Request() req: any, @Param('document_id') document_id: string): Promise<Document> {
        return this.petService.Document(
            {
                where: {
                    document_id: Number(document_id)
                },
            }
        );
    }



    //Pet
    @UseGuards(TokenIdAuthGuard)
    @Get('getUserPets')
    async getUserPets(@Request() req: any): Promise<Pet[]> {
        // console.log(req.user);
        return this.petService.Pets(
            {
                where: {
                    user: {
                        uid: req.user.uid
                    }
                },
                orderBy: {
                    profile_creation_DateTime: 'desc'
                }
            }
        );
    }

    @Get('getPet/:profile_id')
    async getUserPet(@Param('profile_id') profile_id: string
    ): Promise<Pet> {
        return this.petService.Pet(
            { profile_id: Number(profile_id) }
        );
    }

    @Get('getPetFromScan/:code')
    async getPetFromScan(@Param('code') code: string
    ): Promise<Pet> {
        let pets = await this.petService.Pets(
            {
                where: {
                    Tag: {
                        some: {
                            // activationCode: code
                            publicCode: code
                        }
                    }
                },
                take: 1
            }
        );
        return pets.at(0);
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getPetsFromContact/:contact_id')
    async getPetsFromContact(@Request() req: any, @Param('contact_id') contact_id: string): Promise<Pet[]> {
        // console.log(req.user);
        return this.petService.Pets(
            {
                where: {
                    Contact: {
                        some: {
                            contact_id: Number(contact_id),
                        }
                    }
                },
                orderBy: {
                    profile_creation_DateTime: 'desc'
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('createPet')
    async createPet(
        @Request() req: any,
        @Body() data: {
            pet_name: string;
            pet_gender?: string;
            pet_chip_id?: string | null;
            // pet_owner_name?: string | null;
            // pet_owner_email?: string | null;
            // pet_owner_living_place?: string | null;
            // pet_owner_facebook?: string | null;
            // pet_owner_instagram?: string | null;
            pet_is_Lost: boolean;
        },
    ): Promise<Pet> {
        return this.petService.createPet(
            {
                user: {
                    connect: {
                        uid: req.user.uid
                    }
                },
                pet_name: data.pet_name,
                pet_gender: this.petService.parseGenderFromString(data.pet_gender),
                pet_chip_id: data.pet_chip_id,
                // pet_owner_name: data.pet_owner_name,
                // pet_owner_email: data.pet_owner_email,
                // pet_owner_living_place: data.pet_owner_living_place,
                // pet_owner_facebook: data.pet_owner_facebook,
                // pet_owner_instagram: data.pet_owner_instagram,
                pet_is_Lost: Boolean(data.pet_is_Lost),
                BehaviourInformation: {
                    create: {}
                },
                MedicalInformation: {
                    create: {}
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updatePet')
    async updatePet(
        @Request() req: any,
        @Body() data: {
            profile_id: number;
            pet_name: string;
            pet_gender?: string;
            pet_chip_id?: string | null;
            // pet_owner_name?: string | null;
            // pet_owner_email?: string | null;
            // pet_owner_living_place?: string | null;
            // pet_owner_facebook?: string | null;
            // pet_owner_instagram?: string | null;
            pet_is_Lost: boolean;
            pet_is_lost_text: string;
            pet_tattooID?: string;
            pet_licenceID?: string;
            pet_favorite_toys?: string;
            pet_favorite_activities?: string;
            pet_behavioral_notes?: string;
            pet_special_needs?: string;
            pet_diet_preferences?: string;
            scan_hide_contacts: boolean;
            scan_hide_information: boolean;
            scan_hide_medical: boolean;
            scan_hide_pictures: boolean;
            scan_hide_documents: boolean;
            scan_hide_description: boolean;
            hide_contacts: boolean;
            hide_information: boolean;
            hide_medical: boolean;
            hide_pictures: boolean;
            hide_documents: boolean;
            hide_description: boolean;
            description: string;
        },
    ): Promise<Pet> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.profile_id,
            uid: req.user.uid,
        })) {
            return this.petService.updatePet(
                {
                    data: {
                        pet_name: data.pet_name,
                        pet_gender: this.petService.parseGenderFromString(data.pet_gender),
                        pet_chip_id: data.pet_chip_id,
                        // pet_owner_name: data.pet_owner_name,
                        // pet_owner_email: data.pet_owner_email,
                        // pet_owner_living_place: data.pet_owner_living_place,
                        // pet_owner_facebook: data.pet_owner_facebook,
                        // pet_owner_instagram: data.pet_owner_instagram,
                        pet_is_Lost: data.pet_is_Lost,
                        pet_is_lost_text: data.pet_is_lost_text,
                        pet_tattooID: data.pet_tattooID,
                        pet_licenceID: data.pet_licenceID,
                        pet_favorite_toys: data.pet_favorite_toys,
                        pet_favorite_activities: data.pet_favorite_activities,
                        pet_behavioral_notes: data.pet_behavioral_notes,
                        pet_special_needs: data.pet_special_needs,
                        pet_diet_preferences: data.pet_diet_preferences,
                        scan_hide_contacts: data.scan_hide_contacts,
                        scan_hide_information: data.scan_hide_information,
                        scan_hide_medical: data.scan_hide_medical,
                        scan_hide_pictures: data.scan_hide_pictures,
                        scan_hide_documents: data.scan_hide_documents,
                        scan_hide_description: data.scan_hide_description,
                        hide_contacts: data.hide_contacts,
                        hide_information: data.hide_information,
                        hide_medical: data.hide_medical,
                        hide_pictures: data.hide_pictures,
                        hide_documents: data.hide_documents,
                        hide_description: data.hide_description,
                        description: data.description,

                    },
                    where: {
                        profile_id: data.profile_id
                    }
                }
            );
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateSingleDescription')
    async updateSingleDescription(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            description_text: string;
        },
    ): Promise<Pet> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            uid: req.user.uid,
        })) {
            return this.petService.updatePet(
                {
                    data: {
                        description: data.description_text
                    },
                    where: {
                        profile_id: data.petProfile_id
                    }
                }
            );
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Delete('deletePet')
    async deletePet(
        @Request() req: any,
        @Body() data: {
            profile_id: number;
        },
    ): Promise<Pet> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.profile_id,
            uid: req.user.uid,
        })) {
            return this.petService.deletePet(
                {
                    profile_id: data.profile_id
                },
            );
        }
    }

    //Description
    @UseGuards(TokenIdAuthGuard)
    @Post('upsertDescription')
    async upsertDescription(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
            description_text: string;
        },
    ): Promise<Description> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            uid: req.user.uid,
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

    @UseGuards(TokenIdAuthGuard)
    @Delete('deleteDescription')
    async deleteDescription(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            language_key: string;
        },
    ): Promise<Description> {
        if (await this.petService.isUserPetOwner({
            profile_id: data.petProfile_id,
            uid: req.user.uid,
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
    // @UseGuards(TokenIdAuthGuard)
    // @Post('upsertImportantInformation')
    // async upsertImportantInformation(
    //     @Request() req: any,
    //     @Body() data: {
    //         important_information_id: number;
    //         petProfile_id: number;
    //         important_information_text: string;
    //     },
    // ): Promise<ImportantInformation> {
    //     if (await this.petService.isUserPetOwner({
    //         profile_id: data.petProfile_id,
    //         uid: req.user.uid,
    //     })) {
    //         return this.petService.upsertImportantInformation(
    //             {
    //                 create: {
    //                     Pet: {
    //                         connect: {
    //                             profile_id: data.petProfile_id
    //                         }
    //                     },
    //                     important_information_text: data.important_information_text
    //                 },
    //                 update: {
    //                     important_information_text: data.important_information_text
    //                 },
    //                 where: {
    //                     important_information_id: data.important_information_id
    //                 },
    //             }
    //         );
    //     }

    // }

    // @UseGuards(TokenIdAuthGuard)
    // @Delete('deleteImportantInformation')
    // async deleteImportantInformation(
    //     @Request() req: any,
    //     @Body() data: {
    //         petProfile_id: number;
    //         language_key: string;
    //     },
    // ): Promise<ImportantInformation> {
    //     if (await this.petService.isUserPetOwner({
    //         profile_id: data.petProfile_id,
    //         uid: req.user.uid,
    //     })) {
    //         return this.petService.deleteImportantInformation(
    //             {
    //                 petProfile_id_important_information_language_key: {
    //                     important_information_language_key: data.language_key,
    //                     petProfile_id: data.petProfile_id
    //                 }
    //             },
    //         );
    //     }

    // }

    //Language
    @Get('getLanguages')
    async getLanguages(): Promise<Language[]> {
        return this.petService.Language({});
    }

    @Post('createLanguage')
    async createLanguage(
        @Body() data: {
            language_key: string;
            language_label: string;
            language_flag_image_path: string;
            language_key_translate: string;
            // language_country_prefix: string;
            language_isAvailableForAppTranslation: boolean;
        },
    ): Promise<Language> {
        return this.petService.createLanguage(
            {
                language_key: data.language_key,
                language_label: data.language_label,
                language_isAvailableForAppTranslation: data.language_isAvailableForAppTranslation,
                langauge_flag_image_path: data.language_flag_image_path,
                language_key_translate: data.language_key_translate,
            }
        );
    }

    //Country
    // @Get('getCountries')
    // async getCountries(): Promise<Country[]> {
    //     return this.petService.Country({});
    // }

    // @Post('createCountry')
    // async createCountry(
    //     @Body() data: {
    //         country_key: string;
    //         country_language_key: string;
    //         country_flag_image_path: string;
    //         country_phone_prefix: string;
    //     },
    // ): Promise<Country> {
    //     return this.petService.createCountry(
    //         {
    //             country_flag_image_path: data.country_flag_image_path,
    //             country_key: data.country_key,
    //             country_phone_prefix: data.country_phone_prefix,
    //             country_language: {
    //                 connect: {
    //                     language_key: data.country_language_key
    //                 }
    //             }
    //         }
    //     );
    // }

    // @Post('createCountries')
    // async createCountries(
    //     @Body() data,
    // ): Promise<Country> {
    //     return this.petService.createCountries(
    //         data
    //     );
    // }


    //Tags
    @Post('connectTagFromPetProfile')
    async connectTagFromPetProfile(
        @Body() data: {
            profileId: number;
            collarTagId: string;
        },
    ): Promise<Pet> {
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
    ): Promise<Pet> {
        return this.petService.disconnectTagFromPetProfile({
            profileId: data.profileId,
            collarTagId: data.collarTagId,
        });
    }

    //Behaviour
    @Get('getBehaviourInformation/:profile_id')
    async getBehaviourInformation(@Param('profile_id') profile_id: string
    ): Promise<BehaviourInformation> {
        return this.petService.BehaviourInformation(
            {
                where: {
                    petProfile_id: Number(profile_id)
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateBehaviourInformation')
    async updateBehaviourInformation(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            good_with_cars?: boolean;
            good_with_kids?: boolean;
            good_with_cats?: boolean;
            good_with_dogs?: boolean;
            good_with_strangers?: boolean;
        },
    ): Promise<BehaviourInformation> {
        return this.petService.updateBehaviourInformation(
            {
                data: {
                    good_with_cars: data.good_with_cars,
                    good_with_dogs: data.good_with_dogs,
                    good_with_cats: data.good_with_cats,
                    good_with_kids: data.good_with_kids,
                    good_with_strangers: data.good_with_strangers,
                },
                where: {
                    petProfile_id: data.petProfile_id
                }
            }
        );
    }


    //Medical
    @Get('getMedicalInformation/:profile_id')
    async getMedicalInformation(@Param('profile_id') profile_id: string
    ): Promise<MedicalInformation> {
        return this.petService.MedicalInformation(
            {
                where: {
                    petProfile_id: Number(profile_id)
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateMedicalInformation')
    async updateMedicalInformation(
        @Request() req: any,
        @Body() data: {
            medical_information_id: number;
            sterilized: boolean;
            breed?: string;
            age?: string;
            vaccinations?: string;
            allergies?: string;
            medications?: string;
            chronicConditions?: string;
        },
    ): Promise<MedicalInformation> {
        return this.petService.updateMedicalInformation(
            {
                data: {
                    sterilized: data.sterilized,
                    breed: data.breed,
                    age: data.age,
                    vaccinations: data.vaccinations,
                    allergies: data.allergies,
                    medications: data.medications,
                    chronicConditions: data.chronicConditions,
                },
                where: {
                    // petProfile_id: data.petProfile_id
                    medical_information_id: data.medical_information_id
                }
            }
        );
    }

    //HealthIssues
    // @UseGuards(TokenIdAuthGuard)
    @Get('getHealthIssues/:medical_information_id')
    async getHealthIssues(@Request() req: any, @Param('medical_information_id') medical_information_id: string): Promise<HealthIssue[]> {
        return this.petService.HealthIssues(
            {
                where: {
                    medicalInformationMedical_information_id: Number(medical_information_id)
                },
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateHealthIssue')
    async updateHealthIssue(
        @Request() req: any,
        @Body() data: {
            health_issue_id: number;
            health_issue_name: string;
            health_issue_type: string;
            medical_information_id: number;
        },
    ): Promise<HealthIssue> {
        return this.petService.updateHealthIssue(
            {
                data: {
                    health_issue_name: data.health_issue_name,
                    // health_issue_type: this.petService.stringToHealthIssueType(data.health_issue_type),
                    health_issue_type: data.health_issue_type.toLowerCase(),
                },
                where: {
                    health_issue_id: data.health_issue_id
                },
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('createHealthIssue')
    async createHealthIssue(
        @Request() req: any,
        @Body() data: {
            health_issue_name: string;
            health_issue_type: string;
            medical_information_id: number;
        },
    ): Promise<HealthIssue> {
        return this.petService.createHealthIssue(
            {
                data: {
                    health_issue_name: data.health_issue_name,
                    // health_issue_type: this.petService.stringToHealthIssueType(data.health_issue_type),
                    health_issue_type: data.health_issue_type.toLowerCase(),
                    MedicalInformation: {
                        connect: {
                            medical_information_id: data.medical_information_id
                        }
                    },
                },
            }
        );
    }

    @Post('linkDocumentToHealthIssue')
    async linkDocumentToHealthIssue(
        @Body() data: {
            health_issue_id: number;
            document_id: number;
        },
    ): Promise<HealthIssue> {
        return this.petService.updateHealthIssue({
            where: {
                health_issue_id: data.health_issue_id,
            },
            data: {
                linked_document: {
                    connect: {
                        document_id: data.document_id
                    }
                }
            }
        });
    }

    @Post('unlinkDocumentFromHealthIssue')
    async unlinkDocumentFromHealthIssue(
        @Body() data: {
            health_issue_id: number;
        },
    ): Promise<HealthIssue> {
        return this.petService.updateHealthIssue({
            where: {
                health_issue_id: data.health_issue_id,
            },
            data: {
                linked_document: {
                    disconnect: true
                }
            }
        });
    }

    @UseGuards(TokenIdAuthGuard)
    @Delete('deleteHealthIssue')
    async deleteHealthIssue(
        @Request() req: any,
        @Body() data: {
            health_issue_id: number;
        },
    ): Promise<HealthIssue> {
        return this.petService.deleteHealthIssue(
            {
                where: {
                    health_issue_id: data.health_issue_id
                }
            },
        );
    }


}
