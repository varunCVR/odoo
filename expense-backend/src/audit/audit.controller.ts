@UseGuards(JwtAuthGuard)
@Get()
async getLogs(@Req() req) {
  return this.prisma.auditLog.findMany({
    where: { user: { companyId: req.user.companyId } },
    include: { user: true },
    orderBy: { created_at: "desc" },
  });
}