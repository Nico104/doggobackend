import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
// import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private userService: UserService, private jwtService: JwtService) { }


    async validateUser(username: string, userpassword: string): Promise<any> {
        // const user = await this.userService.findOne(username);
        const user = await this.userService.User({
            useremail: username
        });

        const bcrypt = require('bcrypt');
        //const saltRounds = 10;

        console.log("Compare Result: " + await bcrypt.compare(userpassword, user.userpassword));
        if (user && await bcrypt.compare(userpassword, user.userpassword)) {
            console.log("authenticated also isgut");
            const { userpassword, ...rest } = user;
            return rest;
        }

        return null;
    }


    async login(user: any) {
        const payload = {
            username: user.username
        };

        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
