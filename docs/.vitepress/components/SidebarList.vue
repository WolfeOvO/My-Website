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
        <div class="section-title" v-if="item.text && !item.link">{{ item.text }}</div>
        <a v-else-if="item.link" :href="normalizeLink(item.link)" class="link-item root-link">
          {{ item.text }}
        </a>
        <ul v-if="item.items" class="sub-list">
          <li v-for="(child, childIndex) in item.items" :key="childIndex">
            <a v-if="child.link" :href="normalizeLink(child.link)" class="link-item">
              {{ child.text }}
            </a>
            
            <div v-else-if="child.items" class="sub-group">
              <span class="sub-group-title">{{ child.text }}</span>
              <ul class="sub-sub-list">
                <li v-for="grandChild in child.items" :key="grandChild.text">
                   <a :href="normalizeLink(grandChild.link)" class="link-item sub-link-item">
                     {{ grandChild.text }}
                   </a>
                </li>
              </ul>
            </div>

          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 原有样式保留 */
.local-sidebar-list { margin-top: 2rem; padding: 1rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background-color: var(--vp-c-bg-soft); }
.root-list { list-style: none !important; margin: 0 !important; padding: 0 !important; }
.root-item { margin-bottom: 1.5rem; }
.section-title { font-weight: 700; font-size: 1.1em; margin-bottom: 0.5rem; color: var(--vp-c-text-1); }
.sub-list { list-style: none !important; padding-left: 0 !important; margin: 0 !important; }
.link-item { display: block; text-decoration: none; color: var(--vp-c-brand); transition: color 0.2s; font-size: 1rem; line-height: 1.5; }
.link-item:hover { color: var(--vp-c-brand-dark); text-decoration: underline; }
.empty-tip { color: red; font-weight: bold; }

/* 新增样式支持多级 */
.sub-group { margin-top: 8px; margin-bottom: 8px; }
.sub-group-title { font-weight: 600; color: var(--vp-c-text-2); font-size: 0.95em; }
.sub-sub-list { list-style: none !important; padding-left: 1rem !important; margin-top: 4px !important; border-left: 1px solid var(--vp-c-divider); }
.sub-link-item { font-size: 0.9em; color: var(--vp-c-text-2); }
.sub-link-item:hover { color: var(--vp-c-brand); }
</style>