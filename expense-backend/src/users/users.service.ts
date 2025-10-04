import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: { name: string; email: string; password: string; role: string; companyId: number; managerId?: number }) {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password_hash: hash,
        company_id: data.companyId,
        employeeProfile: data.managerId
          ? { create: { manager_id: data.managerId } }
          : undefined,
      },
    });

    const role = await this.prisma.role.findUnique({ where: { code: data.role } });
    if (!role) throw new Error(`Role ${data.role} missing`);
    await this.prisma.userRole.create({ data: { user_id: user.id, role_id: role.id } });

    return user;
  }

  findAll(companyId: number) {
    return this.prisma.user.findMany({
      where: { company_id: companyId },
      include: { roles: { include: { role: true } }, employeeProfile: true },
    });
  }
}
