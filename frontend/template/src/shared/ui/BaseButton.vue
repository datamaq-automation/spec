<!-- src/shared/ui/BaseButton.vue -->
<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "danger"
  disabled?: boolean
  type?: "button" | "submit" | "reset"
}

withDefaults(defineProps<Props>(), {
  variant: "primary",
  disabled: false,
  type: "button",
})

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void
}>()

function handleClick(event: MouseEvent): void {
  emit("click", event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="['base-btn', `base-btn--${variant}`]"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background-color 0.2s;
}

.base-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-btn--primary {
  background-color: #2563eb;
  color: #ffffff;
}

.base-btn--secondary {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #d1d5db;
}

.base-btn--danger {
  background-color: #dc2626;
  color: #ffffff;
}
</style>
