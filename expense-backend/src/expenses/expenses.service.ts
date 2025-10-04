import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  create(employeeId: number, companyId: number, data: any) {
    return this.prisma.expense.create({
      data: {
        employee_id: employeeId,
        company_id: companyId,
        description: data.description,
        category: data.category,
        expense_date: new Date(data.expenseDate),
        paid_by: data.paidBy,
        amount_original: data.amountOriginal,
        currency_original: data.currencyOriginal,
        amount_company: data.amountCompany,
        currency_company: data.currencyCompany,
      },
    });
  }

  findMyExpenses(employeeId: number) {
    return this.prisma.expense.findMany({
      where: { employee_id: employeeId },
      orderBy: { expense_date: 'desc' },
    });
  }
}
