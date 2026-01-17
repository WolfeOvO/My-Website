<script setup>
/**
 * AutoToc - VitePress 自动目录组件
 * 
 * 规则：
 * 1. 顶层 → 无限向下（所有子级、子子级、子子子级...全部显示）
 * 2. 同级无子级 → 只显示同级（不展开）
 * 3. 有父有子 → 从同级无限向下（同级及所有子孙级全部显示）
 * 4. 最底层无同级 → 空
 */
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const props = defineProps({
    title: { type: String, default: '目录导航' },
    showIcon: { type: Boolean, default: true },
    emptyText: { type: String, default: '暂无内容' },
    debug: { type: Boolean, default: false }
})

const { theme } = useData()
const route = useRoute()

const currentPath = computed(() => route.path)

// 规范化路径
function normalizePath(path) {
    if (!path) return ''
    let decoded = path
    try {
        decoded = decodeURIComponent(path)
    } catch (e) {
        decoded = path
    }
    return decoded
        .replace(/\/index\.html?$/, '/')
        .replace(/\.html?$/, '')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '') || '/'
}

// 拼接 base 和 link
function resolveLink(base, link) {
    if (!link) return null
    if (link.startsWith('/')) return normalizePath(link)

    const resolvedBase = base || '/'
    const fullPath = resolvedBase.endsWith('/')
        ? resolvedBase + link
        : resolvedBase + '/' + link

    return normalizePath(fullPath)
}

// 【无限向下】递归展平所有子孙级
function flattenAllDescendants(items, parentBase = '/', depth = 0) {
    const result = []

    for (const item of items) {
        const currentBase = item.base || parentBase
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null

        result.push({
            text: item.text,
            link: fullLink,
            depth,
            hasChildren: !!(item.items?.length)
        })

        // 无限递归子级
        if (item.items?.length) {
            result.push(...flattenAllDescendants(item.items, currentBase, depth + 1))
        }
    }

    return result
}

// 【只显示同级】不递归
function flattenSiblingsOnly(items, parentBase = '/') {
    return items.map(item => {
        const currentBase = item.base || parentBase
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null
        return {
            text: item.text,
            link: fullLink,
            depth: 0,
            hasChildren: !!(item.items?.length)
        }
    })
}

// 查找 sidebar 分组
function findSidebarGroup(sidebar, path) {
    if (!sidebar) return null

    if (Array.isArray(sidebar)) {
        return { key: '/', items: sidebar }
    }

    const normalizedPath = normalizePath(path)
    const keys = Object.keys(sidebar).sort((a, b) => b.length - a.length)

    for (const key of keys) {
        const normalizedKey = normalizePath(key)
        if (normalizedPath.startsWith(normalizedKey)) {
            return { key, items: sidebar[key] }
        }
    }
    return null
}

// 递归查找当前页面位置
function findPosition(items, path, parentBase = '/', depth = 0) {
    const normalizedPath = normalizePath(path)

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const currentBase = item.base || parentBase
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null

        if (fullLink && normalizePath(fullLink) === normalizedPath) {
            return {
                current: item,
                currentBase,
                siblings: items,
                siblingBase: parentBase,
                depth,
                hasChildren: !!(item.items?.length)
            }
        }

        if (item.items?.length) {
            const found = findPosition(item.items, path, currentBase, depth + 1)
            if (found) return found
        }
    }
    return null
}

// 生成目录内容
const tocItems = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    const position = findPosition(group.items, currentPath.value, group.key)

    // 情况1: 未找到位置（顶层）→ 无限向下
    if (!position) {
        return flattenAllDescendants(group.items, group.key, 0)
    }

    const { depth, hasChildren, siblings, siblingBase, current, currentBase } = position

    // 情况1: 顶层(depth=0)且有子级 → 无限向下
    if (depth === 0 && hasChildren) {
        return flattenAllDescendants(current.items, currentBase, 0)
    }

    // 情况3: 有父级(depth>0)且有子级 → 从同级无限向下
    if (depth > 0 && hasChildren) {
        return flattenAllDescendants(siblings, siblingBase, 0)
    }

    // 情况2: 无子级且同级有其他内容 → 只显示同级
    if (!hasChildren && siblings.length > 1) {
        return flattenSiblingsOnly(siblings, siblingBase)
    }

    // 情况4: 最底层无同级 → 空
    return []
})

// 判断是否为当前页面
function isCurrentPage(link) {
    if (!link) return false
    return normalizePath(link) === normalizePath(currentPath.value)
}

