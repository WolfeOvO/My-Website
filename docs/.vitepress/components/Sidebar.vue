<script setup>
/**
 * AutoToc - VitePress 自动目录组件
 * 支持 base 属性、多层嵌套、collapsed 等复杂配置
 */
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const props = defineProps({
    title: { type: String, default: '目录导航' },
    showIcon: { type: Boolean, default: true },
    emptyText: { type: String, default: '暂无内容' },
    debug: { type: Boolean, default: false }  // 调试模式
})

const { theme } = useData()
const route = useRoute()

const currentPath = computed(() => route.path)

// 规范化路径
function normalizePath(path) {
    if (!path) return ''
    // 解码 URL 编码的中文字符
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

// 递归展平 sidebar 项目
function flattenItems(items, parentBase = '/', depth = 0) {
    const result = []

    for (const item of items) {
        const currentBase = item.base || parentBase
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null

        result.push({
            text: item.text,
            link: fullLink,
            depth,
            collapsed: item.collapsed,
            hasChildren: !!(item.items?.length)
        })

        if (item.items?.length) {
            result.push(...flattenItems(item.items, currentBase, depth + 1))
        }
    }

    return result
}

// 查找当前路径所属的 sidebar 分组
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

// 在原始结构中查找当前页面的位置信息
function findPositionInStructure(items, path, parentBase = '/', parent = null, depth = 0) {
    const normalizedPath = normalizePath(path)

    for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const currentBase = item.base || parentBase
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null

        if (fullLink && normalizePath(fullLink) === normalizedPath) {
            return {
                current: item,
                currentBase,
                parent,
                siblings: items,
                siblingBase: parentBase,
                depth,
                index: i,
                hasChildren: !!(item.items?.length)
            }
        }

        if (item.items?.length) {
            const found = findPositionInStructure(item.items, path, currentBase, item, depth + 1)
            if (found) return found
        }
    }
    return null
}

// 判断位置类型
function getPositionType(position) {
    if (!position) return 'top'

    const { depth, hasChildren, siblings } = position

    if (depth === 0 && hasChildren) return 'top'
    if (depth > 0 && hasChildren) return 'middle'
    if (!hasChildren && siblings.length > 1) return 'sibling'
    if (!hasChildren && siblings.length <= 1) return 'empty'

    return 'sibling'
}

// 生成目录内容
const tocItems = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    const position = findPositionInStructure(group.items, currentPath.value, group.key)
    const positionType = getPositionType(position)

    let items = []

    switch (positionType) {
        case 'top':
            // 情况1: 顶层或未找到位置，显示该分组所有内容
            if (position?.current?.items) {
                items = flattenItems(position.current.items, position.currentBase, 0)
            } else {
                // 未找到具体位置时，展示整个分组内容
                items = flattenItems(group.items, group.key, 0)
            }
            break

        case 'middle':
            // 情况3: 有父级有子级，从同级无限向下
            if (position) {
                items = flattenItems(position.siblings, position.siblingBase, 0)
            }
            break

        case 'sibling':
            // 情况2: 同级无子级，显示同级内容
            if (position) {
                items = position.siblings.map(item => {
                    const fullLink = item.link
                        ? resolveLink(item.base || position.siblingBase, item.link)
                        : null
                    return {
                        text: item.text,
                        link: fullLink,
                        depth: 0,
                        hasChildren: !!(item.items?.length)
                    }
                })
            }
            break

        case 'empty':
            items = []
            break

        default:
            items = flattenItems(group.items, group.key, 0)
    }

    return items.filter(item => item.link || item.text)
})

// 判断是否为当前页面
function isCurrentPage(link) {
    if (!link) return false
    return normalizePath(link) === normalizePath(currentPath.value)
}

// 调试信息
const debugInfo = computed(() => {
    const sidebar = theme.value.sidebar

    if (!sidebar) {
        return { error: 'sidebar 为空', sidebar: null }
    }

    const group = findSidebarGroup(sidebar, currentPath.value)

    if (!group) {
        return {
            error: '未匹配到 sidebar 分组',
            currentPath: currentPath.value,
            normalizedPath: normalizePath(currentPath.value),
            sidebarKeys: Object.keys(sidebar)
        }
    }

    // 收集所有可能的链接用于调试
    const allLinks = flattenItems(group.items, group.key, 0)
        .filter(item => item.link)
        .map(item => item.link)

    const position = findPositionInStructure(group.items, currentPath.value, group.key)
    const positionType = getPositionType(position)

    return {
        currentPath: currentPath.value,
        normalizedPath: normalizePath(currentPath.value),
        groupKey: group.key,
        positionType,
        positionFound: !!position,
        position: position ? {
            depth: position.depth,
            hasChildren: position.hasChildren,
            siblingsCount: position.siblings.length,
            currentText: position.current?.text
        } : null,
        allLinksInGroup: allLinks,
        tocItemsCount: tocItems.value.length
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

        <!-- 调试信息 -->
        <div v-if="debug" class="auto-toc-debug">
            <details>
                <summary>🔍 调试信息</summary>
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

/* 调试样式 */
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
    line-height: 1.4;
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