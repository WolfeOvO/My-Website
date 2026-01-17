<script setup>
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
  items: { type: Array, required: true },
  depth: { type: Number, default: 0 }
})

const route = useRoute()

const normalizePath = (path) => {
  if (!path) return ''
  try { path = decodeURIComponent(path) } catch (e) {}
  return path.replace(/\/index\.html?$/, '/').replace(/\.html?$/, '').replace(/\/+/g, '/').replace(/\/$/, '')
}

const isActive = (link) => {
  if (!link) return false
  return normalizePath(route.path) === normalizePath(link)
}
</script>

<script>
// 必须定义 name 才能在模板中递归调用自己
export default {
  name: 'RecursiveRow'
}
</script>

<template>
  <div class="recursive-container">
    <template v-for="(item, index) in items" :key="index">
      
      <!-- 1. 如果是文件 (Link) -->
      <div v-if="item.link" class="recursive-item">
        <a 
          :href="item.link" 
          class="recursive-link" 
          :class="{ active: isActive(item.link) }"
          :style="{ paddingLeft: `${depth * 1.2 + 0.8}rem` }"
        >
          <span class="link-icon">{{ item.icon || '📄' }}</span>
          <span class="link-text">{{ item.text }}</span>
        </a>
      </div>

      <!-- 2. 如果是文件夹/分组 (Group) -->
      <div v-else-if="item.isGroup || (item.items && item.items.length > 0)" class="recursive-group">
        <!-- 分组标题栏 -->
        <div class="group-row" :style="{ paddingLeft: `${depth * 1.2 + 0.8}rem` }">
          <div class="group-left">
            <span class="folder-icon">📂</span>
            <span class="folder-name">{{ item.text }}</span>
          </div>
          <!-- 右侧计数统计 -->
          <span class="group-badge" v-if="item.count">{{ item.count }}</span>
        </div>
        
        <!-- 递归渲染子级 -->
        <RecursiveRow 
          :items="item.items" 
          :depth="depth + 1" 
        />
      </div>

    </template>
  </div>
</template>

<style scoped>
.recursive-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* --- 文件链接样式 --- */
.recursive-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 12px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 0.95em;
  border-left: 3px solid transparent; /* 左侧激活条预留 */
}

.recursive-link:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-brand);
}

.recursive-link.active {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
  border-left-color: var(--vp-c-brand); /* 左侧激活条 */
}

.link-icon { font-size: 1em; flex-shrink: 0; }
.link-text { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* --- 分组标题样式 --- */
.group-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 6px;
  padding-right: 12px;
  margin-top: 4px;
  color: var(--vp-c-text-1);
  font-weight: 600;
  font-size: 0.95em;
  border-bottom: 1px dashed var(--vp-c-divider); /* 分隔线 */
  margin-bottom: 4px;
}

.group-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.folder-icon { font-size: 1em; color: var(--vp-c-yellow-1, #e6a23c); }

.group-badge {
  font-size: 0.75em;
  color: var(--vp-c-text-3);
  background-color: var(--vp-c-bg-mute);
  padding: 1px 6px;
  border-radius: 4px;
  min-width: 20px;
  text-align: center;
}
</style>