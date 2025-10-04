import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() body: any) {
    return this.expensesService.create(req.user.sub, req.user.companyId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Req() req) {
    return this.expensesService.findMyExpenses(req.user.sub);
  }
}
