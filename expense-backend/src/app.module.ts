import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
@Module({
  imports: [MulterModule.register({
    dest: './uploads', // local folder for receipts
  }),PrismaModule, AuthModule],
})
export class AppModule {}
