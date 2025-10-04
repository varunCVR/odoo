import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reports')
export class ReportsController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(JwtAuthGuard)
  @Get('expenses')
  async getExpenseReports(@Req() req) {
    const companyId = req.user.companyId;
    
    // Get expense summary by employee
    const expenses = await this.prisma.expense.findMany({
      where: { company_id: BigInt(companyId) },
      include: { employee: true },
    });

    // Group by employee and sum amounts
    const summary = expenses.reduce((acc, expense) => {
      const employeeId = Number(expense.employee_id);
      const employeeName = expense.employee.name;
      
      if (!acc[employeeId]) {
        acc[employeeId] = {
          employeeId,
          employeeName,
          totalAmount: 0,
        };
      }
      
      acc[employeeId].totalAmount += Number(expense.amount_company);
      return acc;
    }, {} as Record<number, { employeeId: number; employeeName: string; totalAmount: number }>);

    return Object.values(summary);
  }
}
