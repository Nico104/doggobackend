import 'dotenv/config'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";


// dotenv.config({ path: <path-to - env - file >})

@Injectable()
export class TokenIdAuthGuard implements CanActivate {
    // protected authService: AuthService;
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


@Injectable()
export class AdminAuthGuard implements CanActivate {

    // List of valid admin tokens
    private readonly validAdminTokens: string[] = [
        process.env.ADMIN_TOKEN, // You can add more tokens here if needed
    ];

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authToken: string = request.headers.authorization;



        if (!authToken) {
            throw new UnauthorizedException('No authorization token provided');
        }

        // Check if the token is in the list of valid admin tokens
        // if (this.validAdminTokens.includes(authToken)) {
        if (process.env.ADMIN_TOKEN == authToken) {
            return true;
        } else {
            console.log('Type of Admin Token from ENV:', typeof process.env.ADMIN_TOKEN);
            console.log('Type of Received Auth Token:', typeof authToken);
            console.log('Admin Token from ENV:', process.env.ADMIN_TOKEN);
            console.log('Received Auth Token:', authToken);
            throw new ForbiddenException('Invalid admin token');
        }
    }
}