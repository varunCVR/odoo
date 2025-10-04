import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
