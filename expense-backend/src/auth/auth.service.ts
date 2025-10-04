import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = { sub: number; email: string; roles: string[]; companyId: number };

const toNum = (v: any) => (typeof v === 'bigint' ? Number(v) : v ?? 0);

// 🔁 If your Prisma model uses snake_case columns, Prisma client exposes camelCase:
//   password_hash  -> passwordHash
//   company_id     -> companyId
//   user_id        -> userId
// Make sure these names match your generated client!

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  private async ensureBaseRoles() {
    await this.prisma.role.createMany({
      data: [
        { code: 'ADMIN', id: 1 },
        { code: 'MANAGER', id: 2 },
        { code: 'EMPLOYEE', id: 3 },
      ],
      skipDuplicates: true,
    });
  }

  private packUser(u: any) {
    if (!u) return null;
    return {
      id: toNum(u.id),
      name: u.name,
      email: u.email,
      companyId: toNum(u.company_id),
      roles: (u.roles ?? []).map((ur: any) => ur.role?.code),
    };
  }

  async signup(name: string, email: string, password: string, companyName: string) {
    try {
      await this.ensureBaseRoles();

      const hash = await bcrypt.hash(password, 10);

      // Create company (ensure your model has "name" and maybe "defaultCurrency")
      const company = await this.prisma.company.create({
        data: { name: companyName, default_currency: 'INR' as any, country_code: 'IN' as any },
      });

      // Create user (IMPORTANT: use the correct password field name!)
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash: hash,
          company_id: company.id,
        },
      });

      // Attach ADMIN role
      const admin = await this.prisma.role.findUnique({ where: { code: 'ADMIN' } });
      if (!admin) throw new Error('ADMIN role missing');

      await this.prisma.userRole.create({
        data: { user_id: user.id, role_id: admin.id },
      });

      // Re-fetch with roles
      const full = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { roles: { include: { role: true } } },
      });

      const payload: JwtPayload = {
        sub: toNum(full?.id),
        email: full?.email ?? '',
        roles: (full?.roles ?? []).map((r: any) => r.role.code),
        companyId: toNum(full?.company_id),
      };

      const token = await this.jwt.signAsync(payload);

      return { token, user: this.packUser(full) };
    } catch (err: any) {
      console.error('Signup error:', err?.message, err?.code, err?.meta);
      throw new BadRequestException(err?.message ?? 'Signup failed');
    }
  }

  async login(email: string, password: string) {
    try {
      // If email is not globally unique in your schema, use findFirst
      const user = await this.prisma.user.findFirst({
        where: { email },
        include: { roles: { include: { role: true } } },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) throw new UnauthorizedException('Invalid credentials');

      const payload: JwtPayload = {
        sub: toNum(user.id),
        email: user.email,
        roles: (user.roles ?? []).map((r: any) => r.role.code),
        companyId: toNum(user.company_id),
      };
      const token = await this.jwt.signAsync(payload);

      return { token, user: this.packUser(user) };
    } catch (err: any) {
      console.error('Login error:', err?.message, err?.code, err?.meta);
      throw new UnauthorizedException(err?.message ?? 'Login failed');
    }
  }
}
