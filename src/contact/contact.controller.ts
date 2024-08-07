import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ContactService } from './contact.service';
import { MediaType, S3uploadService } from 'src/s3upload/s3upload.service';
import { AnyFilesInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { Contact, ContactOnSocialMedia, PhoneNumber, SocialMedia } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GlobalService } from 'src/utils/global.service';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';


var directoryPath = GlobalService.rootPath + 'MediaFiles/';


//TODO Cybersecurity xD
@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
        private readonly s3uploadService: S3uploadService,
    ) { }


    @UseGuards(TokenIdAuthGuard)
    @Get('getUserContacts')
    async getUserContacts(@Request() req: any): Promise<Contact[]> {
        return this.contactService.Contacts({
            where: {
                createdBy: {
                    uid: req.user.uid
                }
            },
            orderBy: {
                contact_creation_DateTime: 'desc'
            }
        });
    }

    @UseGuards(TokenIdAuthGuard)
    @Get('getPetContacts/:petProfileId')
    async getPetContacts(@Request() req: any, @Param('petProfileId') petProfileId: string): Promise<Contact[]> {
        return this.contactService.Contacts({
            where: {
                // petProfile_id: Number(petProfileId)
                Pet: {
                    some: {
                        profile_id: Number(petProfileId)
                    }
                }
            },
            orderBy: {
                contact_creation_DateTime: 'desc'
            }
        });
    }


    @UseGuards(TokenIdAuthGuard)
    @Get('getContact/:contactId')
    async getContact(@Param('contactId') contactId: string
    ): Promise<Contact> {
        return this.contactService.Contact(
            { contact_id: Number(contactId) }
        );
    }


    @UseGuards(TokenIdAuthGuard)
    @Post('createContact')
    async createContact(
        @Request() req: any,
        @Body() data: {
            // pet_profile_id: number;
            contact_name: string;
            contact_picture_link?: string;
            contact_email?: string;
            contact_address?: string;
            contact_facebook?: string;
            contact_instagram?: string;
        },
    ): Promise<Contact> {
        return this.contactService.createContact(
            {
                // Pet: {
                //     connect: {
                //         profile_id: data.pet_profile_id
                //     }
                // },
                contact_name: data.contact_name,
                contact_picture_link: data.contact_picture_link,
                contact_email: data.contact_email,
                contact_address: data.contact_address,
                contact_facebook: data.contact_facebook,
                contact_instagram: data.contact_instagram,
                createdBy: {
                    connect: {
                        uid: req.user.uid
                    }
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('connectContactToPet')
    async connectContactToPet(
        @Request() req: any,
        @Body() data: {
            pet_profile_id: number;
            contact_id: number;
        },
    ): Promise<Contact> {
        return this.contactService.updateContact(
            {
                where: {
                    contact_id: data.contact_id
                },
                data: {
                    Pet: {
                        connect: {
                            profile_id: data.pet_profile_id
                        }
                    }
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('disconnectContactFromPet')
    async disconnectContactFromPet(
        @Request() req: any,
        @Body() data: {
            pet_profile_id: number;
            contact_id: number;
        },
    ): Promise<Contact> {
        return this.contactService.updateContact(
            {
                where: {
                    contact_id: data.contact_id
                },
                data: {
                    Pet: {
                        disconnect: {
                            profile_id: data.pet_profile_id
                        }
                    }
                }
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('updateContact')
    async updateContact(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
            contact_name?: string;
            contact_picture_link?: string;
            contact_email?: string;
            contact_address?: string;
            contact_facebook?: string;
            contact_instagram?: string;
        },
    ): Promise<Contact> {
        return this.contactService.updateContact(
            {
                data: {
                    contact_name: data.contact_name,
                    contact_picture_link: data.contact_picture_link,
                    contact_email: data.contact_email,
                    contact_address: data.contact_address,
                    contact_facebook: data.contact_facebook,
                    contact_instagram: data.contact_instagram,
                },
                where: {
                    contact_id: data.contact_id
                }

            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Delete('deleteContact')
    async deleteContact(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
        },
    ): Promise<Contact> {
        let contact: Contact = await this.contactService.Contact(
            { contact_id: Number(data.contact_id) }
        );

        if (contact.contact_picture_link != null) {
            var str = contact.contact_picture_link;
            let key: string = str.substring(str.indexOf("/") + 1);
            let bucket: string = str.substring(0, str.indexOf("/"));
            console.log("Key: " + key);
            console.log("Bucket: " + bucket);
            await this.s3uploadService.delete(key, bucket);
        }

        return this.contactService.deleteContact(
            {
                contact_id: data.contact_id
            },
        );
    }

    //Phone Number
    @Post('updatePhoneNumber')
    async updatePhoneNumber(
        @Request() req: any,
        @Body() data: {
            // contact_id: number;
            // country_key: string;
            phone_number: string;
            phone_number_id: number;
            phone_number_priority: number;
        },
    ): Promise<PhoneNumber> {
        return this.contactService.updatePhoneNumber(
            {
                data: {
                    phone_number: data.phone_number,
                    // Country: {
                    //     connect: {
                    //         country_key: data.country_key
                    //     }
                    // },
                    phone_number_priority: data.phone_number_priority
                },
                where: {
                    phone_number_id: data.phone_number_id
                },
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('createPhoneNumber')
    async createPhoneNumber(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
            // country_key: string;
            phone_number: string;
        },
    ): Promise<PhoneNumber> {
        return this.contactService.createPhoneNumber(
            {
                // Country: {
                //     connect: {
                //         country_key: data.country_key
                //     }
                // },
                Contact: {
                    connect: {
                        contact_id: data.contact_id
                    }
                },
                phone_number: data.phone_number,
            }
        );
    }

    @UseGuards(TokenIdAuthGuard)
    @Delete('deletePhoneNumber')
    async deletePhoneNumber(
        @Request() req: any,
        //? possible to put in params
        @Body() data: {
            phone_number_id: string;
        },
    ): Promise<PhoneNumber> {
        return this.contactService.deletePhoneNumber(
            {
                phone_number_id: Number(data.phone_number_id),
            },
        );
    }

    //Languages Spoken
    @Post('connectLanguageSpoken')
    async connectLanguageSpoken(
        @Body() data: {
            languageKey: string,
            contactId: number,
        },
    ): Promise<Contact> {
        return this.contactService.connectLanguageSpoken({
            languageKey: data.languageKey,
            contactId: data.contactId,
        });
    }

    @Post('disconnectLanguageSpoken')
    async disconnectLanguageSpoken(
        @Body() data: {
            languageKey: string,
            contactId: number,
        },
    ): Promise<Contact> {
        return this.contactService.disconnectLanguageSpoken({
            languageKey: data.languageKey,
            contactId: data.contactId,
        });
    }



    @Get('getSocialMedias')
    async getSocialMedias(@Request() req: any): Promise<SocialMedia[]> {
        return this.contactService.SocialMedias({});
    }

    @Post('upsertSocialMedia')
    async upsertSocialMedia(
        @Body() data: {
            socialmedia_id: number,
            contactId: number,
            accountName: string,
        },
    ): Promise<ContactOnSocialMedia> {
        return this.contactService.upsertSocialMedia(
            {
                contact: {
                    connect: {
                        contact_id: data.contactId
                    }
                },
                social_media: {
                    connect: {
                        id: data.socialmedia_id
                    }
                },
                social_media_account_name: data.accountName,
            },
            {
                contact: {
                    connect: {
                        contact_id: data.contactId
                    }
                },
                social_media: {
                    connect: {
                        id: data.socialmedia_id
                    }
                },
                social_media_account_name: data.accountName,
            },
            {
                contact_id_social_media_Id: {
                    contact_id: data.contactId,
                    social_media_Id: data.socialmedia_id,
                }
            }
        );
    }

    @Post('deleteSocialMediaConnection')
    async deleteSocialMediaConnection(
        @Body() data: {
            socialmedia_id: number,
            contactId: number,
        },
    ): Promise<ContactOnSocialMedia> {
        return this.contactService.deleteSocialMediaConnection(
            {
                contact_id_social_media_Id: {
                    contact_id: data.contactId,
                    social_media_Id: data.socialmedia_id,
                }
            }
        );
    }

    //Contact Description
    // @UseGuards(TokenIdAuthGuard)
    // @Get('getUserContactDescriptions')
    // async getUserContactDescriptions(@Request() req: any): Promise<ContactDescription[]> {
    //     return this.contactService.ContactDescriptions({
    //         where: {
    //             created_by: {
    //                 uid: req.user.uid
    //             }
    //         }
    //     });
    // }

    // @UseGuards(TokenIdAuthGuard)
    // @Post('connectContactDescription')
    // async connectContactDescription(
    //     @Request() req: any,
    //     @Body() data: {
    //         contact_id: number;
    //         contact_description_id: number;
    //     },
    // ): Promise<Contact> {
    //     return this.contactService.updateContact(
    //         {
    //             data: {
    //                 contact_description: {
    //                     connect: {
    //                         contact_description_id: data.contact_description_id,
    //                     }
    //                 }
    //             },
    //             where: {
    //                 contact_id: data.contact_id
    //             }

    //         }
    //     );
    // }

    // @UseGuards(TokenIdAuthGuard)
    // @Post('disconnectContactDescription')
    // async disconnectContactDescription(
    //     @Request() req: any,
    //     @Body() data: {
    //         contact_id: number;
    //     },
    // ): Promise<Contact> {
    //     return this.contactService.updateContact(
    //         {
    //             data: {
    //                 contact_description: {
    //                     disconnect: true
    //                 }
    //             },
    //             where: {
    //                 contact_id: data.contact_id
    //             }

    //         }
    //     );
    // }


    // @UseGuards(TokenIdAuthGuard)
    // @Post('createContactDescription')
    // async createContactDescription(
    //     @Request() req: any,
    //     @Body() data: {
    //         contact_id: number;
    //         contact_description_hex: string;
    //         contact_description_label: string;
    //     },
    // ): Promise<ContactDescription> {
    //     return this.contactService.createContactDescription(
    //         {
    //             created_by: {
    //                 connect: {
    //                     uid: req.user.uid
    //                 }
    //             },
    //             Contact: {
    //                 connect: {
    //                     contact_id: data.contact_id
    //                 }
    //             },
    //             contact_description_hex: data.contact_description_hex,
    //             contact_description_label: data.contact_description_label,
    //         }
    //     );
    // }

    // @UseGuards(TokenIdAuthGuard)
    // @Post('updateContactDescription')
    // async updateContactDescription(
    //     @Request() req: any,
    //     @Body() data: {
    //         contact_description_id: number;
    //         contact_description_hex: string;
    //         contact_description_label: string;
    //     },
    // ): Promise<ContactDescription> {
    //     return this.contactService.updateContactDescription(
    //         {
    //             data: {
    //                 contact_description_hex: data.contact_description_hex,
    //                 contact_description_label: data.contact_description_label,
    //                 contact_description_updated_DateTime: new Date(),
    //             },
    //             where: {
    //                 contact_description_id: data.contact_description_id,
    //             }

    //         }
    //     );
    // }

    // @Delete('deleteContactDescription')
    // async deleteContactDescription(
    //     @Request() req: any,
    //     @Body() data: {
    //         contact_description_id: number;
    //     },
    // ): Promise<ContactDescription> {
    //     return this.contactService.deleteContactDescription(
    //         {
    //             contact_description_id: data.contact_description_id,
    //         },
    //     );

    // }



    //Contact Picture
    @UseGuards(TokenIdAuthGuard)
    @Post('uploadContactPicture/:contact_id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1, },
    ], {
        storage: diskStorage({
            destination: directoryPath + "uploads",
        }),
    }
    ))
    async uploadContactPicture(
        @Request() req,
        @UploadedFiles() files: { picture?: Express.Multer.File[] },
        @Param('contact_id') contact_id: string
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


            let bucketName: string = 'contactpictures';
            let key: string = 'contactpictures/';
            let s3PicturePath: string = bucketName + '/' + key + filename;

            // let filename: string = files.picture[0]['filename'];
            // // var picturePath = 'uploads/' + filename + '.png';
            // let bucketName: string = 'collartags';
            // let s3PicturePath: string = bucketName + '/' + 'pictures/' + filename;


            await this.s3uploadService.resizeAndSaveImageJpeg(directoryPath + picturePath, files.picture[0]['path'], 500, 500, 80);


            /**
            * Upload Pet Picture to Vultr
            */
            await this.s3uploadService.upload(directoryPath + picturePath,
                filename, MediaType.Image, key, bucketName);


            await this.contactService.updateContact(
                {
                    where: {
                        contact_id: Number(contact_id)
                    },
                    data: {
                        contact_picture_link: s3PicturePath
                    }
                }
            );
            return;
        } else {
            console.log("picture is null");
        }
    }

    @UseGuards(TokenIdAuthGuard)
    @Post('deleteContactPicture')
    async deletePicture(
        @Request() req,
        @Body() data: {
            contact_id: number;
            contact_picture_link: string;
        },
    ): Promise<void> {
        var str = data.contact_picture_link;
        let key: string = str.substring(str.indexOf("/") + 1);
        let bucket: string = str.substring(0, str.indexOf("/"));
        console.log("Key: " + key);
        console.log("Bucket: " + bucket);

        console.log("ContactId: " + data.contact_id);

        await this.contactService.updateContact(
            {
                where: {
                    contact_id: data.contact_id
                },
                data: {
                    contact_picture_link: null
                }
            }
        );

        /**
        * Delete Pet Picture from Vultr
        */
        await this.s3uploadService.delete(key, bucket);
    }
}



