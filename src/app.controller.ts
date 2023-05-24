import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { GoogleOAuthGuard } from './auth/google-oauth.guard';
import { TokenIdAuthGuard } from './auth/custom_auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly authService: AuthService
  ) { }

  //https://blog.dominikwawrzynczak.pl/2020/08/oauth-with-nestjs-application-sign-in-with-google/
  // @UseGuards(LocalAuthGuard)
  // @Post('login')
  // // @Post('auth/login')
  // login(@Request() req): any {
  //   return this.authService.login(req.user);
  // }

  @UseGuards(TokenIdAuthGuard)
  @Get('protected')
  getHello(@Request() req): string {
    return req.user;
  }

  //Google
  // @Get('auth')
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuth(@Request() req) { }

  // @Get('auth/google-redirect')
  // @UseGuards(GoogleOAuthGuard)
  // googleAuthRedirect(@Request() req) {
  //   return this.appService.googleLogin(req);
  // }

}

