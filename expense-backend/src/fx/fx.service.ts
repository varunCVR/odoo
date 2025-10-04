import { Injectable, HttpService } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FxService {
  constructor(private prisma: PrismaService, private http: HttpService) {}

  async getRate(from: string, to: string) {
    // Example using exchangerate.host (free API)
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}`;
    const res = await this.http.axiosRef.get(url);

    const rate = res.data?.result || 1;

    // Store snapshot in DB
    const saved = await this.prisma.fxRate.create({
      data: {
        fromCurrency: from,
        toCurrency: to,
        rate: rate,
        snapshotDate: new Date(),
      },
    });

    return saved;
  }
}
