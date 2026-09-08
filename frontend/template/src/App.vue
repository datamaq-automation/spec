<!-- src/App.vue -->
<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<template>
  <div id="layout-root">
    <header class="app-header">
      <nav class="navbar">
        <span class="logo">DataMaq Automation</span>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#layout-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.app-header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
}
.logo {
  font-weight: 700;
  font-size: 1.125rem;
}
.app-main {
  flex: 1;
}
</style>
