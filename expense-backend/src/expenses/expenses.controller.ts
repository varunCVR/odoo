import { Controller, Post, Param, UseGuards, UseInterceptors, UploadedFile, Req, Get, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly service: ExpensesService) { }

  @UseGuards(JwtAuthGuard)
  @Post(':id/receipts')
  @UseInterceptors(FileInterceptor('file'))
  uploadReceipt(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.service.uploadReceipt(Number(id), file, req.user.sub);
  }
  @UseGuards(JwtAuthGuard)
  @Get('company')
  findAllCompany(@Req() req, @Query() q: any) {
    return this.service.findAllCompany(req.user.companyId, q);
  }

}