// 调试信息
const debugInfo = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return { error: 'sidebar 为空' }

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return { error: '未匹配分组', keys: Object.keys(sidebar) }

    const position = findPosition(group.items, currentPath.value, group.key)

    let positionType = '未知'
    if (!position) {
        positionType = '顶层（未找到位置）→ 无限向下'
    } else if (position.depth === 0 && position.hasChildren) {
        positionType = '顶层有子级 → 无限向下'
    } else if (position.depth > 0 && position.hasChildren) {
        positionType = '有父有子 → 从同级无限向下'
    } else if (!position.hasChildren && position.siblings.length > 1) {
        positionType = '无子级有同级 → 只显示同级'
    } else {
        positionType = '最底层无同级 → 空'
    }

    return {
        currentPath: normalizePath(currentPath.value),
        groupKey: group.key,
        positionType,
        position: position ? {
            depth: position.depth,
            hasChildren: position.hasChildren,
            siblingsCount: position.siblings.length,
            currentText: position.current?.text
        } : null,
        resultCount: tocItems.value.length
    }
})
</script>

<template>
    <div class="auto-toc">
        <div class="auto-toc-header" v-if="title">
            <span class="auto-toc-icon" v-if="showIcon">📑</span>
            <span class="auto-toc-title">{{ title }}</span>
        </div>

        <div class="auto-toc-content" v-if="tocItems.length > 0">
            <ul class="auto-toc-list">
                <li v-for="(item, index) in tocItems" :key="index" class="auto-toc-item" :class="{
                    'is-current': isCurrentPage(item.link),
                    'is-group': !item.link
                }" :style="{ paddingLeft: `${item.depth * 16 + 12}px` }">
                    <a v-if="item.link" :href="item.link" class="auto-toc-link"
                        :class="{ 'is-active': isCurrentPage(item.link) }">
                        <span class="link-indicator" v-if="showIcon">
                            {{ isCurrentPage(item.link) ? '📍' : '📄' }}
                        </span>
                        <span class="link-text">{{ item.text }}</span>
                    </a>
                    <span v-else class="auto-toc-group-title">
                        <span class="group-indicator" v-if="showIcon">📁</span>
                        <span class="group-text">{{ item.text }}</span>
                    </span>
                </li>
            </ul>
        </div>

        <div class="auto-toc-empty" v-else>
            <span class="empty-icon" v-if="showIcon">📭</span>
            <span class="empty-text">{{ emptyText }}</span>
        </div>

        <div v-if="debug" class="auto-toc-debug">
            <details>
                <summary>🔍 调试</summary>
                <pre>{{ JSON.stringify(debugInfo, null, 2) }}</pre>
            </details>
        </div>
    </div>
</template>

<style scoped>
.auto-toc {
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background: var(--vp-c-bg-soft);
    overflow: hidden;
    margin: 16px 0;
}

.auto-toc-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--vp-c-bg-alt);
    border-bottom: 1px solid var(--vp-c-divider);
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.auto-toc-icon {
    font-size: 1.1em;
}

.auto-toc-title {
    font-size: 0.95em;
}

.auto-toc-content {
    padding: 8px 0;
}

.auto-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.auto-toc-item {
    padding: 8px 12px;
    transition: background-color 0.2s ease;
}

.auto-toc-item:hover {
    background: var(--vp-c-bg-alt);
}

.auto-toc-item.is-current {
    background: var(--vp-c-brand-soft);
}

.auto-toc-item.is-group {
    padding-top: 12px;
    padding-bottom: 6px;
}

.auto-toc-link {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--vp-c-text-2);
    text-decoration: none;
    font-size: 0.9em;
    transition: color 0.2s ease;
}

.auto-toc-link:hover {
    color: var(--vp-c-brand-1);
}

.auto-toc-link.is-active {
    color: var(--vp-c-brand-1);
    font-weight: 600;
}

.link-indicator {
    font-size: 0.9em;
    flex-shrink: 0;
}

.link-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.auto-toc-group-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--vp-c-text-1);
    font-weight: 600;
    font-size: 0.85em;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.group-indicator {
    font-size: 0.9em;
}

.auto-toc-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 32px 16px;
    color: var(--vp-c-text-3);
    font-size: 0.9em;
}

.empty-icon {
    font-size: 1.2em;
}

.auto-toc-debug {
    border-top: 1px dashed var(--vp-c-divider);
    padding: 8px 12px;
    font-size: 12px;
}

.auto-toc-debug summary {
    cursor: pointer;
    color: var(--vp-c-text-3);
}

.auto-toc-debug pre {
    margin: 8px 0 0;
    padding: 8px;
    background: var(--vp-c-bg-alt);
    border-radius: 4px;
    overflow-x: auto;
    font-size: 11px;
}

@media (max-width: 768px) {
    .auto-toc {
        margin: 12px 0;
    }

    .auto-toc-header {
        padding: 10px 12px;
    }

    .auto-toc-item {
        padding: 6px 10px;
    }
}
</style>