<script setup>
import { ref } from 'vue'

const isRevealed = ref(false)
const toggleReveal = () => {
  isRevealed.value = !isRevealed.value
}
</script>

<style scoped>
.spoiler-ink {
  /* 
     1. 遮挡逻辑：
     背景色 = 次级背景色 (var(--vp-c-bg-alt)) 
             -> 看起来像页面背景，但有极其微弱的区别，提示用户这里有东西。
     文字色 = 透明 (transparent) 
             -> 文字隐身
  */
  background-color: var(--vp-c-bg-alt);
  color: transparent;
  
  /* 加个虚线边框，更像“填空题”的占位符（可选，不想要可以删掉） */
  border: 1px dashed var(--vp-c-divider);
  
  border-radius: 4px;
  padding: 0 4px;
  transition: all 0.3s ease
}

/* 
   2. 显示逻辑：
   当悬浮或点击后，文字变成主要文字颜色 (var(--vp-c-text-1))
   这通常是背景色的“相反色”（白底黑字，或黑底白字）
*/
.spoiler-ink:hover,
.spoiler-ink.revealed {
  color: var(--vp-c-text-1);
  border-color: transparent; /* 显示后隐藏边框，让文字更自然 */
  background-color: transparent; /* 背景也变透明，融入段落 */
}
</style>