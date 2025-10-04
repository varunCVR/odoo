// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = { sub: number; email: string; roles: string[]; companyId: number };

const toNum = (v: any) => (typeof v === 'bigint' ? Number(v) : (v ?? 0));

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  // Ensure base roles exist once
  private async ensureBaseRoles() {
    await this.prisma.role.createMany({
      data: [{ code: 'ADMIN' , id: 1}, { code: 'MANAGER' , id: 2}, { code: 'EMPLOYEE' , id: 3}],
      skipDuplicates: true,
    });
  }

  private packUser(u: any) {
    if (!u) return null;
    return {
      id: toNum(u.id),
      name: u.name,
      email: u.email,
      companyId: toNum(u.companyId),
      roles: (u.roles ?? []).map((ur: any) => ur.role?.code),
    };
  }

  // ---------- SIGNUP ----------
  async signup(name: string, email: string, password: string, companyName: string) {
    if (!name || !email || !password || !companyName) {
      throw new BadRequestException(
        'name, email, password, and companyName are required',
      );
    }

    try {
      await this.ensureBaseRoles();

      // 1) Create company (adjust defaultCurrency field name if needed)
      const company = await this.prisma.company.create({
        data: { name: companyName, default_currency: 'INR' as any, country_code: 'IN' as any },
      });

      // 2) Hash password and create user
      const hash = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash: hash as any, // ✅ if your Prisma field is password_hash, the client name is passwordHash
          company_id: company.id,
        },
      });

      // 3) Attach ADMIN role using connect (fixes the "Argument `user` is missing" error)
      const adminRole = await this.prisma.role.findUnique({
        where: { code: 'ADMIN' },
      });
      if (!adminRole) throw new Error('ADMIN role missing');

      await this.prisma.userRole.create({
        data: {
          user: { connect: { id: user.id } },   // 👈 use connect
          role: { connect: { id: adminRole.id } },
        },
      });

      // 4) Fetch user with roles
      const full = await this.prisma.user.findUnique({
        where: { id: user.id },
        include: { roles: { include: { role: true } } },
      });

      // 5) Issue JWT
      const payload: JwtPayload = {
        sub: toNum(full!.id),
        email: full!.email,
        roles: (full!.roles ?? []).map((r: any) => r.role.code),
        companyId: toNum(full!.company_id),
      };
      const token = await this.jwt.signAsync(payload);

      return { token, user: this.packUser(full) };
    } catch (err: any) {
      console.error('Signup error:', err?.message, err?.code, err?.meta);
      throw new BadRequestException('Signup failed');
    }
  }

  // ---------- LOGIN ----------
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('email and password are required');
    }

    try {
      // If email isn't globally unique, findFirst is safer than findUnique
      const user = await this.prisma.user.findFirst({
        where: { email },
        include: { roles: { include: { role: true } } },
      });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      // ✅ Make sure this field name matches your Prisma client (passwordHash)
      const hash =
        (user as any).passwordHash ??
        (user as any).password_hash ??
        (user as any).password ??
        null;

      if (!hash) throw new UnauthorizedException('Invalid credentials');

      const ok = await bcrypt.compare(password, String(hash));
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
      throw new UnauthorizedException('Login failed');
    }
  }

  // ---------- OPTIONAL (stubs for hackathon) ----------
  async forgotPassword(_email: string) {
    // Implement token + email later. Stub for demo:
    return { message: 'If the email exists, a reset link was sent.' };
  }

  async resetPassword(_token: string, _newPassword: string) {
    // Implement token verify + hash later. Stub for demo:
    return { message: 'Password reset successful' };
  }
}
