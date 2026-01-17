<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const props = defineProps({
    title: { type: String, default: '目录导航' },
    emptyText: { type: String, default: '暂无内容' },
    debug: { type: Boolean, default: false }
})

const { theme } = useData()
const route = useRoute()
const currentPath = computed(() => route.path)

// --- 基础工具 ---

function normalizePath(path) {
    if (!path) return ''
    try { path = decodeURIComponent(path) } catch (e) { }
    return path.replace(/\/index\.html?$/, '/').replace(/\.html?$/, '').replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

function resolveLink(base, link) {
    if (!link) return null
    if (link.startsWith('/')) return normalizePath(link)
    const resolvedBase = base || '/'
    return normalizePath(resolvedBase.endsWith('/') ? resolvedBase + link : resolvedBase + '/' + link)
}

// 自动 Emoji 映射
function getIcon(text) {
    const t = text.toLowerCase()
    if (t.includes('搜') || t.includes('search')) return '🔍'
    if (t.includes('问') || t.includes('ask')) return '🙋‍♂️'
    if (t.includes('百科') || t.includes('wiki')) return '📖'
    if (t.includes('盘') || t.includes('drive')) return '💾'
    if (t.includes('影') || t.includes('video')) return '🎬'
    if (t.includes('音') || t.includes('music')) return '🎵'
    if (t.includes('图') || t.includes('img')) return '🖼️'
    if (t.includes('书') || t.includes('lib')) return '🏛️'
    if (t.includes('社') || t.includes('social')) return '💬'
    if (t.includes('工') || t.includes('tool')) return '🛠️'
    if (t.includes('下') || t.includes('load')) return '📥'
    if (t.includes('教程') || t.includes('guide')) return '🧭'
    if (t.includes('代理') || t.includes('proxy')) return '🪜'
    if (t.includes('机') || t.includes('airport')) return '✈️'
    if (t.includes('电') || t.includes('telegram')) return '📢'
    return '📄'
}

// --- 数据处理 ---

function flattenLeaves(items, base) {
    let results = []
    for (const item of items) {
        const currentBase = item.base || base
        const fullLink = item.link ? resolveLink(currentBase, item.link) : null

        if (fullLink) {
            results.push({
                text: item.text,
                link: fullLink,
                icon: getIcon(item.text)
            })
        }

        if (item.items) {
            results = results.concat(flattenLeaves(item.items, currentBase))
        }
    }
    return results
}

function structurizeItems(items, parentBase = '/') {
    const result = []
    const rootItems = []

    for (const item of items) {
        const currentBase = item.base || parentBase

        if (item.items && item.items.length > 0) {
            // 这是一个文件夹（分组）
            const children = flattenLeaves(item.items, currentBase)
            result.push({
                type: 'group',
                text: item.text,
                count: children.length,
                children: children,
                collapsed: item.collapsed // 保持配置的折叠状态
            })
        } else if (item.link) {
            // 这是一个直接的文件
            const fullLink = resolveLink(currentBase, item.link)
            rootItems.push({
                text: item.text,
                link: fullLink,
                icon: getIcon(item.text)
            })
        }
    }

    // 如果有散落的文件，放在最前面作为一个特殊分组
    if (rootItems.length > 0) {
        result.unshift({
            type: 'root',
            text: '基础页面',
            count: rootItems.length,
            children: rootItems,
            collapsed: false
        })
    }

    return result
}

function findSidebarGroup(sidebar, path) {
    if (!sidebar) return null
    if (Array.isArray(sidebar)) return { key: '/', items: sidebar }

    const normalizedPath = normalizePath(path)
    const keys = Object.keys(sidebar).sort((a, b) => b.length - a.length)
    for (const key of keys) {
        if (normalizedPath.startsWith(normalizePath(key))) return { key, items: sidebar[key] }
    }
    return null
}

function getFirstLink(items, parentBase) {
    for (const item of items) {
        const currentBase = item.base || parentBase
        if (item.link) return resolveLink(currentBase, item.link)
        if (item.items?.length) {
            const found = getFirstLink(item.items, currentBase)
            if (found) return found
        }
    }
    return null
}

// 核心数据
const tocGroups = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    // 只要是该侧边栏分组下的页面，统统显示该分组的完整目录结构
    return structurizeItems(group.items, group.key)
})

// 计算总统计
const totalStats = computed(() => {
    let count = 0
    tocGroups.value.forEach(g => count += g.count)
    return count
})

function isCurrent(link) {
    return link && normalizePath(link) === normalizePath(currentPath.value)
}
</script>

