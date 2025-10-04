import { Module } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { ApprovalsController, ApprovalRulesController } from './approvals.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ApprovalsController, ApprovalRulesController],
  providers: [ApprovalsService],
})
export class ApprovalsModule {}