import { Injectable } from '@nestjs/common';
import { Contact, PhoneNumber, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) { }

    async Contacts(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.ContactWhereUniqueInput;
        where?: Prisma.ContactWhereInput;
        orderBy?: Prisma.ContactOrderByWithRelationInput;
    }): Promise<Contact[]> {
        const { skip, take, cursor, where, orderBy, } = params;
        return this.prisma.contact.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                contact_telephone_numbers: {
                    // include: {
                    //     Country: {
                    //         include: {
                    //             country_language: true
                    //         }
                    //     }
                    // }
                },
                // contact_description: true,
                languages_spoken: true,
            }
        });
    }

    async Contact(
        PetWhereUniqueInput: Prisma.ContactWhereUniqueInput,
    ): Promise<Contact | null> {
        return this.prisma.contact.findUnique({
            where: PetWhereUniqueInput,
            include: {
                contact_telephone_numbers: {
                    // include: {
                    //     Country: {
                    //         include: {
                    //             country_language: true
                    //         }
                    //     },
                    // }
                },
                // contact_description: true,
                languages_spoken: true,
            }
        });
    }

    async createContact(data: Prisma.ContactCreateInput): Promise<Contact> {
        return this.prisma.contact.create({
            data,
        });
    }

    async updateContact(params: {
        where: Prisma.ContactWhereUniqueInput;
        data: Prisma.ContactUpdateInput;
    }): Promise<Contact> {
        const { where, data } = params;
        return this.prisma.contact.update({
            data,
            where,
        });
    }

    async deleteContact(where: Prisma.ContactWhereUniqueInput): Promise<Contact> {
        return this.prisma.contact.delete({
            where,
        });
    }

    //Phone Number
    async updatePhoneNumber(params: {
        data: Prisma.PhoneNumberUpdateInput;
        where: Prisma.PhoneNumberWhereUniqueInput;
    }): Promise<PhoneNumber> {
        const { data, where } = params;
        return this.prisma.phoneNumber.update({
            where,
            data,
            include: {
                // Country: {
                //     include: {
                //         country_language: true
                //     }
                // }
            }
        });
    }

    async createPhoneNumber(data: Prisma.PhoneNumberCreateInput): Promise<PhoneNumber> {
        return this.prisma.phoneNumber.create({
            data,
            include: {
                // Country: {
                //     include: {
                //         country_language: true
                //     }
                // }
            }
        });
    }

    async deletePhoneNumber(where: Prisma.PhoneNumberWhereUniqueInput): Promise<PhoneNumber> {
        return this.prisma.phoneNumber.delete({
            where,
        });
    }

    //Languages Spoken

    async connectLanguageSpoken(data: {
        languageKey: string,
        contactId: number,
    }): Promise<Contact> {
        return this.prisma.contact.update({
            where: {
                contact_id: data.contactId,
            },
            data: {
                languages_spoken: {
                    connect: {
                        language_key: data.languageKey
                    }
                }
            },
        });
    }

    async disconnectLanguageSpoken(data: {
        languageKey: string,
        contactId: number,
    }): Promise<Contact> {
        return this.prisma.contact.update({
            where: {
                contact_id: data.contactId,
            },
            data: {
                languages_spoken: {
                    disconnect: {
                        language_key: data.languageKey
                    }
                }
            },
        });
    }


    //Contact Description
    // async ContactDescriptions(params: {
    //     skip?: number;
    //     take?: number;
    //     cursor?: Prisma.ContactDescriptionWhereUniqueInput;
    //     where?: Prisma.ContactDescriptionWhereInput;
    //     orderBy?: Prisma.ContactDescriptionOrderByWithRelationInput;
    // }): Promise<ContactDescription[]> {
    //     const { skip, take, cursor, where, orderBy, } = params;
    //     return this.prisma.contactDescription.findMany({
    //         skip,
    //         take,
    //         cursor,
    //         where,
    //         orderBy,
    //     });
    // }

    // async createContactDescription(data: Prisma.ContactDescriptionCreateInput): Promise<ContactDescription> {
    //     return this.prisma.contactDescription.create({
    //         data,
    //     });
    // }

    // async updateContactDescription(params: {
    //     where: Prisma.ContactDescriptionWhereUniqueInput;
    //     data: Prisma.ContactDescriptionUpdateInput;
    // }): Promise<ContactDescription> {
    //     const { where, data } = params;
    //     return this.prisma.contactDescription.update({
    //         data,
    //         where,
    //     });
    // }

    // async deleteContactDescription(where: Prisma.ContactDescriptionWhereUniqueInput): Promise<ContactDescription> {
    //     return this.prisma.contactDescription.delete({
    //         where,
    //     });
    // }
}
