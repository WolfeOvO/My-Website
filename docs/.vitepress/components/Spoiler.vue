<script setup>
import { ref } from 'vue'

const isRevealed = ref(false)
const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
}
</script>

<template>
  <span 
    class="spoiler-ink" 
    :class="{ revealed: isRevealed }"
    @click="toggleReveal"
  >
    <slot />
  </span>
</template>

<style scoped>
.spoiler-ink {
  background-color: var(--vp-c-bg-alt);
  color: transparent;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 4px;
  padding: 0 4px;
  transition: all 0.3s ease
}

.spoiler-ink:hover,
.spoiler-ink.revealed {
  color: var(--vp-c-text-1);
  border-color: transparent;
  background-color: transparent;
}
</style>