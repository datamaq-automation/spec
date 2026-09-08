// tests/unit/common.test.ts
import { describe, expect, it } from "vitest"
import { formatDate } from "@/shared/utils/index"
import { healthSchema } from "@/core/schemas/common"
import { apiClient } from "@/core/http/client"
import type { ApiResponse } from "@/core/types/common"

describe("Unit Tests — Shared Utils & Core Schemas", () => {
  it("formatDate should return ISO string", () => {
    const d = new Date("2026-09-06T12:00:00.000Z")
    expect(formatDate(d)).toBe("2026-09-06T12:00:00.000Z")
  })

  it("healthSchema should validate correct payload", () => {
    const payload = { status: "ok", environment: "production" }
    const result = healthSchema.safeParse(payload)
    expect(result.success).toBe(true)
  })

  it("healthSchema should reject invalid status type", () => {
    const payload = { status: 123 }
    const result = healthSchema.safeParse(payload)
    expect(result.success).toBe(false)
  })

  it("apiClient should be instantiated with correct defaults", () => {
    expect(apiClient).toBeDefined()
    expect(apiClient.defaults.timeout).toBe(10000)
    const response: ApiResponse<string> = { data: "pong", status: "success" }
    expect(response.status).toBe("success")
  })
})
