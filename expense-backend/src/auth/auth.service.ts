import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

type JwtPayload = {
  sub: number;         // user id
  companyId: number;   // company id
  roles: string[];     // ["ADMIN","MANAGER","EMPLOYEE"]
};

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaService) {}

  // Ensure the 3 base roles exist (id fixed like your SQL, safe with skipDuplicates)
  private async ensureBaseRoles() {
    await this.prisma.role.createMany({
      data: [
        { id: 1, code: 'ADMIN' },
        { id: 2, code: 'MANAGER' },
        { id: 3, code: 'EMPLOYEE' },
      ],
      skipDuplicates: true,
    });
  }

  async signup(name: string, email: string, password: string, companyName: string) {
    await this.ensureBaseRoles();

    const hash = await bcrypt.hash(password, 10);

    const company = await this.prisma.company.create({
      data: {
        name: companyName,
        country_code: 'IN',       // TODO: pass from UI
        default_currency: 'INR',  // TODO: derive from country
      },
    });

    // Create user (NO "role" field here)
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password_hash: hash,
        company_id: company.id,
      },
    });

    // Attach ADMIN role via join table
    const adminRole = await this.prisma.role.findUnique({ where: { code: 'ADMIN' } });
    if (!adminRole) throw new Error('ADMIN role missing');
    await this.prisma.userRole.create({
      data: { user_id: user.id, role_id: adminRole.id },
    });

    const roles = ['ADMIN'];
    const payload: JwtPayload = {
      sub: Number(user.id),
      companyId: Number(user.company_id),
      roles,
    };
    const token = await this.jwt.signAsync(payload);

    // Don’t leak password hash
    const { password_hash, ...safeUser } = user as any;
    return { token, user: { ...safeUser, roles } };
  }

  async login(email: string, password: string) {
    // email is NOT unique by itself => use findFirst
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: { roles: { include: { role: true } } }, // bring role codes
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const roles = user.roles.map((ur) => ur.role.code);
    const payload: JwtPayload = {
      sub: Number(user.id),
      companyId: Number(user.company_id),
      roles,
    };
    const token = await this.jwt.signAsync(payload);

    const { password_hash, ...safeUser } = user as any;
    return { token, user: { ...safeUser, roles } };
  }
}
