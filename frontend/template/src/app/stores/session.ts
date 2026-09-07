import { defineStore } from "pinia"
import { ref } from "vue"

export interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

export const useSessionStore = defineStore("session", () => {
  const user = ref<UserSession | null>(null)
  const isAuthenticated = ref<boolean>(false)
  const theme = ref<"light" | "dark">("light")

  function setUser(newUser: UserSession | null): void {
    user.value = newUser
    isAuthenticated.value = newUser !== null
  }

  function toggleTheme(): void {
    theme.value = theme.value === "light" ? "dark" : "light"
  }

  function logout(): void {
    user.value = null
    isAuthenticated.value = false
  }

  return {
    user,
    isAuthenticated,
    theme,
    setUser,
    toggleTheme,
    logout,
  }
})
