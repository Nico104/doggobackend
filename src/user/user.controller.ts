import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    /**
   * Creates a new User Account
   * @param useremail for the user's email
   * @param userpassword for the user's password
   */
    @Post('signupUser')
    async signupUser(
        @Body() userData: {
            useremail: string;
            userpassword: string;
            verificationCode: string;
        },
    ): Promise<UserModel> {

        //Double check so nobody can just directly send the signupUser request
        if (this.userService.checkCode(userData.useremail, Number(userData.verificationCode))) {
            this.userService.devalidatePendingAccount(userData.useremail);

            return this.userService.createUser(
                {
                    useremail: userData.useremail,
                    userpassword: bcrypt.hashSync(userData.userpassword, 10),
                    ContactDescription: {
                        createMany: {
                            //create Default Contact Descriptons
                            data: [
                                {
                                    contact_description_label: "Owner",
                                    contact_description_hex: "4169E1",
                                },
                                {
                                    contact_description_label: "Vetenarian",
                                    contact_description_hex: "50C878",
                                },
                            ],
                        }
                    }
                }
            );
        } else {
            return null;
        }
    }

    /**
   * Checcks if a useremail is available
   * @param useremail for the useremail searched for
   * @returns true if the Useremail is available, otherweise returns false
   */
    @Get('isUseremailAvailable/:useremail')
    async isUseremailAvailable(
        @Param('useremail') useremail: string
    ): Promise<boolean> {
        return (Number(await this.userService.isUseremailAvailable(useremail)) == 0);
    }

    /**
  * Creates a new Pending Account record
  * @param useremail the email with which a new User tred to login
  */
    @Post('signupPendingAccount')
    async signupPendingAccount(
        @Body() userData: {
            useremail: string;
        },
    ): Promise<any> {
        console.log(userData.useremail);

        var code: number = Math.floor(100000 + Math.random() * 900000);
        console.log(code.toString())

        return this.userService.createPendingAccount(userData.useremail, code);
    }

    /**
     * Cecks if a pssed Code corresponds to the Users Pending Account
     * @param useremail the email with which a new User tred to login
     * @param code for the code to check
     * @returns false if no Pending Account corresponds, otherwise a number true
     */
    @Post('checkCode')
    async checkCode(
        @Body() userData: {
            useremail: string,
            verificationCode: string
        },
    ): Promise<Boolean> {
        return this.userService.checkCode(userData.useremail, Number(userData.verificationCode));
    }

    //Change Password

    /**
     * Updates the User's Password
     * @param userpassword for the new User password
     */
    @UseGuards(JwtAuthGuard)
    @Post('updateUserPassword')
    async updateUserPassword(
        @Request() req,
        @Body() data: {
            userpassword: string
        }) {
        return this.userService.updateUserPassword(req.user.useremail, bcrypt.hashSync(data.userpassword, 10));
    }
}
