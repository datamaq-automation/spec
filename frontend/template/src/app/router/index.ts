import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router"
import { HomeView } from "@/features/home"

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
