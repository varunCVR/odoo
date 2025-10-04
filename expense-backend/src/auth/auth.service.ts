import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = {
  sub: number;
  email: string;
  roles: string[];
  companyId: number;
};

function toNumber(x: bigint | number | null | undefined) {
  return typeof x === 'bigint' ? Number(x) : (x ?? 0) as number;
}

function safeUser(u: any) {
  if (!u) return null;
  return {
    id: Number(u.id),
    name: u.name,
    email: u.email,
    companyId: Number(u.companyId),
    roles: (u.roles ?? []).map((r) => r.role?.code),
  };
}


@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  private async ensureBaseRoles() {
    await this.prisma.role.createMany({
      data: [
        { id: 1n as any, code: 'ADMIN' },
        { id: 2n as any, code: 'MANAGER' },
        { id: 3n as any, code: 'EMPLOYEE' },
      ],
      skipDuplicates: true,
    });
  }

  async signup(name: string, email: string, password: string, companyName: string) {
    if (!name || !email || !password || !companyName) {
      throw new BadRequestException('name, email, password, companyName required');
    }

    await this.ensureBaseRoles();

    const hash = await bcrypt.hash(password, 10);

    // 1) Create company
    const company = await this.prisma.company.create({
      data: {
        name: companyName,
        country_code: 'IN',
        // add default_currency if your schema has it
        default_currency: 'INR' as any,
      },
    });

    // 2) Create user (note: adjust field names if you use password_hash)
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash: hash as any, // if your field is password_hash → use passwordHash in Prisma
        company_id: company.id,
      },
    });

    // 3) Attach ADMIN role (via join table)
    const adminRole = await this.prisma.role.findUnique({ where: { code: 'ADMIN' } });
    if (!adminRole) throw new Error('ADMIN role missing');

    await this.prisma.userRole.create({
      data: { userId: user.id, roleId: adminRole.id } as any,
    });

    // 4) Fetch roles for JWT
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: { roles: { include: { role: true } } },
    });

    const roles = (fullUser?.roles ?? []).map((r) => r.role.code);

    // 5) Build JWT
    const payload: JwtPayload = {
      sub: toNumber(user.id),
      email: user.email,
      roles,
      companyId: toNumber(user.company_id),
    };
    const token = await this.jwt.signAsync(payload);

    return {
      token,
      user: safeUser(fullUser),
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) throw new BadRequestException('email and password required');

    // email likely NOT globally unique → use findFirst (or include companyId if you collect it)
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { roles: { include: { role: true } } },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    // compare against the correct field (passwordHash for password_hash)
    const ok = await bcrypt.compare(password, user.password_hash as any);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const roles = (user.roles ?? []).map((r) => r.role.code);

    const payload: JwtPayload = {
      sub: toNumber(user.id),
      email: user.email,
      roles,
      companyId: toNumber(user.company_id),
    };
    const token = await this.jwt.signAsync(payload);

    return {
      token,
      user: safeUser(user),
    };
  }

  // Optional (stubs for now)
  async forgotPassword(email: string) {
    // For demo: don’t error, pretend success
    return { message: `If ${email} exists, a reset link was sent.` };
  }

  async resetPassword(token: string, newPassword: string) {
    // For demo: pretend success
    return { message: 'Password reset successful' };
  }
}
