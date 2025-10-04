import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuditService } from './audit.service';

@Controller('audit-logs')
export class AuditController {
  constructor(private audit: AuditService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req) {
    // req.user.companyId is set by your JWT
    return this.audit.list(Number(req.user.companyId));
  }
}
