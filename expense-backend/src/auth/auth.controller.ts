import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    const companyName = body.companyName ?? body.company;
    if (!body.name || !body.email || !body.password || !companyName) {
      throw new BadRequestException('name, email, password, and company/companyName are required');
    }
    return this.auth.signup(body.name, body.email, body.password, companyName);
  }

  @Post('login')
  async login(@Body() body: any) {
    if (!body.email || !body.password) throw new BadRequestException('email and password are required');
    return this.auth.login(body.email, body.password);
  }
}
