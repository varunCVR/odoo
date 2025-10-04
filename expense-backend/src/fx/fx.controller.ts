import { Controller, Get, Query } from '@nestjs/common';
import { FxService } from './fx.service';

@Controller('fx')
export class FxController {
  constructor(private fxService: FxService) {}

  @Get('rates')
  async getRates(@Query('from') from: string, @Query('to') to: string) {
    return this.fxService.getExchangeRate(from, to);
  }
}
