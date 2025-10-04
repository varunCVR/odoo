import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    if (!body.name || !body.email || !body.password || !body.companyName) {
      throw new BadRequestException('name, email, password, companyName required');
    }
    return this.authService.signup(body.name, body.email, body.password, body.companyName);
  }

  @Post('login')
  async login(@Body() body: any) {
    if (!body.email || !body.password) {
      throw new BadRequestException('email and password required');
    }
    return this.authService.login(body.email, body.password);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: { email: string }) {
    if (!body.email) throw new BadRequestException('email required');
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    if (!body.token || !body.newPassword) {
      throw new BadRequestException('token and newPassword required');
    }
    return this.authService.resetPassword(body.token, body.newPassword);
  }
}
