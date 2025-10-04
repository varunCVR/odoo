import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditModule } from './audit/audit.module'; // if you created one
// import { FxModule } from './fx/fx.module'; // if you split FX into a module

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
    // FxModule,
    AuditModule,
  ],
})
export class AppModule {}
