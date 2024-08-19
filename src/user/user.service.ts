import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma, DeletedUser, NotificationSettings } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private mailService: MailService) { }

    async User(
        UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: UserWhereUniqueInput,
            include: {
                UserSettings: true
            }
        });
    }

    async FirstUserByPet(
        petProfileId: number,
    ): Promise<User | null> {
        return this.prisma.user.findFirst({
            where: {
                Pet: {
                    some: {
                        profile_id: petProfileId
                    }
                }
            },
            include: {
                UserSettings: true
            }
        });
    }

    async Users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async upsertUser(
        params: {
            create: Prisma.UserCreateInput;
            update: Prisma.UserUpdateInput;
            where: Prisma.UserWhereUniqueInput;
        }): Promise<User> {
        const { create, update, where } = params;
        return this.prisma.user.upsert({
            create,
            update,
            where,
        });
    }

    async updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<User> {
        const { where, data } = params;
        return this.prisma.user.update({
            data,
            where,
        });
    }

    async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
        return this.prisma.user.delete({
            where,
        });
    }

    async createDeletedUser(data: Prisma.DeletedUserCreateInput): Promise<DeletedUser> {
        return this.prisma.deletedUser.create({
            data,
        });
    }

    /**
     * Checcks if a useremail is available
     * @param useremail for the useremail searched for
     * @returns 0 if the Useremail is available, otherweise returns 1
     */
    async isUseremailAvailable(
        useremail: string
    ): Promise<number> {
        return this.prisma.user.count({
            where: {
                email: useremail
            }
        });
    }

    async NotificationSettings(
        NotificationSettingsWhereUniqueInput: Prisma.NotificationSettingsWhereUniqueInput,
    ): Promise<NotificationSettings | null> {
        return this.prisma.notificationSettings.findUnique({
            where: NotificationSettingsWhereUniqueInput,
        });
    }

    /**
     * Cecks if a pssed Code corresponds to the Users Pending Account
     * @param useremail the email with which a new User tred to login
     * @param code for the code to check
     * @returns false if no Pending Account corresponds, otherwise true
     */
    // async checkPendingAccountCode(
    //     useremail: string,
    //     code: number
    // ): Promise<Boolean> {
    //     //Write in db
    //     return await this.prisma.pendingAccount.count({
    //         where: {
    //             AND: [
    //                 {
    //                     pendingEmail: useremail
    //                 },
    //                 {
    //                     verificationCode: code
    //                 },
    //                 {
    //                     isValid: true
    //                 }
    //             ]
    //         }
    //     }) != 0;
    // }

    /**
     * Creates a new Pending Account record
     * @param useremail the email with which a new User tred to login
     */
    // async createPendingAccount(
    //     useremail: string,
    //     code: number
    // ): Promise<PendingAccount> {
    //     console.log("Email" + useremail);
    //     //send mail
    //     this.mailService.sendEmailConfirmationCode(useremail, code.toString());

    //     //Write in db
    //     return this.prisma.pendingAccount.create({
    //         data: {
    //             pendingEmail: useremail,
    //             verificationCode: code
    //         }
    //     })
    // }

    // async devalidatePendingAccount(
    //     useremail: string
    // ): Promise<any> {
    //     return this.prisma.pendingAccount.updateMany({
    //         where: {
    //             pendingEmail: useremail
    //         },
    //         data: {
    //             isValid: false
    //         }
    //     })
    // }


    // //Change UserEmail
    // async sendVerificationEmail(
    //     sendByUseremail: string,
    //     email: string,
    //     code: string,
    // ): Promise<ChangeEmailVerificationCode> {
    //     console.log("Sending mail to " + email);
    //     //send mail
    //     this.mailService.sendEmailVerificationCode(email, code);

    //     await this.prisma.changeEmailVerificationCode.updateMany({
    //         where: {
    //             email: email
    //         },
    //         data: {
    //             isValid: false,
    //             unvalidifiedDateTime: new Date(),
    //         }
    //     });

    //     return this.prisma.changeEmailVerificationCode.create({
    //         data: {
    //             email: email,
    //             verificationCode: code,
    //             sendBy: {
    //                 connect: {
    //                     useremail: sendByUseremail
    //                 }
    //             }
    //         }
    //     });
    // }

    // async checkVerificationCode(
    //     sendByUseremail: string,
    //     email: string,
    //     code: string,
    // ): Promise<Boolean> {
    //     let isValid: Boolean = await this.prisma.changeEmailVerificationCode.count({
    //         where: {
    //             AND: [
    //                 {
    //                     email: email
    //                 },
    //                 {
    //                     sendBy: {
    //                         useremail: sendByUseremail
    //                     }
    //                 },
    //                 {
    //                     verificationCode: code
    //                 },
    //                 {
    //                     isValid: true
    //                 }
    //             ]
    //         }
    //     }) != 0;

    //     if (isValid) {
    //         await this.prisma.changeEmailVerificationCode.updateMany({
    //             where: {
    //                 email: email
    //             },
    //             data: {
    //                 isValid: false,
    //                 verifiedDateTime: new Date(),
    //             }
    //         });
    //     }


    //     return isValid;
    // }

    //DeviceMessagingToken
}