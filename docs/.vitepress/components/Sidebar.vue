<script setup>
/**
 * AutoToc Ultimate V2 - 深度递归 & 紧凑布局版
 * 
 * 1. 递归提取所有含文件的文件夹，解决深层目录(如2026、客户端)不显示的问题
 * 2. 统计信息移至右侧，并细化为 "分组:X | 页面:Y"
 * 3. 样式高度压缩，更紧凑
 */
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
    if (t.includes('端') || t.includes('client')) return '💻'
    if (t.includes('年') || t.includes('月')) return '🗓️'
    return '📄'
}

// --- 核心数据逻辑 ---

// 递归查找：找到所有“包含直接文件链接”的组
function collectDisplayGroups(items, parentBase = '/') {
    let groups = []

    // 1. 检查当前层级是否有直接文件
    const directFiles = []
    // 2. 检查当前层级有多少个子文件夹（用于统计）
    let subGroupCount = 0

    for (const item of items) {
        const currentBase = item.base || parentBase

        if (item.link) {
            // 是文件
            directFiles.push({
                text: item.text,
                link: resolveLink(currentBase, item.link),
                icon: getIcon(item.text)
            })
        } else if (item.items) {
            // 是子文件夹
            subGroupCount++
            // 递归：深入子文件夹去抓取
            groups = groups.concat(collectDisplayGroups(item.items, currentBase))
        }
    }

    // 3. 如果当前层级有文件，或者这是一个我们要强制显示的节点（通过 title 判断是否为空）
    // 这里逻辑是：只要有文件，就生成一个 TOC 分组
    if (directFiles.length > 0) {
        // 这里的 item.text 在递归中很难获取上级名称，
        // 所以我们在外面调用时，实际上是把 items 传进来的。
        // 为了解决命名问题，我们稍作修改，让上层传入 Group Info。
        groups.unshift({
            isGroup: true,
            files: directFiles,
            subGroupCount: subGroupCount // 当前组下面还有多少个子文件夹
        })
    }

    return groups
}

// 包装函数：带上文件夹名称
function recursivelyFindGroups(items, parentBase = '/') {
    let result = []

    for (const item of items) {
        const currentBase = item.base || parentBase

        // 如果这个 item 有 children
        if (item.items && item.items.length > 0) {
            // 1. 先看看它自己下面有没有直接文件
            const directFiles = item.items.filter(i => i.link).map(i => ({
                text: i.text,
                link: resolveLink(i.base || currentBase, i.link),
                icon: getIcon(i.text)
            }))

            // 2. 统计它的直接子文件夹数量
            const subFolders = item.items.filter(i => i.items)

            // 3. 如果有文件，这就是一个要显示的组
            if (directFiles.length > 0) {
                result.push({
                    text: item.text,
                    count: directFiles.length,       // 页面数
                    groupCount: subFolders.length,   // 子分组数
                    children: directFiles,
                    collapsed: item.collapsed        // 继承配置
                })
            }

            // 4. 无论自己有没有文件，都要继续去子文件夹里找
            // (比如 "推荐机场" 下面没有文件，但 "推荐机场/2026" 下面有)
            result = result.concat(recursivelyFindGroups(item.items, currentBase))
        }
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

const tocGroups = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    // 1. 处理根目录散落文件的情况（虽然很少见）
    const rootFiles = group.items.filter(i => i.link).map(i => ({
        text: i.text,
        link: resolveLink(group.key, i.link),
        icon: getIcon(i.text)
    }))

    let finalGroups = []

    // 如果根目录有散文件，加进去
    if (rootFiles.length > 0) {
        finalGroups.push({
            text: '基础页面',
            count: rootFiles.length,
            groupCount: 0,
            children: rootFiles,
            collapsed: false
        })
    }

    // 2. 递归查找所有层级的文件夹
    finalGroups = finalGroups.concat(recursivelyFindGroups(group.items, group.key))

    return finalGroups
})

// 总统计
const totalStats = computed(() => {
    let pages = 0
    let groups = 0
    tocGroups.value.forEach(g => {
        pages += g.count
        groups += g.groupCount
    })
    // 这里的 groups 累加的是各层级的子分组数，或者我们可以直接统计 tocGroups.length (即显示出来的分组块数)
    // 根据用户需求 "总分组: XX"，通常指显示了多少个块。
    // 用户需求是 "总分组: XX | 总页面: XX"
    return {
        groups: tocGroups.value.length,
        pages: pages
    }
})

function isCurrent(link) {
    return link && normalizePath(link) === normalizePath(currentPath.value)
}
</script>

