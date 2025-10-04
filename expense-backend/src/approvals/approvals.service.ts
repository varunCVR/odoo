// src/approvals/approvals.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decision } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  // Pending approvals for this approver
  async findPending(userId: number) {
    return this.prisma.expenseApproval.findMany({
      where: {
        approver_id: BigInt(userId),     // <- BIGINT safety
        decision: Decision.PENDING,      // <- use enum, not string
      },
      include: {
        expense: {
          include: { employee: true },
        },
      },
      // There is no created_at on ExpenseApproval in your schema.
      // Order by the related expense date or by approval id.
      orderBy: { expense: { expense_date: 'desc' } }, // or: orderBy: { id: 'desc' }
    });
  }

  // Approve or reject
  async decide(approvalId: number, approverId: number, decision: Decision, comments?: string) {
    const approval = await this.prisma.expenseApproval.findUnique({
      where: { id: BigInt(approvalId) },
    });

    if (!approval || approval.approver_id !== BigInt(approverId)) {
      throw new NotFoundException('Approval not found');
    }

    return this.prisma.expenseApproval.update({
      where: { id: BigInt(approvalId) },
      data: {
        decision,                 // Decision.APPROVED | Decision.REJECTED
        comments,
        decided_at: new Date(),
      },
    });
  }
}
