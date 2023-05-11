import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { PetService } from './pet.service';
import { Pet as PetModel, Description as DescriptionModel, ImportantInformation as ImportantInformationModel, Gender, Language, CollarTag, User, DocumentType as DocumentTypeEnum, PhoneNumber, Country } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { MediaType, S3uploadService } from 'src/s3upload/s3upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { unlink } from 'fs';
import { GlobalService } from 'src/utils/global.service';

var directoryPath = GlobalService.rootPath + 'MediaFiles/';


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
    @UseGuards(JwtAuthGuard)
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
    ): Promise<void> {
        // var picturePath = 'uploads/default/defaultProfilePicture.png';
        // let spacesPicturePath: string = 'profile/default/defaultProfilePicture';
        if (files.picture != null) {
            console.log("picture is not null");

            let filename: string = files.picture[0]['filename'];

            /**
            * Processes and resized the uploaded Thumbnail File
            */
            var picturePath = 'uploads/' + filename + '.png';


            let bucketName: string = 'petpictures';
            let s3PicturePath: string = bucketName + '/' + 'petpictures/' + filename;


            await resizeAndSaveImageJpeg(directoryPath + picturePath, files.picture[0]['path'], 500, 500, 80);


            /**
            * Upload Pet Picture to Vultr
            */
            await this.s3uploadService.upload(directoryPath + picturePath,
                filename, MediaType.Image, 'petpictures/', bucketName);


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

    @UseGuards(JwtAuthGuard)
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
            useremail: req.useremail,
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


    //Picture Upload

    /**
     * Updates the User's Profile Information
     * @param picture for the new Profile Picture file
     * @param profileBio for the new Profile Bio
     */
    @UseGuards(JwtAuthGuard)
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

            let filename: string = files.document[0]['filename'];

            let document_type: DocumentTypeEnum = this.petService.stringToDocumentType(data.document_type);

            let bucketName: string = 'petdocuments';
            let s3PicturePath: string = bucketName + '/' + this.petService.documentTypeToString(document_type) + '/' + filename;



            /**
            * Upload Pet Doucment to Vultr
            */
            if (data.content_type == 'pdf' || 'image') {
                let content_type: MediaType = MediaType.Image;
                if (data.content_type == 'pdf') {
                    content_type = MediaType.PDF;
                }
                await this.s3uploadService.upload(files.document[0]['path'],
                    filename, content_type, this.petService.documentTypeToString(document_type) + '/', bucketName);


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
                                    document_type: document_type,
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



    @UseGuards(JwtAuthGuard)
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
            useremail: req.useremail,
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
                orderBy: {
                    profile_creation_DateTime: 'desc'
                }
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
                pet_is_Lost: Boolean(data.pet_is_Lost),
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

    //Phone Number
    @UseGuards(JwtAuthGuard)
    @Post('updatePhoneNumber')
    async updatePhoneNumber(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            country_key: string;
            phone_number: string;
            phone_number_id: number;
            phone_number_priority: number;
        },
    ): Promise<PhoneNumber> {
        if (await this.petService.isUserPhoneNumberOwner({
            useremail: req.user.useremail,
            phone_number_id: data.phone_number_id,
        }) || data.phone_number_id == null) {
            return this.petService.updatePhoneNumber(
                {
                    data: {
                        phone_number: data.phone_number,
                        Country: {
                            connect: {
                                country_key: data.country_key
                            }
                        },
                        phone_number_priority: data.phone_number_priority
                    },
                    where: {
                        phone_number_id: data.phone_number_id
                    },
                }
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('createPhoneNumber')
    async createPhoneNumber(
        @Request() req: any,
        @Body() data: {
            petProfile_id: number;
            country_key: string;
            phone_number: string;
        },
    ): Promise<PhoneNumber> {
        return this.petService.createPhoneNumber(
            {
                Country: {
                    connect: {
                        country_key: data.country_key
                    }
                },
                Pet: {
                    connect: {
                        profile_id: data.petProfile_id
                    }
                },
                phone_number: data.phone_number,
            }
        );
    }


    @UseGuards(JwtAuthGuard)
    @Delete('deletePhoneNumber')
    async deletePhoneNumber(
        @Request() req: any,
        //? possible to put in params
        @Body() data: {
            phone_number_id: string;
        },
    ): Promise<PhoneNumber> {
        console.log("Phone Number ID: " + data.phone_number_id);
        if (await this.petService.isUserPhoneNumberOwner({
            useremail: req.user.useremail,
            phone_number_id: Number(data.phone_number_id),
        })) {
            return this.petService.deletePhoneNumber(
                {
                    phone_number_id: Number(data.phone_number_id),
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

    @Post('createLanguage')
    async createLanguage(
        @Body() data: {
            language_key: string;
            language_label: string;
            // language_image_path: string;
            // language_country: string;
            // language_country_prefix: string;
            language_isAvailableForAppTranslation: boolean;
        },
    ): Promise<Language> {
        return this.petService.createLanguage(
            {
                language_key: data.language_key,
                language_label: data.language_label,
                language_isAvailableForAppTranslation: data.language_isAvailableForAppTranslation,
            }
        );
    }

    //Language
    @Get('getCountries')
    async getCountries(): Promise<Country[]> {
        return this.petService.Country({});
    }

    @Post('createCountry')
    async createCountry(
        @Body() data: {
            country_key: string;
            country_language_key: string;
            country_flag_image_path: string;
            country_phone_prefix: string;
        },
    ): Promise<Country> {
        return this.petService.createCountry(
            {
                country_flag_image_path: data.country_flag_image_path,
                country_key: data.country_key,
                country_phone_prefix: data.country_phone_prefix,
                country_language: {
                    connect: {
                        language_key: data.country_language_key
                    }
                }
            }
        );
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


/**
 * Resizes and saves image to a jpeg File
 * @param newPath Path where converted Image should be stored
 * @param oldPath Path of the Image which should be converted
 * @param width Resizing to width
 * @param height Resizing to height
 * @param quality Level of Quality which should be converted to
 */
async function resizeAndSaveImageJpeg(newPath: string, oldPath: string, width: number, height: number, quality: number) {
    const sharp = require('sharp');

    const image = await sharp(oldPath)
    const metadata = await image.metadata()
    console.log(metadata.width, metadata.height)

    console.log("PicturePath: " + newPath);

    let _width: number = null;
    let _height: number = null;
    let _maxSize: number = 720;
    if (metadata.width > _maxSize || metadata.height > _maxSize) {
        if (metadata.width > metadata.height) {
            _width = _maxSize;
        } else if (metadata.height > metadata.width) {
            _height = _maxSize;
        } else if (metadata.height == metadata.width) {
            _height = _maxSize;
            _width = _maxSize;
        }
    }

    console.log(_width, _height)

    // await sharp(oldPath).resize(width, height).toFormat("png").png({ quality: quality })
    //     .toFile(newPath).then(() => {
    //         unlink(oldPath, (err) => {
    //             if (err) throw err;
    //             console.log(oldPath + ' was deleted2');
    //         });
    //     });;
    await sharp(oldPath).resize({ width: _width, height: _height }).toFormat("png").png({ quality: quality })
        .toFile(newPath).then(() => {
            unlink(oldPath, (err) => {
                if (err) throw err;
                console.log(oldPath + ' was deleted2');
            });
        });;
}