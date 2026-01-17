<template>
  <span 
    :class="['notion-tag', presetColor && `notion-tag-${presetColor}`]"
    :style="customStyle"
  >
    <slot>{{ text }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'gray'
  },
  bgColor: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: 14
  },
  padding: {
    type: String,
    default: '2px 8px'
  }
})

// 预设颜色列表（包括渐变色）
const presetColors = [
  // 基础颜色
  'gray', 'brown', 'orange', 'yellow', 'green', 
  'blue', 'purple', 'pink', 'red',
  // 扩展颜色
  'cyan', 'teal', 'lime', 'indigo', 'violet', 
  'rose', 'amber', 'emerald', 'sky', 'slate',
  // 渐变色系列
  'gradient-sunset', 'gradient-ocean', 'gradient-forest', 
  'gradient-fire', 'gradient-purple', 'gradient-pink',
  'gradient-rainbow', 'gradient-peach', 'gradient-mint',
  'gradient-lavender', 'gradient-cosmic', 'gradient-neon',
  'gradient-autumn', 'gradient-spring', 'gradient-winter',
  'gradient-gold', 'gradient-silver', 'gradient-bronze'
]

// 判断是否为渐变色
const isGradient = computed(() => {
  return props.color.startsWith('gradient-')
})

// 判断是否使用预设颜色
const presetColor = computed(() => {
  if (props.bgColor || props.textColor) {
    return null
  }
  return presetColors.includes(props.color) ? props.color : null
})

// 自定义样式
const customStyle = computed(() => {
  const styles = {}
  
  // 如果提供了自定义颜色
  if (props.bgColor) {
    styles.backgroundColor = props.bgColor
  }
  if (props.textColor) {
    styles.color = props.textColor
  }
  
  // 自定义字体大小
  const fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size
  styles.fontSize = fontSize
  
  // 自定义内边距
  if (props.padding) {
    styles.padding = props.padding
  }
  
  return styles
})
</script>

<style scoped>
.notion-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  user-select: none;
}

.notion-tag:hover {
  filter: brightness(0.95);
}

/* Markdown 元素样式（VitePress 解析后的内容） */
.notion-tag strong {
  font-weight: 700;
}

.notion-tag em {
  font-style: italic;
}

.notion-tag code {
  font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  font-size: 0.9em;
  padding: 0 4px;
  background-color: rgba(0, 0, 0, 0.08);
  border-radius: 3px;
}

.notion-tag del {
  text-decoration: line-through;
  opacity: 0.7;
}

@media (prefers-color-scheme: dark) {
  .notion-tag code {
    background-color: rgba(255, 255, 255, 0.1);
  }
}

/* 不同颜色主题 */
.notion-tag-gray {
  background-color: rgba(227, 226, 224, 0.5);
  color: rgba(55, 53, 47, 0.9);
}

.notion-tag-brown {
  background-color: rgba(244, 238, 232, 0.6);
  color: rgba(68, 42, 30, 0.9);
}

.notion-tag-orange {
  background-color: rgba(251, 236, 221, 0.6);
  color: rgba(73, 41, 14, 0.9);
}

.notion-tag-yellow {
  background-color: rgba(251, 243, 219, 0.6);
  color: rgba(64, 44, 27, 0.9);
}

.notion-tag-green {
  background-color: rgba(237, 243, 236, 0.6);
  color: rgba(28, 56, 41, 0.9);
}

.notion-tag-blue {
  background-color: rgba(231, 243, 248, 0.6);
  color: rgba(24, 51, 71, 0.9);
}

.notion-tag-purple {
  background-color: rgba(244, 240, 247, 0.6);
  color: rgba(65, 36, 84, 0.9);
}

.notion-tag-pink {
  background-color: rgba(249, 238, 243, 0.6);
  color: rgba(76, 35, 55, 0.9);
}

.notion-tag-red {
  background-color: rgba(251, 236, 236, 0.6);
  color: rgba(93, 23, 21, 0.9);
}

/* 扩展颜色 */
.notion-tag-cyan {
  background-color: rgba(224, 247, 250, 0.6);
  color: rgba(21, 101, 192, 0.9);
}

.notion-tag-teal {
  background-color: rgba(224, 242, 241, 0.6);
  color: rgba(19, 79, 92, 0.9);
}

.notion-tag-lime {
  background-color: rgba(240, 244, 195, 0.6);
  color: rgba(51, 77, 26, 0.9);
}

.notion-tag-indigo {
  background-color: rgba(232, 234, 246, 0.6);
  color: rgba(48, 63, 159, 0.9);
}

.notion-tag-violet {
  background-color: rgba(243, 232, 255, 0.6);
  color: rgba(94, 53, 177, 0.9);
}

.notion-tag-rose {
  background-color: rgba(255, 228, 230, 0.6);
  color: rgba(136, 14, 79, 0.9);
}

.notion-tag-amber {
  background-color: rgba(255, 243, 224, 0.6);
  color: rgba(255, 111, 0, 0.9);
}

.notion-tag-emerald {
  background-color: rgba(209, 250, 229, 0.6);
  color: rgba(5, 122, 85, 0.9);
}

.notion-tag-sky {
  background-color: rgba(224, 242, 254, 0.6);
  color: rgba(2, 132, 199, 0.9);
}

