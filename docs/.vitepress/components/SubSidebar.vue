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

// 收集一个数组中所有有子级的项目
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

// 从祖先链中向上查找，找到第一个同级有子级的层级
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

// 递归查找当前页面，同时记录祖先链
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
const displayMode = computed(() => currentGroup.value?.mode || 'direct')

// 递归计算总项目数
const countItems = (items) => {
    let count = 0
    for (const item of items) {
        if (item.link) {
            count++
        }
        if (item.items) {
            count += countItems(item.items)
        }
    }
    return count
}

const totalItemCount = computed(() => {
    if (displayMode.value === 'siblings') {
        return childItems.value.reduce((sum, group) => {
            return sum + countItems(group.items || [])
        }, 0)
    }
    return countItems(childItems.value)
})

// 检查路径是否激活
const isActive = (link) => {
    if (!link) return false
    return normalizePath(route.path) === normalizePath(link)
}
</script>

<template>
    <div class="sub-sidebar-list" v-if="childItems.length > 0">
        <!-- 有标题时显示标题 -->
        <div class="group-header" v-if="groupTitle">
            <span class="group-title">{{ groupTitle }}</span>
            <span class="item-count">{{ totalItemCount }} 项</span>
        </div>
        <!-- 顶层没有标题时显示简洁的计数 -->
        <div class="group-header" v-else-if="displayMode === 'siblings'">
            <span class="group-title">全部内容</span>
            <span class="item-count">{{ totalItemCount }} 项</span>
        </div>

        <!-- 直接子级模式 / 平级列表模式 -->
        <ul class="child-list" v-if="displayMode === 'direct' || displayMode === 'flat'">
            <template v-for="(item, index) in childItems" :key="index">
                <li class="child-item">
                    <!-- 有链接的项 -->
                    <a v-if="item.link" :href="normalizeLink(item.link)" class="child-link"
                        :class="{ active: isActive(item.link) }">
                        <span class="link-icon">📄</span>
                        <span class="link-text">{{ item.text }}</span>
                    </a>
                    
                    <!-- 无链接但有子级的项（文件夹） -->
                    <div v-else-if="item.items" class="folder-item">
                        <div class="folder-title">
                            <span class="folder-icon">📁</span>
                            <span>{{ item.text }}</span>
                        </div>
                    </div>
                </li>
                
                <!-- 递归渲染子级 -->
                <li v-if="item.items && item.items.length > 0" class="nested-container">
                    <RecursiveItems :items="item.items" :depth="1" :normalize-link="normalizeLink" :is-active="isActive" />
                </li>
            </template>
        </ul>

        <!-- 同级子级模式：显示所有同级项目的子级 -->
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
                    <RecursiveItems :items="group.items" :depth="0" :normalize-link="normalizeLink" :is-active="isActive" />
                </div>
            </div>
        </div>
    </div>

    <div v-else class="empty-state">
        <p>当前页面没有子目录内容</p>
    </div>
</template>

<!-- 递归子组件 -->
<script>
import { defineComponent, h } from 'vue'

const RecursiveItems = defineComponent({
    name: 'RecursiveItems',
    props: {
        items: { type: Array, required: true },
        depth: { type: Number, default: 0 },
        normalizeLink: { type: Function, required: true },
        isActive: { type: Function, required: true }
    },
    setup(props) {
        return () => {
            const children = []
            
            for (const item of props.items) {
                // 有链接的项
                if (item.link) {
                    children.push(
                        h('div', { 
                            class: ['recursive-item', { 'depth-indent': props.depth > 0 }],
                            style: { paddingLeft: `${props.depth * 1}rem` }
                        }, [
                            h('a', {
                                href: props.normalizeLink(item.link),
                                class: ['recursive-link', { active: props.isActive(item.link) }]
                            }, [
                                h('span', { class: 'link-icon' }, '📄'),
                                h('span', { class: 'link-text' }, item.text)
                            ])
                        ])
                    )
                }
                // 无链接但有子级的文件夹
                else if (item.items && item.items.length > 0) {
                    children.push(
                        h('div', { 
                            class: 'recursive-folder',
                            style: { paddingLeft: `${props.depth * 1}rem` }
                        }, [
                            h('div', { class: 'folder-header' }, [
                                h('span', { class: 'folder-icon' }, '📁'),
                                h('span', { class: 'folder-name' }, item.text)
                            ])
                        ])
                    )
                }
                
                // 递归渲染子级
                if (item.items && item.items.length > 0) {
                    children.push(
                        h(RecursiveItems, {
                            items: item.items,
                            depth: props.depth + 1,
                            normalizeLink: props.normalizeLink,
                            isActive: props.isActive
                        })
                    )
                }
            }
            
            return h('div', { class: 'recursive-container' }, children)
        }
    }
})

export default {
    components: { RecursiveItems }
}
</script>

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
    margin-bottom: 0.25rem;
}

.nested-container {
    list-style: none !important;
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
    flex-shrink: 0;
}

.link-text {
    flex: 1;
}

.folder-item {
    margin-bottom: 0.25rem;
}

.folder-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.folder-icon {
    font-size: 0.9em;
    flex-shrink: 0;
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

/* 递归组件样式 */
:deep(.recursive-container) {
    display: flex;
    flex-direction: column;
}

:deep(.recursive-item) {
    margin-bottom: 0.25rem;
}

:deep(.recursive-link) {
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

:deep(.recursive-link:hover) {
    background-color: var(--vp-c-bg-mute);
    color: var(--vp-c-brand);
}

:deep(.recursive-link.active) {
    background-color: var(--vp-c-brand-soft);
    color: var(--vp-c-brand);
    font-weight: 500;
}

:deep(.recursive-folder) {
    margin-bottom: 0.25rem;
}

:deep(.folder-header) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    font-size: 0.95em;
}

:deep(.folder-name) {
    flex: 1;
}

:deep(.depth-indent) {
    border-left: 2px solid var(--vp-c-divider);
    margin-left: 0.5rem;
}
</style>