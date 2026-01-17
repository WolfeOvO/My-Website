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

// 预设颜色列表
const presetColors = [
  'gray', 'brown', 'orange', 'yellow', 'green', 
  'blue', 'purple', 'pink', 'red'
]

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
}
</style>