<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import RecursiveRow from './RecursiveRow.vue' // 引入递归子组件

const props = defineProps({
    title: { type: String, default: '目录导航' },
    emptyText: { type: String, default: '当前页面没有子目录内容' }
})

const { theme } = useData()
const route = useRoute()
const currentPath = computed(() => route.path)

// --- 工具函数 ---
const normalizePath = (path) => {
    if (!path) return ''
    try { path = decodeURIComponent(path) } catch (e) { }
    return path.replace(/\/index\.html?$/, '/').replace(/\.html?$/, '').replace(/\/+/g, '/').replace(/\/$/, '') || '/'
}

const resolveLink = (base, link) => {
    if (!link) return null
    if (link.startsWith('/')) return normalizePath(link)
    const resolvedBase = base || '/'
    return normalizePath(resolvedBase.endsWith('/') ? resolvedBase + link : resolvedBase + '/' + link)
}

// 自动 Emoji
const getIcon = (text) => {
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

// --- 核心逻辑：递归提取结构 ---
function recursivelyFindGroups(items, parentBase = '/') {
    let result = []

    for (const item of items) {
        const currentBase = item.base || parentBase

        // 如果是分组 (有 items)
        if (item.items && item.items.length > 0) {
            // 1. 递归获取子级
            const children = recursivelyFindGroups(item.items, currentBase)

            // 2. 只有当它下面真的有文件（无论是直接的还是深层的）时，才算作一个有效组
            // 或者它本身虽然没直接文件，但为了保持目录结构展示

            // 这里我们做一个转换：
            // 把当前层级直接是 link 的，转换为 children 的一部分
            // 把当前层级是 items 的，也转换为 children

            // 但为了配合 RecursiveRow 的渲染，我们需要把数据标准化
            const standardChildren = []

            // 先处理直接子文件
            const directFiles = item.items.filter(i => i.link).map(i => ({
                text: i.text,
                link: resolveLink(i.base || currentBase, i.link),
                icon: getIcon(i.text)
            }))

            // 再处理子文件夹 (递归结果)
            const subFolders = recursivelyFindGroups(item.items.filter(i => i.items), currentBase)

            const allChildren = [...directFiles, ...subFolders]

            if (allChildren.length > 0) {
                result.push({
                    text: item.text,
                    items: allChildren,
                    isGroup: true,
                    count: countTotalLinks(allChildren) // 计算该组下的总文章数
                })
            }
        }
        // 如果是直接文件，由上层处理，或者如果我们在顶层调用，需要单独处理
        // (但在递归函数里，我们通常返回结构化的对象)
    }
    return result
}

// 辅助：递归计算总链接数
function countTotalLinks(items) {
    let count = 0
    for (const item of items) {
        if (item.link) count++
        if (item.items) count += countTotalLinks(item.items)
    }
    return count
}

// 查找侧边栏分组
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

const tocData = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []
    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    // 获取根目录下的散文件
    const rootFiles = group.items.filter(i => i.link).map(i => ({
        text: i.text,
        link: resolveLink(group.key, i.link),
        icon: getIcon(i.text)
    }))

    // 获取所有文件夹结构
    const folders = recursivelyFindGroups(group.items, group.key)

    // 合并：如果根目录下既有文件又有文件夹
    let result = folders
    if (rootFiles.length > 0) {
        // 把散文件作为一个特殊的“基础内容”组，或者直接放在顶层
        // 为了 UI 统一，我们把它们放在顶层列表里
        result = [...rootFiles, ...folders]
    }

    return result
})

// 总数统计
const totalCount = computed(() => countTotalLinks(tocData.value))
</script>

<template>
    <div class="sub-sidebar-list" v-if="tocData.length > 0">
        <!-- 顶部标题栏 -->
        <div class="group-header" v-if="title">
            <span class="group-title">{{ title }}</span>
            <span class="item-count">共 {{ totalCount }} 篇</span>
        </div>

        <!-- 递归渲染区域 -->
        <div class="list-content">
            <RecursiveRow :items="tocData" :depth="0" />
        </div>
    </div>

    <div v-else class="empty-state">
        <p>{{ emptyText }}</p>
    </div>
</template>

<style scoped>
/* 容器风格 - 复刻 SubSidebar */
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
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-mute);
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid var(--vp-c-divider);
}

.empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--vp-c-text-3);
    background: var(--vp-c-bg-soft);
    border-radius: 8px;
    border: 1px solid var(--vp-c-divider);
}

.list-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}
</style>