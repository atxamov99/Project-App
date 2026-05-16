import { z } from 'zod'

export const changeRoleSchema = z.object({
  role: z.enum(['STUDENT', 'CONTENT_EDITOR', 'ADMIN']),
})

export const suspendSchema = z.object({
  reason: z.string().min(1).max(500),
})

export const listUsersQuerySchema = z.object({
  role: z.enum(['STUDENT', 'CONTENT_EDITOR', 'ADMIN']).optional(),
  suspended: z.enum(['true', 'false']).optional(),
  premium: z.enum(['true', 'false']).optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(['createdAt', 'totalXP', 'streak']).default('createdAt'),
})

export type ChangeRoleInput = z.infer<typeof changeRoleSchema>
export type SuspendInput = z.infer<typeof suspendSchema>
export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>
