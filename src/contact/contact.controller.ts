import { Body, Controller, Delete, Get, Param, Post, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ContactService } from './contact.service';
import { S3uploadService } from 'src/s3upload/s3upload.service';
import { Contact, PhoneNumber } from '@prisma/client';

//TODO Cybersecurity xD
@Controller('contact')
export class ContactController {
    constructor(
        private readonly contactService: ContactService,
        private readonly s3uploadService: S3uploadService,
    ) { }


    @Get('getPetContacts/:petProfileId')
    async getUserTags(@Request() req: any, @Param('petProfileId') petProfileId: string): Promise<Contact[]> {
        return this.contactService.Contacts({
            where: {
                petProfile_id: Number(petProfileId)
            }
        });
    }


    @Get('getContact/:contactId')
    async getUserPet(@Param('contactId') contactId: string
    ): Promise<Contact> {
        return this.contactService.Contact(
            { contact_id: Number(contactId) }
        );
    }


    @Post('createContact')
    async createContact(
        @Request() req: any,
        @Body() data: {
            pet_profile_id: number;
            contact_name: string;
            contact_picture_link?: string;
            contact_description?: string;
            contact_email?: string;
            contact_address?: string;
            contact_facebook?: string;
            contact_instagram?: string;
        },
    ): Promise<Contact> {
        return this.contactService.createContact(
            {
                Pet: {
                    connect: {
                        profile_id: data.pet_profile_id
                    }
                },
                contact_name: data.contact_name,
                contact_picture_link: data.contact_picture_link,
                contact_description: data.contact_description,
                contact_email: data.contact_email,
                contact_address: data.contact_address,
                contact_facebook: data.contact_facebook,
                contact_instagram: data.contact_instagram,
            }
        );
    }

    @Post('updateContact')
    async updateContact(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
            contact_name?: string;
            contact_picture_link?: string;
            contact_description?: string;
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
                    contact_description: data.contact_description,
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

    @Delete('deleteContact')
    async deleteContact(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
        },
    ): Promise<Contact> {
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
            country_key: string;
            phone_number: string;
            phone_number_id: number;
            phone_number_priority: number;
        },
    ): Promise<PhoneNumber> {
        return this.contactService.updatePhoneNumber(
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

    @Post('createPhoneNumber')
    async createPhoneNumber(
        @Request() req: any,
        @Body() data: {
            contact_id: number;
            country_key: string;
            phone_number: string;
        },
    ): Promise<PhoneNumber> {
        return this.contactService.createPhoneNumber(
            {
                Country: {
                    connect: {
                        country_key: data.country_key
                    }
                },
                Contact: {
                    connect: {
                        contact_id: data.contact_id
                    }
                },
                phone_number: data.phone_number,
            }
        );
    }


    @Delete('deletePhoneNumber')
    async deletePhoneNumber(
        @Request() req: any,
        //? possible to put in params
        @Body() data: {
            phone_number_id: string;
        },
    ): Promise<PhoneNumber> {
        // console.log("Phone Number ID: " + data.phone_number_id);
        // if (await this.petService.isUserPhoneNumberOwner({
        //     useremail: req.user.useremail,
        //     phone_number_id: Number(data.phone_number_id),
        // })) {
        //     return this.petService.deletePhoneNumber(
        //         {
        //             phone_number_id: Number(data.phone_number_id),
        //         },
        //     );
        // }
        return this.contactService.deletePhoneNumber(
            {
                phone_number_id: Number(data.phone_number_id),
            },
        );

    }

}