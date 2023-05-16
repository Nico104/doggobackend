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
                    include: {
                        Country: {
                            include: {
                                country_language: true
                            }
                        }
                    }
                },
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
                    include: {
                        Country: {
                            include: {
                                country_language: true
                            }
                        }
                    }
                },
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
                Country: {
                    include: {
                        country_language: true
                    }
                }
            }
        });
    }

    async createPhoneNumber(data: Prisma.PhoneNumberCreateInput): Promise<PhoneNumber> {
        return this.prisma.phoneNumber.create({
            data,
            include: {
                Country: {
                    include: {
                        country_language: true
                    }
                }
            }
        });
    }

    async deletePhoneNumber(where: Prisma.PhoneNumberWhereUniqueInput): Promise<PhoneNumber> {
        return this.prisma.phoneNumber.delete({
            where,
        });
    }
}
