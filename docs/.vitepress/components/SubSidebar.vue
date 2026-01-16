<script setup>
import { useData, useRoute, withBase } from 'vitepress'
import { computed } from 'vue'
import RecursiveItems from './RecursiveItems.vue'

const { theme } = useData()
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

const collectAllChildrenFromSiblings = (siblings) => {
    const allChildren = []
    for (const sibling of siblings) {
        if (sibling.items && sibling.items.length > 0) {
            allChildren.push({
                text: sibling.text,
                link: sibling.link,
                items: sibling.items,
                isGroup: true
            })
        }
    }
    return allChildren
}

const findSiblingsWithChildren = (ancestors, topLevelItems) => {
    for (let i = ancestors.length - 1; i >= 0; i--) {
        const { parent, siblings } = ancestors[i]
        const siblingsWithChildren = collectAllChildrenFromSiblings(siblings)
        if (siblingsWithChildren.length > 0) {
            return {
                group: parent,
                children: siblingsWithChildren,
                mode: 'siblings'
            }
        }
    }

    const topLevelWithChildren = collectAllChildrenFromSiblings(topLevelItems)
    if (topLevelWithChildren.length > 0) {
        return {
            group: null,
            children: topLevelWithChildren,
            mode: 'siblings'
        }
    }

    return {
        group: null,
        children: topLevelItems,
        mode: 'flat'
    }
}

const findCurrentGroup = (items, currentPath, ancestors = [], topLevelItems = null) => {
    if (topLevelItems === null) {
        topLevelItems = items
    }

    for (const item of items) {
        if (item.link) {
            const itemPath = normalizePath(item.link)
            if (currentPath === itemPath || currentPath.startsWith(itemPath + '/')) {

                if (item.items && item.items.length > 0) {
                    return {
                        group: item,
                        children: item.items,
                        mode: 'direct'
                    }
                }

                const currentLevelSiblings = ancestors.length > 0
                    ? ancestors[ancestors.length - 1].siblings
                    : items
                const siblingsWithChildren = collectAllChildrenFromSiblings(currentLevelSiblings)

                if (siblingsWithChildren.length > 0) {
                    const parent = ancestors.length > 0 ? ancestors[ancestors.length - 1].parent : null
                    return {
                        group: parent,
                        children: siblingsWithChildren,
                        mode: 'siblings'
                    }
                }

                return findSiblingsWithChildren(ancestors, topLevelItems)
            }
        }

        if (item.items) {
            const newAncestors = [...ancestors, { parent: item, siblings: item.items }]
            const found = findCurrentGroup(item.items, currentPath, newAncestors, topLevelItems)
            if (found) return found
        }
    }
    return null
}

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
const displayMode = computed(() => currentGroup.value?.mode || 'direct')

const countItems = (items) => {
    let count = 0
    for (const item of items) {
        if (item.link) count++
        if (item.items) count += countItems(item.items)
    }
    return count
}

const totalItemCount = computed(() => {
    if (displayMode.value === 'siblings') {
        return childItems.value.reduce((sum, group) => sum + countItems(group.items || []), 0)
    }
    return countItems(childItems.value)
})

const isActive = (link) => {
    if (!link) return false
    return normalizePath(route.path) === normalizePath(link)
}
</script>

<template>
    <div class="sub-sidebar-list" v-if="childItems.length > 0">
        <div class="group-header" v-if="groupTitle">
            <span class="group-title">{{ groupTitle }}</span>
            <span class="item-count">{{ totalItemCount }} 项</span>
        </div>
        <div class="group-header" v-else-if="displayMode === 'siblings'">
            <span class="group-title">全部内容</span>
            <span class="item-count">{{ totalItemCount }} 项</span>
        </div>

        <!-- 直接子级模式 / 平级列表模式 -->
        <div v-if="displayMode === 'direct' || displayMode === 'flat'" class="direct-mode">
            <RecursiveItems :items="childItems" :depth="0" />
        </div>

        <!-- 同级子级模式 -->
        <div class="siblings-mode" v-else-if="displayMode === 'siblings'">
            <div v-for="(group, index) in childItems" :key="index" class="sibling-group">
                <div class="sibling-header">
                    <a v-if="group.link" :href="normalizeLink(group.link)" class="sibling-title-link"
                        :class="{ active: isActive(group.link) }">
                        <span class="folder-icon">📁</span>
                        <span>{{ group.text }}</span>
                        <span class="group-count">{{ countItems(group.items || []) }}</span>
                    </a>
                    <div v-else class="sibling-title">
                        <span class="folder-icon">📁</span>
                        <span>{{ group.text }}</span>
                        <span class="group-count">{{ countItems(group.items || []) }}</span>
                    </div>
                </div>
                <div class="sibling-children">
                    <RecursiveItems :items="group.items || []" :depth="0" />
                </div>
            </div>
        </div>
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

.empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
}

/* 同级子级模式样式 */
.siblings-mode {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.sibling-group {
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    overflow: hidden;
    background: var(--vp-c-bg);
}

.sibling-header {
    background: var(--vp-c-bg-mute);
    border-bottom: 1px solid var(--vp-c-divider);
}

.sibling-title,
.sibling-title-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.sibling-title-link {
    text-decoration: none;
    transition: all 0.2s ease;
}

.sibling-title-link:hover {
    color: var(--vp-c-brand);
    background: var(--vp-c-bg-soft);
}

.sibling-title-link.active {
    color: var(--vp-c-brand);
    background: var(--vp-c-brand-soft);
}

.group-count {
    margin-left: auto;
    font-size: 0.8em;
    font-weight: normal;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg);
    padding: 2px 8px;
    border-radius: 10px;
}

.sibling-children {
    padding: 0.5rem;
}

.folder-icon {
    font-size: 0.9em;
    flex-shrink: 0;
}
</style>