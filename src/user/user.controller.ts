import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
