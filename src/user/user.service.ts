import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma, PendingAccount } from '@prisma/client';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private mailService: MailService) { }

    async User(
        UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
    ): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: UserWhereUniqueInput,
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
                useremail: useremail
            }
        });
    }

    /**
     * Cecks if a pssed Code corresponds to the Users Pending Account
     * @param useremail the email with which a new User tred to login
     * @param code for the code to check
     * @returns false if no Pending Account corresponds, otherwise true
     */
    async checkCode(
        useremail: string,
        code: number
    ): Promise<Boolean> {
        //Write in db
        return await this.prisma.pendingAccount.count({
            where: {
                AND: [
                    {
                        pendingEmail: useremail
                    },
                    {
                        verificationCode: code
                    },
                    {
                        isValid: true
                    }
                ]
            }
        }) != 0;
    }

    /**
     * Creates a new Pending Account record
     * @param useremail the email with which a new User tred to login
     */
    async createPendingAccount(
        useremail: string,
        code: number
    ): Promise<PendingAccount> {
        console.log(useremail);
        //send mail
        this.mailService.sendEmailConfirmationCode(useremail, code.toString());

        //Write in db
        return this.prisma.pendingAccount.create({
            data: {
                pendingEmail: useremail,
                verificationCode: code
            }
        })
    }

    async devalidatePendingAccount(
        useremail: string
    ): Promise<any> {
        return this.prisma.pendingAccount.updateMany({
            where: {
                pendingEmail: useremail
            },
            data: {
                isValid: false
            }
        })
    }
}