<script setup>
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()
const route = useRoute()

// 计算当前页面应该显示的侧边栏列表
const items = computed(() => {
  const sidebar = theme.value.sidebar
  const path = route.path

  // 情况1: 侧边栏是简单的数组 (全站统一)
  if (Array.isArray(sidebar)) {
    return sidebar
  }

  // 情况2: 多侧边栏 (对象形式，key 是路径)
  // 找到当前路径匹配的侧边栏配置
  if (typeof sidebar === 'object') {
    for (const dir in sidebar) {
      // 检查当前路径是否包含配置的 key (例如 "/储物间/")
      if (path.includes(dir)) {
        return sidebar[dir]
      }
    }
  }
  
  return []
})
</script>

<template>
  <div class="sidebar-list">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <!-- 如果是分组标题 -->
        <h3 v-if="item.text && item.items">{{ item.text }}</h3>
        
        <!-- 如果是直接的链接 -->
        <a v-if="item.link" :href="item.link">{{ item.text }}</a>

        <!-- 递归渲染子项 (如果有 items) -->
        <ul v-if="item.items">
          <li v-for="(child, childIndex) in item.items" :key="childIndex">
            <a :href="child.link">{{ child.text }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sidebar-list ul {
  list-style: none;
  padding-left: 0;
}
.sidebar-list li {
  margin-bottom: 8px;
}
.sidebar-list h3 {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 1.1em;
}
.sidebar-list a {
  text-decoration: none;
  color: var(--vp-c-brand); /* 使用 VitePress 主题色 */
  font-weight: 500;
}
.sidebar-list a:hover {
  text-decoration: underline;
}
</style>