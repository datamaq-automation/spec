// src/core/schemas/common.ts
import { z } from 'zod'

export const healthSchema = z.object({
  status: z.string(),
  environment: z.string().optional(),
})

export type HealthData = z.infer<typeof healthSchema>
