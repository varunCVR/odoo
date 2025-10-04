// src/approvals/approvals.controller.ts
import { Controller, Get, Post, Body, Param, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Decision } from '@prisma/client';

@Controller('approvals')
export class ApprovalsController {
  constructor(private approvalsService: ApprovalsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  findPending(@Req() req) {
    return this.approvalsService.findPending(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/decision')
  decide(
    @Param('id') id: string,
    @Req() req,
    @Body() body: { decision: 'APPROVED' | 'REJECTED'; comments?: string },
  ) {
    // map string -> enum safely
    const map: Record<string, Decision> = {
      APPROVED: Decision.APPROVED,
      REJECTED: Decision.REJECTED,
    };
    const dec = map[body.decision];
    if (!dec) throw new BadRequestException('Invalid decision');

    return this.approvalsService.decide(Number(id), req.user.sub, dec, body.comments);
  }
}

@Controller('approval-rules')
export class ApprovalRulesController {
  constructor(private approvalsService: ApprovalsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.approvalsService.findAllRules(req.user.companyId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req, @Body() body: { name: string }) {
    return this.approvalsService.createRule(req.user.companyId, body.name);
  }
}