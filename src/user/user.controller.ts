import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Post('signupUser')
    async signupUser(
        @Body() userData: { useremail: string; userpassword: string },
    ): Promise<UserModel> {
        return this.userService.createUser(
            {
                useremail: userData.useremail,
                userpassword: bcrypt.hashSync(userData.userpassword, 10),
            }
        );
    }
}
