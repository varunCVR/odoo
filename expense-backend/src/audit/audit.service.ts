// src/audit/audit.service.ts
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: number | null, action: string, entity: string, details?: string) {
    return this.prisma.auditLog.create({
      data: {
        userId: userId ? BigInt(userId) : null,
        action,
        entity,
        details,
      },
    });
  }
}
