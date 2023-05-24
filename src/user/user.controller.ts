import { Body, Controller, Get, Param, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { User, User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import * as admin from 'firebase-admin';
// import { Authorization } from 'src/auth/custom_auth.decorator';
import { TokenIdAuthGuard } from 'src/auth/custom_auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    //     /**
    //    * Creates a new User Account
    //    * @param useremail for the user's email
    //    * @param userpassword for the user's password
    //    */
    //     @Post('signupUser')
    //     async signupUser(
    //         @Body() userData: {
    //             useremail: string;
    //             userpassword: string;
    //             name: string;
    //             verificationCode: string;
    //         },
    //     ): Promise<UserModel> {

    //         //Double check so nobody can just directly send the signupUser request
    //         if (this.userService.checkPendingAccountCode(userData.useremail, Number(userData.verificationCode))) {
    //             this.userService.devalidatePendingAccount(userData.useremail);

    //             return this.userService.createUser(
    //                 {
    //                     useremail: userData.useremail,
    //                     userpassword: bcrypt.hashSync(userData.userpassword, 10),
    //                     name: userData.name,
    //                     ContactDescription: {
    //                         createMany: {
    //                             //create Default Contact Descriptons
    //                             data: [
    //                                 {
    //                                     contact_description_label: "Owner",
    //                                     contact_description_hex: "4169E1",
    //                                 },
    //                                 {
    //                                     contact_description_label: "Vetenarian",
    //                                     contact_description_hex: "50C878",
    //                                 },
    //                             ],
    //                         }
    //                     }
    //                 }
    //             );
    //         } else {
    //             return null;
    //         }
    //     }

    //     @UseGuards(TokenIdAuthGuard)
    //     @Get('getName')
    //     async getName(
    //         @Request() req,
    //     ): Promise<String> {
    //         let _user: User = await this.userService.User(
    //             {
    //                 uid: req.user.uid
    //             }
    //         );

    //         return _user.name;
    //     }

    //     /**
    //    * Checcks if a useremail is available
    //    * @param useremail for the useremail searched for
    //    * @returns true if the Useremail is available, otherweise returns false
    //    */
    //     @Get('isUseremailAvailable/:useremail')
    //     async isUseremailAvailable(
    //         @Param('useremail') useremail: string
    //     ): Promise<boolean> {
    //         return (Number(await this.userService.isUseremailAvailable(useremail)) == 0);
    //     }

    //     /**
    //   * Creates a new Pending Account record
    //   * @param useremail the email with which a new User tred to login
    //   */
    //     @Post('signupPendingAccount')
    //     async signupPendingAccount(
    //         @Body() userData: {
    //             useremail: string;
    //         },
    //     ): Promise<any> {
    //         console.log(userData.useremail);

    //         var code: number = Math.floor(100000 + Math.random() * 900000);
    //         console.log(code.toString())

    //         return this.userService.createPendingAccount(userData.useremail, code);
    //     }

    //     /**
    //      * Cecks if a pssed Code corresponds to the Users Pending Account
    //      * @param useremail the email with which a new User tred to login
    //      * @param code for the code to check
    //      * @returns false if no Pending Account corresponds, otherwise a number true
    //      */
    //     @Post('checkCode')
    //     async checkCode(
    //         @Body() userData: {
    //             useremail: string,
    //             verificationCode: string
    //         },
    //     ): Promise<Boolean> {
    //         return this.userService.checkPendingAccountCode(userData.useremail, Number(userData.verificationCode));
    //     }

    //     //Change Name
    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('updateUserName')
    //     async updateUserName(
    //         @Request() req,
    //         @Body() data: {
    //             name: string
    //         }) {
    //         return this.userService.updateUser(
    //             {
    //                 where: {
    //                     uid: req.user.uid,
    //                 },
    //                 data: {
    //                     name: data.name
    //                 }
    //             }
    //         )
    //     }

    //     //Change Name
    //     /**
    //      * Updates the User's Password
    //      * @param userpassword for the new User password
    //      */
    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('updateName')
    //     async updateName(
    //         @Request() req,
    //         @Body() data: {
    //             name: string
    //         }) {
    //         return this.userService.updateUser(
    //             {
    //                 where: {
    //                     uid: req.user.uid,
    //                 },
    //                 data: {
    //                     name: data.name
    //                 }
    //             }
    //         )
    //     }

    //     //Change Password
    //     /**
    //      * Updates the User's Password
    //      * @param userpassword for the new User password
    //      */
    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('updateUserPassword')
    //     async updateUserPassword(
    //         @Request() req,
    //         @Body() data: {
    //             userpassword: string
    //         }) {
    //         return this.userService.updateUser(
    //             {
    //                 where: {
    //                     uid: req.user.uid,
    //                 },
    //                 data: {
    //                     userpassword: bcrypt.hashSync(data.userpassword, 10),
    //                 }
    //             }
    //         )
    //     }

    //     //Change Email
    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('sendVerificationEmail')
    //     async sendVerificationEmail(
    //         @Request() req,
    //         @Body() data: {
    //             email?: string | null
    //         }) {

    //         var code: number = Math.floor(100000 + Math.random() * 900000);

    //         if (data.email == null) {
    //             return this.userService.sendVerificationEmail(req.user.useremail, req.user.useremail, code.toString());
    //         } else {
    //             return this.userService.sendVerificationEmail(req.user.useremail, data.email, code.toString());
    //         }

    //     }

    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('checkVerificationCode')
    //     async checkVerificationCode(
    //         @Request() req,
    //         @Body() data: {
    //             email?: string | null
    //             code: string,
    //         }): Promise<Boolean> {

    //         if (data.email == null) {
    //             return this.userService.checkVerificationCode(req.user.useremail, req.user.useremail, data.code);
    //         } else {
    //             return this.userService.checkVerificationCode(req.user.useremail, data.email, data.code);
    //         }

    //     }

    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('checkVerificationCodeUpdateEmail')
    //     async checkVerificationCodeUpdateEmail(
    //         @Request() req,
    //         @Body() data: {
    //             email: string,
    //             code: string,
    //         }): Promise<Boolean> {
    //         let isValid: Boolean = await this.userService.checkVerificationCode(req.user.useremail, data.email, data.code);

    //         if (isValid) {
    //             this.userService.updateUser(
    //                 {
    //                     where: {
    //                         uid: req.user.uid
    //                     },
    //                     data: {
    //                         useremail: data.email
    //                     }
    //                 }
    //             );

    //             return true;
    //         } else {
    //             return false;
    //         }
    //     }


    //     ///Messaging FCM
    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('connectDeviceTokenToUser')
    //     async connectDeviceTokenToUser(
    //         @Request() req,
    //         @Body() data: {
    //             token: string
    //         }) {
    //         await this.userService.updateUser(
    //             {
    //                 where: {
    //                     uid: req.user.uid,
    //                 },
    //                 data: {
    //                     DeviceMessagingToken: {
    //                         connectOrCreate: {
    //                             where: {
    //                                 token: data.token
    //                             },
    //                             create: {
    //                                 token: data.token,
    //                             },
    //                         }
    //                     }
    //                 }
    //             }
    //         );
    //     }

    //     @UseGuards(TokenIdAuthGuard)
    //     @Post('deleteDeviceToken')
    //     async deleteDeviceTokenToUser(
    //         @Request() req,
    //         @Body() data: {
    //             token: string
    //         }) {
    //         await this.userService.updateUser(
    //             {
    //                 where: {
    //                     uid: req.user.uid,
    //                 },
    //                 data: {
    //                     DeviceMessagingToken: {
    //                         delete: {
    //                             token: data.token
    //                         }
    //                     }
    //                 }
    //             }
    //         );
    //     }


    @Post('testFCM')
    async testFCM(
        @Body() data: {
            fcmToken: string;
        },
    ): Promise<any> {
        const registrationTokens = [
            data.fcmToken,
        ];

        const message = {
            notification: { title: 'Schmol Tabo', body: '5% off all the tabos' },
            data: { type: "scan" },
            tokens: registrationTokens,
        };

        admin.messaging().sendEachForMulticast(message)
            .then((response) => {
                if (response.failureCount > 0) {
                    const failedTokens = [];
                    response.responses.forEach((resp, idx) => {
                        if (!resp.success) {
                            failedTokens.push(registrationTokens[idx]);
                        }
                    });
                    console.log('List of tokens that caused failures: ' + failedTokens);
                }
            });
    }


    @Post('testIdToken')
    @UseGuards(TokenIdAuthGuard)
    async testIdToken(
        @Request() req,
    ): Promise<any> {

        // console.log(req.user);
        return req.user.uid;

    }

}
