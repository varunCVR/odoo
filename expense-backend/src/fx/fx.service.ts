import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FxService {
  constructor(private http: HttpService, private prisma: PrismaService) {}

  async getExchangeRate(baseCurrency: string, quoteCurrency: string) {
    if (baseCurrency === quoteCurrency) {
      // store a 1:1 snapshot for consistency
      return this.prisma.fxRate.create({
        data: {
          base_currency: baseCurrency,
          quote_currency: quoteCurrency,
          rate: 1,
          quoted_at: new Date(),
        },
      });
    }

    const url = `https://api.exchangerate.host/convert?from=${baseCurrency}&to=${quoteCurrency}`;
    const { data } = await this.http.axiosRef.get(url);
    const rate = Number(data?.result || 1);

    return this.prisma.fxRate.create({
      data: {
        base_currency: baseCurrency,
        quote_currency: quoteCurrency,
        rate,
        quoted_at: new Date(),
      },
    });
  }
}
