import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() body: any) {
    const { sub: userId, companyId } = req.user;
    return this.usersService.createUser({
      ...body,
      companyId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.usersService.findAll(req.user.companyId);
  }
}
