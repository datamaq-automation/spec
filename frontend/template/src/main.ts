// src/main.ts
import { createApp } from "vue"
import { createPinia } from "pinia"
import App from "./App.vue"
import { router } from "@/app/router"
import "@/app/styles/main.css"

export function bootstrapApp() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)

  return app
}

const app = bootstrapApp()
app.mount("#app")
