import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { id: 1, code: 'ADMIN' },
      { id: 2, code: 'MANAGER' },
      { id: 3, code: 'EMPLOYEE' },
    ],
    skipDuplicates: true,
  });
}
main().finally(()=> prisma.$disconnect());
