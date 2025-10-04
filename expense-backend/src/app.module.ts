import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditModule } from './audit/audit.module';
import { FxModule } from './fx/fx.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './uploads' }),
    HttpModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ExpensesModule,
    ApprovalsModule,
    AuditModule,
    FxModule,
    ReportsModule,
  ],
})
export class AppModule {}
