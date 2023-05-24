import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './google.strategy';
import { UserService } from 'src/user/user.service';
import { PrismaModule } from 'src/prisma.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    // PassportModule,
    // JwtModule.register({
    //   secret: process.env.SECRET,
    //   signOptions: {
    //     expiresIn: '6000s'
    //   }
    // }),
    PrismaModule,
    MailModule,
  ],
  providers: [AuthService, UserService],
  exports: [AuthService]
})
export class AuthModule { }
