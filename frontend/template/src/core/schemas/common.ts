// src/core/schemas/common.ts
import { z } from 'zod'

export const healthSchema = z.object({
  status: z.string(),
  environment: z.string().optional(),
})

export type HealthCheck = z.infer<typeof healthSchema>

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
})

export type PaginationQuery = z.infer<typeof paginationSchema>
