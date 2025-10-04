import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FxService } from '../fx/fx.service';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    private fx: FxService, // <- this is what Nest will inject
  ) {}

  async create(userId: number, companyId: number, data: any) {
    // company currency must exist on Company (default_currency / currencyCompany)
    const company = await this.prisma.company.findUnique({
      where: { id: BigInt(companyId) },
    });
    if (!company) throw new Error('Company not found');

    const companyCurrency = company.default_currency || company.default_currency || 'INR';

    let fxRateId: bigint | null = null;
    let amountCompany = Number(data.amountCompany ?? data.amountOriginal);

    if (data.currencyOriginal !== companyCurrency) {
      const fx = await this.fx.getExchangeRate(data.currencyOriginal, companyCurrency);
      fxRateId = BigInt(fx.id);
      amountCompany = Number(data.amountOriginal) * Number(fx.rate);
    }

    return this.prisma.expense.create({
      data: {
        company_id: BigInt(companyId),
        employee_id: BigInt(userId),
        description: data.description ?? null,
        category: data.category,
        expense_date: new Date(data.expenseDate),
        paid_by: data.paidBy, // 'Self' | 'Company'
        amount_original: Number(data.amountOriginal),
        currency_original: data.currencyOriginal,
        amount_company: amountCompany,
        currency_company: companyCurrency,
        fx_rate_id: fxRateId ?? undefined,
      },
    });
  }

  findMyExpenses(employeeId: number) {
    return this.prisma.expense.findMany({
      where: { employee_id: BigInt(employeeId) },
      include: { approvals: true },
      orderBy: { expense_date: 'desc' },
    });
  }

  findAllCompany(companyId: number, q: any) {
    return this.prisma.expense.findMany({
      where: {
        company_id: BigInt(companyId),
        expense_date: {
          gte: q?.startDate ? new Date(q.startDate) : undefined,
          lte: q?.endDate ? new Date(q.endDate) : undefined,
        },
        category: q?.category || undefined,
      },
      include: { employee: true, approvals: true },
      orderBy: { expense_date: 'desc' },
    });
  }

  async uploadReceipt(expenseId: number, file: Express.Multer.File, userId: number) {
    if (!file) throw new Error('No file uploaded');

    return this.prisma.receipt.create({
      data: {
        expense_id: BigInt(expenseId),
        storage_key: file.filename,
        filename: file.originalname,
        mime_type: file.mimetype,
        uploaded_by: BigInt(userId),
      },
    });
  }
}
