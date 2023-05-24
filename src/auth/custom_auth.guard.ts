import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class TokenIdAuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const { authorization: idToken } = request.headers;

        var ourdecodedToken: DecodedIdToken;
        var userRecord: UserRecord;

        await admin.auth().verifyIdToken(idToken).then(async function (decodedToken) {
            var uid = decodedToken.uid;
            ourdecodedToken = decodedToken;
            userRecord = await admin.auth().getUser(ourdecodedToken.uid);
        }).catch(function (error) {
            // Handle error
            console.log(error);
        });


        if (ourdecodedToken != null) {
            //Store/Update in DB
            request.user = await this.authService.checkUser(
                {
                    ourdecodedToken: ourdecodedToken,
                    userRecord: userRecord
                }
            );

            return true;
        } else {
            return false;
        }
    }
}