import { describe, expect, it } from "vitest"
import { formatDate } from "@/shared/utils/index"
import { healthSchema } from "@/core/schemas/common"

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
})
