<script setup>
import { ref } from 'vue'

const isRevealed = ref(false)
const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
}
</script>

<template>
  <span class="spoiler-ink" :class="{ revealed: isRevealed }" @click="toggleReveal" title="点击显示/隐藏">
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
  cursor: pointer;
  transition: all 0.3s ease;
  /* 隐藏所有文本装饰（删除线、下划线等） */
  text-decoration-color: transparent !important;
  -webkit-text-decoration-color: transparent !important;
}

/* 确保所有子元素的文本装饰也被隐藏 */
.spoiler-ink :deep(*) {
  color: transparent !important;
  text-decoration-color: transparent !important;
  -webkit-text-decoration-color: transparent !important;
}

/* 揭示状态 */
.spoiler-ink:hover,
.spoiler-ink.revealed {
  color: var(--vp-c-text-1);
  border-color: transparent;
  background-color: transparent;
  text-decoration-color: inherit !important;
  -webkit-text-decoration-color: inherit !important;
}

.spoiler-ink:hover :deep(*),
.spoiler-ink.revealed :deep(*) {
  color: inherit !important;
  text-decoration-color: inherit !important;
  -webkit-text-decoration-color: inherit !important;
}
</style>