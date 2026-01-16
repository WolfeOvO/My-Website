<script setup>
import { useRoute, withBase } from 'vitepress'

const props = defineProps({
    items: { type: Array, required: true },
    depth: { type: Number, default: 0 }
})

const route = useRoute()

const normalizeLink = (url) => {
    if (!url) return null
    const decoded = decodeURIComponent(url)
    return withBase(decoded.replace(/\.md$/, '.html'))
}

const normalizePath = (path) => {
    if (!path) return ''
    return decodeURIComponent(path)
        .replace(/\.(md|html)$/, '')
        .replace(/\/$/, '')
}

const isActive = (link) => {
    if (!link) return false
    return normalizePath(route.path) === normalizePath(link)
}
</script>

<script>
export default {
    name: 'RecursiveItems'
}
</script>

<template>
    <div class="recursive-list">
        <template v-for="(item, index) in items" :key="index">
            <!-- 有链接的项目 -->
            <div v-if="item.link" class="recursive-item" :style="{ paddingLeft: `${depth * 1}rem` }">
                <a :href="normalizeLink(item.link)" class="recursive-link" :class="{ active: isActive(item.link) }">
                    <span class="link-icon">📄</span>
                    <span class="link-text">{{ item.text }}</span>
                </a>
            </div>
            
            <!-- 无链接但有子级的文件夹 -->
            <div v-else-if="item.items && item.items.length > 0" class="recursive-folder" :style="{ paddingLeft: `${depth * 1}rem` }">
                <div class="folder-header">
                    <span class="folder-icon">📁</span>
                    <span class="folder-name">{{ item.text }}</span>
                </div>
            </div>
            
            <!-- 递归渲染子级 -->
            <RecursiveItems 
                v-if="item.items && item.items.length > 0" 
                :items="item.items" 
                :depth="depth + 1" 
            />
        </template>
    </div>
</template>

<style scoped>
.recursive-list {
    display: flex;
    flex-direction: column;
}

.recursive-item {
    margin-bottom: 0.25rem;
}

.recursive-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    text-decoration: none;
    color: var(--vp-c-text-2);
    border-radius: 6px;
    transition: all 0.2s ease;
    font-size: 0.95em;
}

.recursive-link:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
}

.recursive-link.active {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand);
    font-weight: 500;
}

.link-icon {
    font-size: 0.9em;
    flex-shrink: 0;
}

.link-text {
    flex: 1;
}

.recursive-folder {
    margin-bottom: 0.25rem;
}

.folder-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    font-size: 0.95em;
}

.folder-icon {
    font-size: 0.9em;
    flex-shrink: 0;
}

.folder-name {
    flex: 1;
}
</style>