.notion-tag-slate {
  background-color: rgba(241, 245, 249, 0.6);
  color: rgba(51, 65, 85, 0.9);
}

/* 渐变色系列 - 带动画效果 */
.notion-tag-gradient-sunset {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ee5a6f 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notion-tag-gradient-ocean {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notion-tag-gradient-forest {
  background: linear-gradient(135deg, #0ba360 0%, #3cba92 50%, #30dd8a 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notion-tag-gradient-fire {
  background: linear-gradient(135deg, #ff0844 0%, #ffb199 50%, #ff6600 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notion-tag-gradient-purple {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%);
  background-size: 200% 200%;
  color: #6b46c1;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.notion-tag-gradient-pink {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffdde1 100%);
  background-size: 200% 200%;
  color: #d53f8c;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.notion-tag-gradient-rainbow {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.notion-tag-gradient-peach {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff8177 100%);
  background-size: 200% 200%;
  color: #7c2d12;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.notion-tag-gradient-mint {
  background: linear-gradient(135deg, #a1ffce 0%, #faffd1 50%, #a1ffce 100%);
  background-size: 200% 200%;
  color: #065f46;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.notion-tag-gradient-lavender {
  background: linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 50%, #c4b5fd 100%);
  background-size: 200% 200%;
  color: #5b21b6;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.notion-tag-gradient-cosmic {
  background: linear-gradient(135deg, #4a00e0 0%, #8e2de2 50%, #ff0099 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.notion-tag-gradient-neon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.notion-tag-gradient-autumn {
  background: linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 50%, #f6d365 100%);
  background-size: 200% 200%;
  color: #92400e;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

.notion-tag-gradient-spring {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%);
  background-size: 200% 200%;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.notion-tag-gradient-winter {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d4fc79 100%);
  background-size: 200% 200%;
  color: #1e40af;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.notion-tag-gradient-gold {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 50%, #f7971e 100%);
  background-size: 200% 200%;
  color: #78350f;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.4);
}

.notion-tag-gradient-silver {
  background: linear-gradient(135deg, #bdc3c7 0%, #e8eaed 50%, #bdc3c7 100%);
  background-size: 200% 200%;
  color: #1f2937;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.notion-tag-gradient-bronze {
  background: linear-gradient(135deg, #c79081 0%, #dfa579 50%, #c79081 100%);
  background-size: 200% 200%;
  color: #451a03;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3);
}

/* 渐变色悬停动画 */
.notion-tag[class*="gradient-"]:hover {
  filter: brightness(1.1);
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 暗色模式支持 */
@media (prefers-color-scheme: dark) {
  .notion-tag-gray {
    background-color: rgba(69, 75, 78, 0.3);
    color: rgba(151, 154, 155, 1);
  }

  .notion-tag-brown {
    background-color: rgba(67, 64, 64, 0.3);
    color: rgba(159, 132, 120, 1);
  }

  .notion-tag-orange {
    background-color: rgba(89, 74, 64, 0.3);
    color: rgba(217, 155, 103, 1);
  }

  .notion-tag-yellow {
    background-color: rgba(89, 86, 59, 0.3);
    color: rgba(203, 180, 110, 1);
  }

  .notion-tag-green {
    background-color: rgba(53, 76, 75, 0.3);
    color: rgba(108, 180, 155, 1);
  }

  .notion-tag-blue {
    background-color: rgba(40, 69, 108, 0.3);
    color: rgba(113, 178, 231, 1);
  }

  .notion-tag-purple {
    background-color: rgba(68, 63, 87, 0.3);
    color: rgba(167, 130, 220, 1);
  }

  .notion-tag-pink {
    background-color: rgba(83, 59, 76, 0.3);
    color: rgba(221, 133, 188, 1);
  }

  .notion-tag-red {
    background-color: rgba(89, 65, 65, 0.3);
    color: rgba(228, 133, 130, 1);
  }

  .notion-tag-cyan {
    background-color: rgba(40, 69, 108, 0.3);
    color: rgba(103, 232, 249, 1);
  }

  .notion-tag-teal {
    background-color: rgba(45, 75, 78, 0.3);
    color: rgba(94, 234, 212, 1);
  }

  .notion-tag-lime {
    background-color: rgba(60, 80, 50, 0.3);
    color: rgba(190, 242, 100, 1);
  }

  .notion-tag-indigo {
    background-color: rgba(55, 60, 90, 0.3);
    color: rgba(165, 180, 252, 1);
  }

  .notion-tag-violet {
    background-color: rgba(75, 60, 95, 0.3);
    color: rgba(196, 181, 253, 1);
  }

  .notion-tag-rose {
    background-color: rgba(90, 55, 70, 0.3);
    color: rgba(251, 113, 133, 1);
  }

  .notion-tag-amber {
    background-color: rgba(90, 75, 50, 0.3);
    color: rgba(251, 191, 36, 1);
  }

  .notion-tag-emerald {
    background-color: rgba(45, 80, 70, 0.3);
    color: rgba(52, 211, 153, 1);
  }

  .notion-tag-sky {
    background-color: rgba(40, 70, 100, 0.3);
    color: rgba(125, 211, 252, 1);
  }

  .notion-tag-slate {
    background-color: rgba(60, 70, 80, 0.3);
    color: rgba(203, 213, 225, 1);
  }
}
</style>