<template>
    <div class="toc-container">
        <!-- 1. 顶部标题栏：包含总计 -->
        <div class="toc-header" v-if="title">
            <div class="header-left">
                <span class="header-icon">🗂️</span>
                <span class="header-title">{{ title }}</span>
            </div>
            <div class="header-right">
                <span class="total-badge">共 {{ totalStats }} 篇</span>
            </div>
        </div>

        <div v-if="tocGroups.length" class="toc-body">
            <!-- 2. 分组列表 -->
            <details class="toc-section" v-for="(group, idx) in tocGroups" :key="idx" :open="true">
                <summary class="toc-section-title">
                    <div class="section-info">
                        <!-- 文件夹图标 -->
                        <span class="folder-icon">{{ group.type === 'root' ? '📌' : '📂' }}</span>
                        <span class="folder-name">{{ group.text }}</span>
                        <span class="folder-count">{{ group.count }}</span>
                    </div>
                    <span class="chevron"></span>
                </summary>

                <!-- 3. 紧凑网格内容 -->
                <div class="toc-grid">
                    <a v-for="(item, i) in group.children" :key="i" :href="item.link" class="toc-card"
                        :class="{ 'active': isCurrent(item.link) }">
                        <span class="card-icon">{{ item.icon }}</span>
                        <span class="card-text">{{ item.text }}</span>
                    </a>
                </div>
            </details>
        </div>

        <div v-else class="toc-empty">
            <span class="empty-icon">📭</span>
            {{ emptyText }}
        </div>

        <div v-if="debug" class="toc-debug">
            <pre>{{ JSON.stringify(tocGroups, null, 2) }}</pre>
        </div>
    </div>
</template>

<style scoped>
.toc-container {
    margin: 1.5rem 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background-color: var(--vp-c-bg-soft);
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* --- 顶部 Header --- */
.toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    background: var(--vp-c-bg-alt);
    border-bottom: 1px solid var(--vp-c-divider);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 1.2rem;
}

.header-title {
    font-weight: 700;
    font-size: 1rem;
    color: var(--vp-c-text-1);
}

.total-badge {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--vp-c-brand-text);
    /* 使用主题色文字 */
    background: var(--vp-c-brand-soft);
    /* 使用主题色淡背景 */
    padding: 4px 10px;
    border-radius: 20px;
}

/* --- 分组标题 --- */
.toc-section {
    border-bottom: 1px solid var(--vp-c-divider);
}

.toc-section:last-child {
    border-bottom: none;
}

.toc-section-title {
    padding: 12px 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    background: var(--vp-c-bg-soft);
    transition: background 0.2s;
}

.toc-section-title::-webkit-details-marker {
    display: none;
}

.toc-section-title:hover {
    background: var(--vp-c-bg-alt);
}

.section-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--vp-c-text-2);
}

.folder-icon {
    font-size: 1.1rem;
}

.folder-count {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    background: var(--vp-c-divider);
    padding: 1px 6px;
    border-radius: 4px;
    margin-left: 4px;
    font-weight: normal;
}

.chevron::after {
    content: '›';
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--vp-c-text-3);
    display: inline-block;
    transform: rotate(90deg);
    transition: transform 0.2s;
}

details[open] .chevron::after {
    transform: rotate(-90deg);
}

/* --- 紧凑 Grid 网格 --- */
.toc-grid {
    display: grid;
    /* 核心：自适应列宽，最小140px，自动填满 */
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
    padding: 15px 20px;
    background: var(--vp-c-bg);
    /* 内容区用纯白/纯黑背景，突出层次 */
}

.toc-card {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 8px;
    background: var(--vp-c-bg-alt);
    /* 卡片微灰背景 */
    border: 1px solid transparent;
    text-decoration: none !important;
    color: var(--vp-c-text-1) !important;
    font-size: 0.9rem;
    transition: all 0.2s ease;
}

.toc-card:hover {
    transform: translateY(-2px);
    border-color: var(--vp-c-brand);
    background: var(--vp-c-bg);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.toc-card.active {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1) !important;
    border-color: var(--vp-c-brand-soft);
    font-weight: 600;
}

.card-icon {
    font-size: 1.1em;
}

.card-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* 移动端优化 */
@media (max-width: 600px) {
    .toc-grid {
        grid-template-columns: repeat(2, 1fr);
        /* 手机强制双列 */
        gap: 8px;
        padding: 10px;
    }

    .toc-card {
        padding: 8px;
        font-size: 0.85rem;
    }
}

.toc-empty {
    padding: 40px;
    text-align: center;
    color: var(--vp-c-text-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.empty-icon {
    font-size: 2rem;
}

.toc-debug {
    background: #222;
    color: #0f0;
    padding: 10px;
    font-size: 12px;
    overflow: auto;
    max-height: 200px;
}
</style>