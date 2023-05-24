import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '6000s'
      }
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
  exports: [AuthService]
})
export class AuthModule { }
