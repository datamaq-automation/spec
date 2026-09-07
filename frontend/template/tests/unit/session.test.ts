import { beforeEach, describe, expect, it } from "vitest"
import { createPinia, setActivePinia } from "pinia"
import { useSessionStore } from "@/app/stores/session"

describe("Unit Tests — Session Store (Pinia)", () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it("should initialize with default unauthenticated state", () => {
    const store = useSessionStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
    expect(store.theme).toBe("light")
  })

  it("should toggle theme correctly", () => {
    const store = useSessionStore()
    store.toggleTheme()
    expect(store.theme).toBe("dark")
    store.toggleTheme()
    expect(store.theme).toBe("light")
  })

  it("should set user and update isAuthenticated", () => {
    const store = useSessionStore()
    const mockUser = {
      id: "usr-1",
      name: "Agustin",
      email: "agustin@example.com",
      role: "admin",
    }
    store.setUser(mockUser)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user?.email).toBe("agustin@example.com")

    store.logout()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
})
