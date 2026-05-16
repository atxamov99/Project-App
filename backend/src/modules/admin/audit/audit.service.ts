import { prisma } from '../../../config/db'

interface LogInput {
  actorId: string
  action: string
  targetType?: string
  targetId?: string
  metadata?: unknown
  ipAddress?: string
  userAgent?: string
}

export async function logAction(input: LogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        metadata: input.metadata as never,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    })
  } catch (e) {
    console.error('audit log failed:', e)
  }
}

export function actorContext(req: { userId?: string; ip?: string; get?: (key: string) => string | undefined }) {
  return {
    actorId: req.userId!,
    ipAddress: req.ip,
    userAgent: req.get?.('user-agent') ?? undefined,
  }
}
