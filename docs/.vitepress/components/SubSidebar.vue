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

// 收集一个项目下所有有子级的项目的子级内容
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

// 递归查找当前页面所属的父级项目及其子内容
const findCurrentGroup = (items, currentPath, parent = null) => {
    for (const item of items) {
        if (item.link) {
            const itemPath = normalizePath(item.link)
            if (currentPath === itemPath || currentPath.startsWith(itemPath + '/')) {

                // ========== 顶层项处理（没有parent） ==========
                if (!parent) {
                    // 收集所有顶层同级的子级
                    const allSiblingChildren = collectAllChildrenFromSiblings(items)
                    if (allSiblingChildren.length > 0) {
                        return {
                            group: null,  // 顶层没有group标题
                            children: allSiblingChildren,
                            mode: 'siblings'
                        }
                    }
                    // 顶层同级都没有子级，返回顶层列表本身
                    return {
                        group: null,
                        children: items,
                        mode: 'flat'
                    }
                }

                // ========== 非顶层项处理（有parent） ==========
                // 情况1: 当前项有子项，返回当前项的子项
                if (item.items && item.items.length > 0) {
                    return {
                        group: item,
                        children: item.items,
                        mode: 'direct'
                    }
                }

                // 情况2: 当前项没有子项，收集同级所有子级
                if (parent.items) {
                    const allSiblingChildren = collectAllChildrenFromSiblings(parent.items)
                    if (allSiblingChildren.length > 0) {
                        return {
                            group: parent,
                            children: allSiblingChildren,
                            mode: 'siblings'
                        }
                    }

                    // 情况3: 同级都没有子级，返回同级列表本身
                    return {
                        group: parent,
                        children: parent.items,
                        mode: 'flat'
                    }
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
const displayMode = computed(() => currentGroup.value?.mode || 'direct')

// 计算总项目数（用于显示）
const totalItemCount = computed(() => {
    if (displayMode.value === 'siblings') {
        return childItems.value.reduce((sum, group) => {
            return sum + (group.items?.length || 0)
        }, 0)
    }
    return childItems.value.length
})
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

        <!-- 同级子级模式：显示所有同级项目的子级 -->
        <div class="siblings-mode" v-else-if="displayMode === 'siblings'">
            <div v-for="(group, index) in childItems" :key="index" class="sibling-group">
                <div class="sibling-header">
                    <a v-if="group.link" :href="normalizeLink(group.link)" class="sibling-title-link"
                        :class="{ active: normalizePath(route.path) === normalizePath(group.link) }">
                        <span class="folder-icon">📁</span>
                        <span>{{ group.text }}</span>
                        <span class="group-count">{{ group.items?.length || 0 }}</span>
                    </a>
                    <div v-else class="sibling-title">
                        <span class="folder-icon">📁</span>
                        <span>{{ group.text }}</span>
                        <span class="group-count">{{ group.items?.length || 0 }}</span>
                    </div>
                </div>
                <ul class="sibling-children">
                    <li v-for="child in group.items" :key="child.text">
                        <a v-if="child.link" :href="normalizeLink(child.link)" class="child-link"
                            :class="{ active: normalizePath(route.path) === normalizePath(child.link) }">
                            <span class="link-icon">📄</span>
                            <span class="link-text">{{ child.text }}</span>
                        </a>
                        <!-- 处理更深层嵌套 -->
                        <div v-else-if="child.items" class="nested-in-sibling">
                            <div class="nested-folder">
                                <span class="folder-icon">📁</span>
                                <span>{{ child.text }}</span>
                            </div>
                            <ul class="deep-nested-list">
                                <li v-for="deep in child.items" :key="deep.text">
                                    <a :href="normalizeLink(deep.link)" class="nested-link"
                                        :class="{ active: normalizePath(route.path) === normalizePath(deep.link) }">
                                        {{ deep.text }}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
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
    list-style: none !important;
    margin: 0 !important;
    padding: 0.5rem !important;
}

.sibling-children li {
    margin-bottom: 0.25rem;
}

.sibling-children .child-link {
    padding: 6px 10px;
    font-size: 0.95em;
}

/* 深层嵌套样式 */
.nested-in-sibling {
    padding: 0.25rem 0;
}

.nested-folder {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    font-size: 0.95em;
}

.deep-nested-list {
    list-style: none !important;
    margin: 0 !important;
    padding-left: 1.5rem !important;
    border-left: 2px solid var(--vp-c-divider);
    margin-left: 0.75rem !important;
}

.deep-nested-list .nested-link {
    padding: 4px 10px;
    font-size: 0.9em;
}
</style>