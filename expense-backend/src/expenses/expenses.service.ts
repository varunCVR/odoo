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
  findAllCompany(companyId: number, query: any) {
    return this.prisma.expense.findMany({
      where: {
        company_id: companyId,
        expense_date: {
          gte: query.startDate ? new Date(query.startDate) : undefined,
          lte: query.endDate ? new Date(query.endDate) : undefined,
        },
        category: query.category || undefined,
      },
      include: { employee: true, approvals: true },
      orderBy: { expense_date: 'desc' },
    });
  }
  async uploadReceipt(expenseId: number, file: Express.Multer.File, userId: number) {
    if (!file) throw new Error("No file uploaded");
  
    return this.prisma.receipt.create({
      data: {
        expense_id: BigInt(expenseId),   // 🔑 maps from expense_id
        storage_key: file.filename,      // 🔑 maps from storage_key
        filename: file.originalname,    // 🔑 maps from filename
        mime_type: file.mimetype,        // 🔑 maps from mime_type
        uploaded_by: BigInt(userId),     // 🔑 maps from uploaded_by
      },
    });
  }
  async createExpense(userId: number, data: any) {
    const employee = await this.prisma.user.findUnique({
      where: { id: BigInt(userId) },
      include: { company: true },
    });
  
    if (!employee) throw new Error("User not found");
  
    // Company default currency
    const companyCurrency = employee.company.currency;
  
    // If expense currency ≠ company currency → fetch FX rate
    let fxRateId: bigint | null = null;
    let amountCompany = data.amountOriginal;
  
    if (data.currencyOriginal !== companyCurrency) {
      const fx = await this.fxService.getRate(data.currencyOriginal, companyCurrency);
      fxRateId = fx.id;
      amountCompany = data.amountOriginal * fx.rate;
    }
  
    return this.prisma.expense.create({
      data: {
        description: data.description,
        category: data.category,
        expense_date: new Date(data.expenseDate),
        paid_by: data.paidBy,
        amount_original: data.amountOriginal,
        currency_original: data.currencyOriginal,
        amount_company: amountCompany,
        currency_company: companyCurrency,
        fx_rate_id: fxRateId,
        employee_id: BigInt(userId),
        company_id: employee.company_id,
      },
    });
  }
  
}
