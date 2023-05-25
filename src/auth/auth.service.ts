import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
// import bcrypt from 'bcrypt';

import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRecord } from "firebase-admin/lib/auth/user-record";

@Injectable()
export class AuthService {
    constructor(private userService: UserService) { }

    async checkUser(
        params: {
            ourdecodedToken: DecodedIdToken;
            userRecord: UserRecord;
        }
    ): Promise<User> {
        return await this.userService.upsertUser(
            {
                where: {
                    uid: params.ourdecodedToken.uid
                },
                create: {
                    uid: params.ourdecodedToken.uid,
                    email: params.ourdecodedToken.email,
                    email_verified: params.ourdecodedToken.email_verified,
                    displayName: params.userRecord.displayName,
                    providerId: params.userRecord.providerData[0].providerId,
                },
                update: {
                    email: params.ourdecodedToken.email,
                    email_verified: params.ourdecodedToken.email_verified,
                    //Dont update if the Name should be a plattfrom specific thing!
                    // displayName: params.userRecord.displayName,
                    providerId: params.userRecord.providerData[0].providerId,
                }
            }
        );

    }

    // async validateUser(useremail: string, userpassword: string): Promise<any> {
    //     // const user = await this.userService.findOne(username);
    //     const user = await this.userService.User({
    //         useremail: useremail
    //     });

    //     const bcrypt = require('bcrypt');
    //     //const saltRounds = 10;

    //     console.log("Compare Result: " + await bcrypt.compare(userpassword, user.userpassword));
    //     if (user && await bcrypt.compare(userpassword, user.userpassword)) {
    //         console.log("authenticated also isgut");
    //         const { userpassword, ...result } = user;
    //         return result;
    //     }

    //     return null;
    // }


    // async login(user: User) {
    //     const payload = {
    //         useremail: user.useremail
    //     };

    //     return {
    //         access_token: this.jwtService.sign(payload),
    //     }
    // }
}
