<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import RecursiveRow from './RecursiveRow.vue'

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
function recursivelyBuildStructure(items, parentBase = '/') {
    let result = []

    for (const item of items) {
        const currentBase = item.base || parentBase

        if (item.items && item.items.length > 0) {
            // 处理直接子文件
            const directFiles = item.items.filter(i => i.link).map(i => ({
                text: i.text,
                link: resolveLink(i.base || currentBase, i.link),
                icon: getIcon(i.text)
            }))

            // 递归处理子文件夹
            const subFolders = recursivelyBuildStructure(item.items.filter(i => i.items), currentBase)

            const allChildren = [...directFiles, ...subFolders]

            if (allChildren.length > 0) {
                result.push({
                    text: item.text,
                    items: allChildren,
                    isGroup: true,
                    count: countTotalLinks(allChildren)
                })
            }
        }
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

/**
 * 在侧边栏结构中查找当前页面的位置信息
 * 返回: { found, isTopLevel, siblings, hasChildren, hasSiblings, parent, currentItem }
 */
function findCurrentPageContext(items, targetPath, parentBase = '/', parent = null, depth = 0) {
    const normalizedTarget = normalizePath(targetPath)

    // 收集当前层级的所有链接项（同级）
    const currentLevelLinks = items.filter(i => i.link).map(i => ({
        text: i.text,
        link: resolveLink(i.base || parentBase, i.link),
        icon: getIcon(i.text),
        // 检查该项是否有子项（通过检查原始 items 数组中是否有同名的 group）
        hasChildren: false
    }))

    // 收集当前层级的分组
    const currentLevelGroups = items.filter(i => i.items && i.items.length > 0)

    // 在当前层级的链接中查找目标
    for (let i = 0; i < currentLevelLinks.length; i++) {
        const linkItem = currentLevelLinks[i]
        if (normalizePath(linkItem.link) === normalizedTarget) {
            // 找到了！
            // 判断同级有多少项
            const siblingLinks = currentLevelLinks.filter(l => normalizePath(l.link) !== normalizedTarget)
            const hasSiblings = siblingLinks.length > 0 || currentLevelGroups.length > 0

            return {
                found: true,
                isTopLevel: depth === 0 && parent === null,
                siblings: currentLevelLinks,          // 同级链接
                siblingGroups: currentLevelGroups,    // 同级分组
                hasChildren: false,                   // 链接项本身没有子级
                hasSiblings: hasSiblings,
                parent: parent,
                currentItem: linkItem,
                depth: depth,
                parentBase: parentBase
            }
        }
    }

    // 在分组中递归查找
    for (const group of currentLevelGroups) {
        const groupBase = group.base || parentBase
        const result = findCurrentPageContext(group.items, targetPath, groupBase, group, depth + 1)
        if (result.found) {
            return result
        }
    }

    return { found: false }
}

/**
 * 根据查询规则构建显示数据
 * 规则:
 * 1. 顶层 → 无限向下显示所有
 * 2. 同级无子级 → 只显示同级
 * 3. 有父有子 → 从同级无限向下显示所有
 * 4. 最底层无同级 → 空
 */
function buildDisplayData(context, allItems, baseKey) {
    if (!context.found) {
        // 默认：显示全部（顶层行为）
        const rootFiles = allItems.filter(i => i.link).map(i => ({
            text: i.text,
            link: resolveLink(baseKey, i.link),
            icon: getIcon(i.text)
        }))
        const folders = recursivelyBuildStructure(allItems, baseKey)
        return [...rootFiles, ...folders]
    }

    // 规则 1: 顶层 → 无限向下显示所有
    if (context.isTopLevel) {
        const rootFiles = allItems.filter(i => i.link).map(i => ({
            text: i.text,
            link: resolveLink(baseKey, i.link),
            icon: getIcon(i.text)
        }))
        const folders = recursivelyBuildStructure(allItems, baseKey)
        return [...rootFiles, ...folders]
    }

    // 规则 4: 最底层无同级 → 空
    if (!context.hasSiblings) {
        return []
    }

    // 判断同级是否有子级（检查同级分组）
    const siblingsHaveChildren = context.siblingGroups && context.siblingGroups.length > 0

    // 规则 2: 同级无子级 → 只显示同级链接
    if (!siblingsHaveChildren) {
        return context.siblings.map(item => ({
            text: item.text,
            link: item.link,
            icon: item.icon
        }))
    }

    // 规则 3: 有父有子 → 从同级无限向下显示所有
    // 显示同级链接 + 同级分组的完整递归结构
    const siblingFiles = context.siblings.map(item => ({
        text: item.text,
        link: item.link,
        icon: item.icon
    }))

    const siblingFolders = recursivelyBuildStructure(context.siblingGroups, context.parentBase)

    return [...siblingFiles, ...siblingFolders]
}

const tocData = computed(() => {
    const sidebar = theme.value.sidebar
    if (!sidebar) return []

    const group = findSidebarGroup(sidebar, currentPath.value)
    if (!group) return []

    // 查找当前页面在侧边栏中的位置
    const context = findCurrentPageContext(group.items, currentPath.value, group.key)

    // 根据规则构建显示数据
    return buildDisplayData(context, group.items, group.key)
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