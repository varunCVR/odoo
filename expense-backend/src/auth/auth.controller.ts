// src/auth/auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body.name, body.email, body.password, body.companyName);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body.email, body.password);
  }
  // src/auth/auth.controller.ts
@Post("forgot-password")
async forgotPassword(@Body() body: { email: string }) {
  return this.authService.forgotPassword(body.email);
}

@Post("reset-password")
async resetPassword(@Body() body: { token: string; newPassword: string }) {
  return this.authService.resetPassword(body.token, body.newPassword);
}

}