<template>
    <div class="toc-container">
        <!-- 顶部 Header -->
        <div class="toc-header" v-if="title">
            <div class="header-left">
                <span class="header-icon">🗂️</span>
                <span class="header-title">{{ title }}</span>
            </div>
            <div class="header-right">
                <!-- 需求：总分组: XX | 总页面: XX -->
                <span class="total-badge">总分组: {{ totalStats.groups }} | 总页面: {{ totalStats.pages }}</span>
            </div>
        </div>

        <div v-if="tocGroups.length" class="toc-body">
            <details class="toc-section" v-for="(group, idx) in tocGroups" :key="idx" :open="true">
                <summary class="toc-section-title">
                    <div class="section-info">
                        <span class="folder-icon">📂</span>
                        <span class="folder-name">{{ group.text }}</span>
                    </div>

                    <!-- 需求：蓝框统计移动到右边 -->
                    <div class="section-meta">
                        <!-- 需求：分组: XX | 页面: XX -->
                        <span class="count-badge">分组: {{ group.groupCount }} | 页面: {{ group.count }}</span>
                        <span class="chevron"></span>
                    </div>
                </summary>

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
    border-radius: 8px;
    /* 圆角稍微改小一点点更干练 */
    background-color: var(--vp-c-bg-soft);
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

/* --- Header --- */
.toc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* 需求：更紧凑，减小 padding */
    padding: 10px 16px;
    background: var(--vp-c-bg-alt);
    border-bottom: 1px solid var(--vp-c-divider);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-icon {
    font-size: 1.1rem;
}

.header-title {
    font-weight: 600;
    font-size: 0.95rem;
    color: var(--vp-c-text-1);
}

.total-badge {
    font-size: 0.75rem;
    font-family: var(--vp-font-family-mono);
    /* 使用等宽字体数字更整齐 */
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-soft);
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid var(--vp-c-divider);
}

/* --- Section --- */
.toc-section {
    border-bottom: 1px solid var(--vp-c-divider);
}

.toc-section:last-child {
    border-bottom: none;
}

.toc-section-title {
    /* 需求：绿框太高 -> 减少 padding */
    padding: 8px 16px;
    min-height: 40px;
    /* 保证最小点击区域 */
    cursor: pointer;
    display: flex;
    align-items: center;
    /* 垂直居中 */
    list-style: none;
    background: var(--vp-c-bg-soft);
    transition: background 0.1s;
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
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.folder-icon {
    font-size: 1rem;
    color: var(--vp-c-yellow-1, #e6a23c);
}

/* 文件夹设为黄色系 */

/* 需求：统计信息移到右边 */
.section-meta {
    margin-left: auto;
    /* 核心：推到右边 */
    display: flex;
    align-items: center;
    gap: 10px;
}

.count-badge {
    font-size: 0.7rem;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: var(--vp-font-family-mono);
    border: 1px solid transparent;
    /* 预留边框位置防止抖动 */
}

/* 箭头 */
.chevron::after {
    content: '›';
    font-size: 1.2rem;
    line-height: 1;
    color: var(--vp-c-text-3);
    display: block;
    /* block 更好控制旋转中心 */
    transform: rotate(90deg);
    transition: transform 0.2s;
}

details[open] .chevron::after {
    transform: rotate(-90deg);
}

/* --- Grid --- */
.toc-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    padding: 12px 16px;
    /* 内容区 padding 也稍微调整 */
    background: var(--vp-c-bg);
}

.toc-card {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--vp-c-bg-alt);
    border: 1px solid transparent;
    text-decoration: none !important;
    color: var(--vp-c-text-2) !important;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.toc-card:hover {
    transform: translateY(-1px);
    border-color: var(--vp-c-brand);
    color: var(--vp-c-brand) !important;
    background: var(--vp-c-bg);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toc-card.active {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1) !important;
    border-color: var(--vp-c-brand-soft);
    font-weight: 600;
}

.card-icon {
    font-size: 1em;
}

.card-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@media (max-width: 600px) {
    .toc-grid {
        grid-template-columns: repeat(2, 1fr);
        padding: 10px;
    }

    .section-meta {
        gap: 6px;
    }

    .count-badge {
        display: none;
        /* 手机屏幕太窄时，可选隐藏具体统计，或者缩小字体 */
    }

    /* 或者让手机只显示总数 */
    .total-badge {
        font-size: 0.7rem;
    }
}

.toc-empty {
    padding: 30px;
    text-align: center;
    color: var(--vp-c-text-3);
}

.toc-debug {
    background: #222;
    color: #0f0;
    padding: 10px;
    font-size: 10px;
    overflow: auto;
    max-height: 200px;
}
</style>