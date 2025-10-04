import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(params: {
    companyId: number;
    actorId?: number | null;
    entityType: string;
    entityId: number;
    action: string;
    payload?: any;
  }) {
    const { companyId, actorId, entityType, entityId, action, payload } = params;

    return this.prisma.auditLog.create({
      data: {
        company_id: BigInt(companyId),
        actor_id: actorId != null ? BigInt(actorId) : null,
        entity_type: entityType,
        entity_id: BigInt(entityId),
        action,
        payload,
      },
    });
  }

  list(companyId: number) {
    return this.prisma.auditLog.findMany({
      where: { company_id: BigInt(companyId) },
      orderBy: { created_at: 'desc' },
    });
  }
}
