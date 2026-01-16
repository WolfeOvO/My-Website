<script setup>
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()
const route = useRoute()

const items = computed(() => {
  // 1. 获取当前侧边栏配置
  const sidebar = theme.value.sidebar
  
  // 2. 获取当前路径，并一定要进行解码（解决中文路径匹配失败的关键！）
  // 同时去掉末尾的 .html 以防万一
  const currentPath = decodeURIComponent(route.path).replace(/.html$/, '')

  // 情况 A: 侧边栏是全站统一的简单数组
  if (Array.isArray(sidebar)) {
    return sidebar
  }

  // 情况 B: 多侧边栏 (对象形式)
  if (typeof sidebar === 'object') {
    // 找到所有配置的路径 Key (例如 '/储物间/', '/指南/')
    // 按长度排序，优先匹配最长的路径（避免 /guide/user 匹配到 /guide/）
    const keys = Object.keys(sidebar).sort((a, b) => b.length - a.length)

    for (const key of keys) {
      // 这里的 key 可能是 "/储物间/"
      if (currentPath.startsWith(key)) {
        return sidebar[key]
      }
    }
  }
  
  return [] // 没找到
})
</script>

<template>
  <div class="local-sidebar-list">
    <!-- 调试信息：如果列表还是空的，把下面这行注释解开来看看读取到了什么 -->
    <!-- <pre style="background:#eee; padding:10px;">调试路径: {{ decodeURIComponent(route.path) }} <br> 匹配到的数量: {{ items.length }}</pre> -->

    <div v-if="items.length === 0" class="empty-tip">
      未能获取目录，请检查 sidebar 配置路径是否匹配。
    </div>

    <ul class="root-list">
      <li v-for="(item, index) in items" :key="index" class="root-item">
        <!-- 一级标题 -->
        <div class="section-title" v-if="item.text">{{ item.text }}</div>
        
        <!-- 一级子菜单 -->
        <ul v-if="item.items" class="sub-list">
          <li v-for="(child, childIndex) in item.items" :key="childIndex">
            <a :href="child.link" class="link-item">
              {{ child.text }}
            </a>
          </li>
        </ul>

        <!-- 如果一级本身就是链接 -->
        <a v-else-if="item.link" :href="item.link" class="link-item root-link">
          {{ item.text }}
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.local-sidebar-list {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
}

.root-list {
  list-style: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.root-item {
  margin-bottom: 1.5rem;
}

.section-title {
  font-weight: 700;
  font-size: 1.1em;
  margin-bottom: 0.5rem;
  color: var(--vp-c-text-1);
}

.sub-list {
  list-style: none !important;
  padding-left: 0 !important; /* 不缩进，或者根据喜好改为 1rem */
  margin: 0 !important;
}

.sub-list li {
  margin-bottom: 8px;
  margin-top: 0 !important;
}

.link-item {
  display: block;
  text-decoration: none;
  color: var(--vp-c-brand);
  transition: color 0.2s;
  font-size: 1rem;
  line-height: 1.5;
}

.link-item:hover {
  color: var(--vp-c-brand-dark);
  text-decoration: underline;
}

.empty-tip {
  color: red;
  font-weight: bold;
}
</style>