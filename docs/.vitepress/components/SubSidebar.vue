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

// 规范化路径：同时处理 .md 和 .html 后缀
const normalizePath = (path) => {
    if (!path) return ''
    return decodeURIComponent(path)
        .replace(/\.(md|html)$/, '')
        .replace(/\/$/, '')
}

// 递归查找当前页面所属的父级项目及其子内容
const findCurrentGroup = (items, currentPath, parent = null) => {
    for (const item of items) {
        if (item.link) {
            const itemPath = normalizePath(item.link)
            if (currentPath === itemPath || currentPath.startsWith(itemPath + '/')) {
                // 如果当前项有子项，返回当前项
                if (item.items && item.items.length > 0) {
                    return { group: item, children: item.items }
                }
                // 如果当前项没有子项，但有父级，返回父级的子项
                if (parent && parent.items) {
                    return { group: parent, children: parent.items }
                }
            }
        }

        // 递归检查子项
        if (item.items) {
            const found = findCurrentGroup(item.items, currentPath, item)
            if (found) return found
        }
    }
    return null
}

// 获取匹配当前路径的sidebar配置
const getSidebarItems = () => {
    const sidebar = theme.value.sidebar
    const currentPath = normalizePath(route.path)

    if (Array.isArray(sidebar)) {
        return sidebar
    }

    if (typeof sidebar === 'object') {
        const keys = Object.keys(sidebar).sort((a, b) => b.length - a.length)
        for (const key of keys) {
            if (currentPath.startsWith(normalizePath(key))) {
                return sidebar[key]
            }
        }
    }
    return []
}

const currentGroup = computed(() => {
    const sidebarItems = getSidebarItems()
    const currentPath = normalizePath(route.path)
    return findCurrentGroup(sidebarItems, currentPath)
})

const groupTitle = computed(() => currentGroup.value?.group?.text || '')
const childItems = computed(() => currentGroup.value?.children || [])
</script>

<template>
    <div class="sub-sidebar-list" v-if="childItems.length > 0">
        <div class="group-header" v-if="groupTitle">
            <span class="group-title">{{ groupTitle }}</span>
            <span class="item-count">{{ childItems.length }} 项</span>
        </div>

        <ul class="child-list">
            <li v-for="(item, index) in childItems" :key="index" class="child-item">
                <a v-if="item.link" :href="normalizeLink(item.link)" class="child-link"
                    :class="{ active: normalizePath(route.path) === normalizePath(item.link) }">
                    <span class="link-icon">📄</span>
                    <span class="link-text">{{ item.text }}</span>
                </a>

                <!-- 如果子项还有嵌套 -->
                <div v-else-if="item.items" class="nested-group">
                    <div class="nested-title">
                        <span class="folder-icon">📁</span>
                        <span>{{ item.text }}</span>
                    </div>
                    <ul class="nested-list">
                        <li v-for="nested in item.items" :key="nested.text">
                            <a :href="normalizeLink(nested.link)" class="nested-link"
                                :class="{ active: normalizePath(route.path) === normalizePath(nested.link) }">
                                {{ nested.text }}
                            </a>
                        </li>
                    </ul>
                </div>
            </li>
        </ul>
    </div>

    <div v-else class="empty-state">
        <p>当前页面没有子目录内容</p>
    </div>
</template>

<style scoped>
.sub-sidebar-list {
    margin-top: 1.5rem;
    padding: 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
}

.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--vp-c-divider);
}

.group-title {
    font-weight: 700;
    font-size: 1.1em;
    color: var(--vp-c-text-1);
}

.item-count {
    font-size: 0.85em;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-mute);
    padding: 2px 8px;
    border-radius: 10px;
}

.child-list {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
}

.child-item {
    margin-bottom: 0.5rem;
}

.child-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    text-decoration: none;
    color: var(--vp-c-text-2);
    border-radius: 6px;
    transition: all 0.2s ease;
}

.child-link:hover {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
}

.child-link.active {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand);
    font-weight: 500;
}

.link-icon {
    font-size: 0.9em;
}

.link-text {
    flex: 1;
}

.nested-group {
    margin-top: 0.5rem;
}

.nested-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.folder-icon {
    font-size: 0.9em;
}

.nested-list {
    list-style: none !important;
    margin: 0 !important;
    padding-left: 2rem !important;
    border-left: 2px solid var(--vp-c-divider);
    margin-left: 1rem !important;
}

.nested-link {
    display: block;
    padding: 6px 12px;
    text-decoration: none;
    color: var(--vp-c-text-3);
    font-size: 0.9em;
    border-radius: 4px;
    transition: all 0.2s ease;
}

.nested-link:hover {
    color: var(--vp-c-brand);
    background-color: var(--vp-c-bg-mute);
}

.nested-link.active {
    color: var(--vp-c-brand);
    font-weight: 500;
}

.empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
}
</style>