<script setup>
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'

const { theme } = useData()
const route = useRoute()

const normalizeLink = (url) => {
  if (!url) return null
  const decoded = decodeURIComponent(url)
  return withBase(decoded.replace(/\.md$/, '.html'))
}
// -----------------------

const items = computed(() => {
  const sidebar = theme.value.sidebar
  const currentPath = decodeURIComponent(route.path).replace(/.html$/, '')

  if (Array.isArray(sidebar)) {
    return sidebar
  }

  if (typeof sidebar === 'object') {
    const keys = Object.keys(sidebar).sort((a, b) => b.length - a.length)
    for (const key of keys) {
      if (currentPath.startsWith(key)) {
        return sidebar[key]
      }
    }
  }
  return []
})
</script>

<template>
  <div class="local-sidebar-list">
    <div v-if="items.length === 0" class="empty-tip">
      目录为空 (当前路径匹配不到 Sidebar 配置)
    </div>

    <ul class="root-list">
      <li v-for="(item, index) in items" :key="index" class="root-item">
        <div class="section-title" v-if="item.text && item.items">{{ item.text }}</div>
        
        <ul v-if="item.items" class="sub-list">
          <li v-for="(child, childIndex) in item.items" :key="childIndex">
            <a :href="normalizeLink(child.link)" class="link-item">
              {{ child.text }}
            </a>
          </li>
        </ul>

        <a v-else-if="item.link" :href="normalizeLink(item.link)" class="link-item root-link">
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
.root-list { list-style: none !important; margin: 0 !important; padding: 0 !important; }
.root-item { margin-bottom: 1.5rem; }
.section-title { font-weight: 700; font-size: 1.1em; margin-bottom: 0.5rem; color: var(--vp-c-text-1); }
.sub-list { list-style: none !important; padding-left: 0 !important; margin: 0 !important; }
.sub-list li { margin-bottom: 8px; margin-top: 0 !important; }
.link-item { display: block; text-decoration: none; color: var(--vp-c-brand); transition: color 0.2s; font-size: 1rem; line-height: 1.5; }
.link-item:hover { color: var(--vp-c-brand-dark); text-decoration: underline; }
.empty-tip { color: red; font-weight: bold; }
</style>