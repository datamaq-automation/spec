<!-- src/features/home/views/HomeView.vue -->
<script setup lang="ts">
import BaseButton from "@/shared/ui/BaseButton.vue"
import { ref } from "vue"

const isRunning = ref<boolean>(true)

function toggleStatus(): void {
  isRunning.value = !isRunning.value
}
</script>

<template>
  <div class="home-view">
    <h1>Plantilla Frontend SPA (Vue 3 + Vite)</h1>
    <p>
      Estado del sistema:
      <strong>{{ isRunning ? "Operacional" : "En Mantenimiento" }}</strong>
    </p>
    <div class="actions">
      <BaseButton variant="primary" @click="toggleStatus">
        Alternar Estado
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}
.actions {
  display: flex;
  gap: 1rem;
}
</style>
