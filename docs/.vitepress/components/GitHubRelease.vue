<script setup>
import { ref, onMounted, computed, watch } from 'vue'

const props = defineProps({
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    prerelease: { type: Boolean, default: false },
    mode: { type: String, default: 'badge' },
    showDownloads: { type: Boolean, default: true },
    showVersion: { type: Boolean, default: true },
    tagLabel: { type: String, default: '' },
    label: { type: String, default: '下载' },
    arch: { type: String, default: '' },
    match: { type: String, default: '' },
    labelColor: { type: String, default: '' },
    archColor: { type: String, default: '' },
    gradient: { type: Boolean, default: true },
    // 新增 props
    showToggle: { type: Boolean, default: false },      // 显示版本切换开关
    showBothVersions: { type: Boolean, default: false }, // 同时显示两个版本的徽章
})

// SVG 图标组件
const icons = {
    tag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
    flask: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l4 9H5l4-9V3z"/><path d="M9 3h6"/><circle cx="12" cy="16" r="1.5"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/></svg>`,
    folder: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    package: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
    arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    edit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
    hardDrive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="12" x2="2" y2="12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    refresh: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`,
    clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    home: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    list: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    key: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
    externalLink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
}

// 预定义渐变色
const gradientPresets = [
    ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
    ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#30cfd0', '#330867'],
    ['#a8edea', '#fed6e3'], ['#5ee7df', '#b490ca'], ['#d299c2', '#fef9d7'],
    ['#89f7fe', '#66a6ff'], ['#cd9cf2', '#f6f3ff'], ['#ffecd2', '#fcb69f'],
    ['#a1c4fd', '#c2e9fb'], ['#d4fc79', '#96e6a1'], ['#84fab0', '#8fd3f4'],
    ['#a6c0fe', '#f68084'], ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'],
    ['#ff9a9e', '#fecfef'], ['#a18cd1', '#fbc2eb'], ['#f6d365', '#fda085'],
    ['#96fbc4', '#f9f586'], ['#37ecba', '#72afd3'],
]

// 详情区域的颜色配置
const detailColors = [
    { bg: '#f0f7ff', border: '#c6deff' },
    { bg: '#f0fdf4', border: '#bbf7d0' },
    { bg: '#fefce8', border: '#fef08a' },
    { bg: '#fdf2f8', border: '#fbcfe8' },
    { bg: '#f5f3ff', border: '#ddd6fe' },
    { bg: '#fff7ed', border: '#fed7aa' },
]

const hashString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash = hash & hash
    }
    return Math.abs(hash)
}

const getGradient = computed(() => {
    const uniqueKey = `${props.label}-${props.arch}-${props.match}`
    const preset = gradientPresets[hashString(uniqueKey) % gradientPresets.length]
    return `linear-gradient(135deg, ${preset[0]} 0%, ${preset[1]} 100%)`
})

// 状态
const loading = ref(true)
const error = ref(null)
const showModal = ref(false)
const selectedAsset = ref(null)
const showFileList = ref(false)
const savedScrollPosition = ref(0)

// 版本切换相关
const isPrerelease = ref(props.prerelease)
const stableRelease = ref(null)
const prereleaseRelease = ref(null)
const allReleases = ref([])

// 当前活动的 release（根据切换状态）
const release = computed(() => {
    if (props.showBothVersions) {
        return isPrerelease.value ? prereleaseRelease.value : stableRelease.value
    }
    return isPrerelease.value ? prereleaseRelease.value : stableRelease.value
})

// 计算下载数和匹配文件
const totalDownloads = computed(() => {
    if (!release.value?.assets) return 0
    return release.value.assets.reduce((sum, asset) => sum + (asset.download_count || 0), 0)
})

const matchedAssets = computed(() => {
    if (!release.value?.assets || !props.match) return []
    return release.value.assets.filter(a => isMatch(a.name))
})

// Stable 版本的数据
const stableTotalDownloads = computed(() => {
    if (!stableRelease.value?.assets) return 0
    return stableRelease.value.assets.reduce((sum, asset) => sum + (asset.download_count || 0), 0)
})

const stableMatchedAssets = computed(() => {
    if (!stableRelease.value?.assets || !props.match) return []
    return stableRelease.value.assets.filter(a => isMatch(a.name))
})

// Pre-release 版本的数据
const prereleaseTotalDownloads = computed(() => {
    if (!prereleaseRelease.value?.assets) return 0
    return prereleaseRelease.value.assets.reduce((sum, asset) => sum + (asset.download_count || 0), 0)
})

const prereleaseMatchedAssets = computed(() => {
    if (!prereleaseRelease.value?.assets || !props.match) return []
    return prereleaseRelease.value.assets.filter(a => isMatch(a.name))
})

// 是否有预发布版本
const hasPrereleaseVersion = computed(() => prereleaseRelease.value !== null)
const hasStableVersion = computed(() => stableRelease.value !== null)

// 格式化下载数
const formatDownloads = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
}

// 格式化文件大小
const formatSize = (bytes) => {
    if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
    if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return bytes + ' B'
}

// 格式化时间
const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleString('zh-CN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    })
}

// 解析 match 参数
const parseMatch = (matchStr) => {
    if (!matchStr) return null
    const regexMatch = matchStr.match(/^\/(.+)\/([gimsuy]*)$/)
    if (regexMatch) {
        try {
            return new RegExp(regexMatch[1], regexMatch[2])
        } catch (e) {
            console.error('Invalid regex:', e)
            return null
        }
    }
    return matchStr
}

// 检查文件名是否匹配
const isMatch = (assetName) => {
    const matcher = parseMatch(props.match)
    if (!matcher) return false
    if (matcher instanceof RegExp) {
        return matcher.test(assetName)
    }
    const keywords = matcher.toLowerCase().split('|').map(k => k.trim())
    const name = assetName.toLowerCase()
    return keywords.every(keyword => name.includes(keyword))
}

// 获取 Release 信息（增强版）
const fetchRelease = async () => {
    try {
        loading.value = true
        error.value = null

        const res = await fetch(
            `https://api.github.com/repos/${props.owner}/${props.repo}/releases`,
            { headers: { 'Accept': 'application/vnd.github.v3+json' } }
        )

        if (!res.ok) {
            if (res.status === 404) throw new Error('仓库不存在')
            if (res.status === 403) throw new Error('请求超限')
            throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        allReleases.value = data

        stableRelease.value = data.find(r => !r.prerelease && !r.draft) || null
        prereleaseRelease.value = data.find(r => r.prerelease && !r.draft) || null

        if (!prereleaseRelease.value) {
            const possiblePrerelease = data.find(r => 
                !r.draft && /alpha|beta|rc|preview|dev|nightly|canary/i.test(r.tag_name)
            )
            if (possiblePrerelease && possiblePrerelease !== stableRelease.value) {
                prereleaseRelease.value = possiblePrerelease
            }
        }

        if (props.prerelease && prereleaseRelease.value) {
            isPrerelease.value = true
        } else if (!props.prerelease && stableRelease.value) {
            isPrerelease.value = false
        } else {
            isPrerelease.value = !stableRelease.value && !!prereleaseRelease.value
        }

    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

// 切换版本
const toggleVersion = () => {
    if (isPrerelease.value && hasStableVersion.value) {
        isPrerelease.value = false
    } else if (!isPrerelease.value && hasPrereleaseVersion.value) {
        isPrerelease.value = true
    }
}

// 计算属性
const computedTagLabel = computed(() => {
    if (props.tagLabel) return props.tagLabel
    return isPrerelease.value ? '@pre-release' : '@latest'
})

const tagBgColor = computed(() => isPrerelease.value ? '#e6a23c' : '#67c23a')
const version = computed(() => release.value?.tag_name || 'N/A')
const releaseUrl = computed(() => release.value?.html_url || `https://github.com/${props.owner}/${props.repo}/releases`)
const btnLabelColor = computed(() => props.labelColor || '#555')

const archBgStyle = computed(() => {
    if (props.archColor) return { backgroundColor: props.archColor }
    if (props.gradient) return { background: getGradient.value }
    return { backgroundColor: '#67c23a' }
})

const showBadge = computed(() => props.mode === 'badge' || props.mode === 'all')
const showButton = computed(() => (props.mode === 'button' || props.mode === 'all') && props.match)
const hasMultipleFiles = computed(() => matchedAssets.value.length > 1)
const firstAsset = computed(() => matchedAssets.value[0] || null)

// 项目相关链接
const projectUrl = computed(() => `https://github.com/${props.owner}/${props.repo}`)
const releasesUrl = computed(() => `https://github.com/${props.owner}/${props.repo}/releases`)
const latestUrl = computed(() => `https://github.com/${props.owner}/${props.repo}/releases/latest`)

// Stable 版本相关计算属性
const stableVersion = computed(() => stableRelease.value?.tag_name || 'N/A')
const stableReleaseUrl = computed(() => stableRelease.value?.html_url || releasesUrl.value)
const stableHasMultipleFiles = computed(() => stableMatchedAssets.value.length > 1)
const stableFirstAsset = computed(() => stableMatchedAssets.value[0] || null)

// Pre-release 版本相关计算属性
const prereleaseVersion = computed(() => prereleaseRelease.value?.tag_name || 'N/A')
const prereleaseReleaseUrl = computed(() => prereleaseRelease.value?.html_url || releasesUrl.value)
const prereleaseHasMultipleFiles = computed(() => prereleaseMatchedAssets.value.length > 1)
const prereleaseFirstAsset = computed(() => prereleaseMatchedAssets.value[0] || null)

// 弹窗当前选中的版本类型
const modalIsPrerelease = ref(false)
const modalRelease = computed(() => modalIsPrerelease.value ? prereleaseRelease.value : stableRelease.value)
const modalMatchedAssets = computed(() => modalIsPrerelease.value ? prereleaseMatchedAssets.value : stableMatchedAssets.value)

// 监听弹窗状态
watch(showModal, (val) => {
    if (val) {
        savedScrollPosition.value = window.scrollY
        document.body.style.overflow = 'hidden'
        document.body.style.position = 'fixed'
        document.body.style.top = `-${savedScrollPosition.value}px`
        document.body.style.width = '100%'
    } else {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, savedScrollPosition.value)
    }
})

// 点击按钮（普通模式）
const handleButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading.value || error.value || matchedAssets.value.length === 0) return

    modalIsPrerelease.value = isPrerelease.value
    
    if (hasMultipleFiles.value) {
        showFileList.value = true
        showModal.value = true
        selectedAsset.value = null
    } else {
        selectedAsset.value = firstAsset.value
        showFileList.value = false
        showModal.value = true
    }
}

// 点击按钮（指定版本类型）
const handleVersionButtonClick = (e, isPre) => {
    e.preventDefault()
    e.stopPropagation()
    
    const targetRelease = isPre ? prereleaseRelease.value : stableRelease.value
    const targetAssets = isPre ? prereleaseMatchedAssets.value : stableMatchedAssets.value
    
    if (loading.value || error.value || targetAssets.length === 0) return

    modalIsPrerelease.value = isPre
    
    if (targetAssets.length > 1) {
        showFileList.value = true
        showModal.value = true
        selectedAsset.value = null
    } else {
        selectedAsset.value = targetAssets[0]
        showFileList.value = false
        showModal.value = true
    }
}

// 选择文件
const selectFile = (asset) => {
    selectedAsset.value = asset
    showFileList.value = false
}

// 返回列表
const backToList = () => {
    showFileList.value = true
    selectedAsset.value = null
}

// 关闭弹窗
const closeModal = () => {
    showModal.value = false
    selectedAsset.value = null
    showFileList.value = false
}

// 复制到剪贴板
const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        alert('已复制到剪贴板')
    } catch (e) {
        const input = document.createElement('input')
        input.value = text
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
        alert('已复制到剪贴板')
    }
}

// 转义正则特殊字符
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// 获取 SHA256
const getSHA256 = (assetName) => {
    const targetRelease = modalRelease.value
    if (!targetRelease?.body) return null
    const body = targetRelease.body
    const patterns = [
        new RegExp(`${escapeRegex(assetName)}[\\s\\S]*?([a-f0-9]{64})`, 'i'),
        new RegExp(`([a-f0-9]{64})[\\s\\S]*?${escapeRegex(assetName)}`, 'i'),
        new RegExp(`\\|\\s*${escapeRegex(assetName)}\\s*\\|\\s*([a-f0-9]{64})`, 'i'),
        new RegExp(`${escapeRegex(assetName)}\\s*[:\\|]\\s*([a-f0-9]{64})`, 'i'),
    ]
    for (const pattern of patterns) {
        const match = body.match(pattern)
        if (match) return match[1]
    }
    return null
}

// 获取行颜色
const getRowColor = (index) => {
    return detailColors[index % detailColors.length]
}

onMounted(fetchRelease)
</script>

<template>
    <span class="gh-release">
        <!-- 版本切换开关 -->
        <span v-if="showToggle && !loading && !error && (hasStableVersion || hasPrereleaseVersion)" class="gh-version-toggle">
            <button 
                :class="['gh-toggle-btn', { active: !isPrerelease, disabled: !hasStableVersion }]"
                @click="hasStableVersion && (isPrerelease = false)"
                :disabled="!hasStableVersion"
            >
                <span class="gh-toggle-icon" v-html="icons.tag"></span>
                <span class="gh-toggle-text">Stable</span>
            </button>
            <button 
                :class="['gh-toggle-btn', 'gh-toggle-pre', { active: isPrerelease, disabled: !hasPrereleaseVersion }]"
                @click="hasPrereleaseVersion && (isPrerelease = true)"
                :disabled="!hasPrereleaseVersion"
            >
                <span class="gh-toggle-icon" v-html="icons.flask"></span>
                <span class="gh-toggle-text">Pre-release</span>
            </button>
        </span>

        <!-- ========== 同时显示两个版本模式 ========== -->
        <template v-if="showBothVersions">
            <!-- Stable 徽章组 -->
            <span v-if="hasStableVersion" class="gh-version-group gh-stable-group">
                <span class="gh-version-label">
                    <span class="gh-label-icon" v-html="icons.tag"></span>
                    <span>Stable</span>
                </span>
                <template v-if="showBadge">
                    <a v-if="showDownloads" :href="stableReleaseUrl" target="_blank" class="gh-badge-link"
                        :title="`Stable 总下载: ${stableTotalDownloads}`">
                        <span class="gh-badge">
                            <span class="gh-badge-label gh-stable-label">@latest</span>
                            <span class="gh-badge-value gh-badge-count">
                                <template v-if="loading">···</template>
                                <template v-else-if="error">err</template>
                                <template v-else>{{ formatDownloads(stableTotalDownloads) }}</template>
                            </span>
                        </span>
                    </a>
                    <a v-if="showVersion" :href="stableReleaseUrl" target="_blank" class="gh-badge-link" 
                        :title="`Stable 版本: ${stableVersion}`">
                        <span class="gh-badge">
                            <span class="gh-badge-label gh-release-label">release</span>
                            <span class="gh-badge-value gh-version-value">
                                <template v-if="loading">···</template>
                                <template v-else-if="error">err</template>
                                <template v-else>{{ stableVersion }}</template>
                            </span>
                        </span>
                    </a>
                </template>
                <button v-if="showButton && stableMatchedAssets.length > 0" type="button"
                    :class="['gh-dl-btn', { disabled: loading || error }]"
                    :title="stableFirstAsset?.name || ''" @click="handleVersionButtonClick($event, false)">
                    <span class="gh-dl-label" :style="{ backgroundColor: btnLabelColor }">{{ label }}</span>
                    <span class="gh-dl-arch" :style="loading ? { backgroundColor: '#999' } : archBgStyle">
                        <template v-if="loading">···</template>
                        <template v-else>
                            {{ arch }}
                            <span v-if="stableHasMultipleFiles" class="gh-multi-badge">{{ stableMatchedAssets.length }}</span>
                        </template>
                    </span>
                </button>
            </span>

            <!-- Pre-release 徽章组 -->
            <span v-if="hasPrereleaseVersion" class="gh-version-group gh-prerelease-group">
                <span class="gh-version-label gh-pre-label">
                    <span class="gh-label-icon" v-html="icons.flask"></span>
                    <span>Pre-release</span>
                </span>
                <template v-if="showBadge">
                    <a v-if="showDownloads" :href="prereleaseReleaseUrl" target="_blank" class="gh-badge-link"
                        :title="`Pre-release 总下载: ${prereleaseTotalDownloads}`">
                        <span class="gh-badge gh-prerelease-badge">
                            <span class="gh-badge-label gh-prerelease-label">@pre-release</span>
                            <span class="gh-badge-value gh-badge-count">
                                <template v-if="loading">···</template>
                                <template v-else-if="error">err</template>
                                <template v-else>{{ formatDownloads(prereleaseTotalDownloads) }}</template>
                            </span>
                        </span>
                    </a>
                    <a v-if="showVersion" :href="prereleaseReleaseUrl" target="_blank" class="gh-badge-link"
                        :title="`Pre-release 版本: ${prereleaseVersion}`">
                        <span class="gh-badge gh-prerelease-badge">
                            <span class="gh-badge-label gh-release-label gh-pre-release-label">release</span>
                            <span class="gh-badge-value gh-version-value">
                                <template v-if="loading">···</template>
                                <template v-else-if="error">err</template>
                                <template v-else>{{ prereleaseVersion }}</template>
                            </span>
                        </span>
                    </a>
                </template>
                <button v-if="showButton && prereleaseMatchedAssets.length > 0" type="button"
                    :class="['gh-dl-btn', 'gh-dl-btn-pre', { disabled: loading || error }]"
                    :title="prereleaseFirstAsset?.name || ''" @click="handleVersionButtonClick($event, true)">
                    <span class="gh-dl-label gh-dl-label-pre" :style="{ backgroundColor: '#d97706' }">
                        {{ label }}
                        <span class="gh-btn-pre-tag">
                            <span class="gh-btn-pre-icon" v-html="icons.flask"></span>
                        </span>
                    </span>
                    <span class="gh-dl-arch" :style="loading ? { backgroundColor: '#999' } : { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }">
                        <template v-if="loading">···</template>
                        <template v-else>
                            {{ arch }}
                            <span v-if="prereleaseHasMultipleFiles" class="gh-multi-badge">{{ prereleaseMatchedAssets.length }}</span>
                        </template>
                    </span>
                </button>
            </span>
        </template>

        <!-- ========== 普通模式（单版本显示） ========== -->
        <template v-else>
            <!-- 徽章模式 -->
            <template v-if="showBadge">
                <a v-if="showDownloads" :href="releaseUrl" target="_blank" class="gh-badge-link"
                    :title="`总下载: ${totalDownloads}`">
                    <span :class="['gh-badge', { 'gh-prerelease-badge': isPrerelease }]">
                        <span class="gh-badge-label" :style="{ backgroundColor: tagBgColor }">{{ computedTagLabel }}</span>
                        <span class="gh-badge-value gh-badge-count">
                            <template v-if="loading">···</template>
                            <template v-else-if="error">err</template>
                            <template v-else>{{ formatDownloads(totalDownloads) }}</template>
                        </span>
                    </span>
                </a>
                <a v-if="showVersion" :href="releaseUrl" target="_blank" class="gh-badge-link" :title="`版本: ${version}`">
                    <span :class="['gh-badge', { 'gh-prerelease-badge': isPrerelease }]">
                        <span :class="['gh-badge-label', 'gh-release-label', { 'gh-pre-release-label': isPrerelease }]">release</span>
                        <span class="gh-badge-value gh-version-value">
                            <template v-if="loading">···</template>
                            <template v-else-if="error">err</template>
                            <template v-else>{{ version }}</template>
                        </span>
                    </span>
                </a>
            </template>

            <!-- 下载按钮 -->
            <button v-if="showButton" type="button"
                :class="['gh-dl-btn', { disabled: loading || error || matchedAssets.length === 0, 'gh-dl-btn-pre': isPrerelease }]"
                :title="firstAsset?.name || error || '加载中...'" @click="handleButtonClick">
                <span class="gh-dl-label" :style="{ backgroundColor: isPrerelease ? '#d97706' : btnLabelColor }">
                    {{ label }}
                    <!-- Pre-release 标识移到按钮内部 -->
                    <span v-if="isPrerelease && !loading && !error" class="gh-btn-pre-tag">
                        <span class="gh-btn-pre-icon" v-html="icons.flask"></span>
                    </span>
                </span>
                <span class="gh-dl-arch"
                    :style="loading ? { backgroundColor: '#999' } : (error || matchedAssets.length === 0 ? { backgroundColor: '#f56c6c' } : (isPrerelease ? { background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' } : archBgStyle))">
                    <template v-if="loading">···</template>
                    <template v-else-if="error || matchedAssets.length === 0">错误</template>
                    <template v-else>
                        {{ arch }}
                        <span v-if="hasMultipleFiles" class="gh-multi-badge">{{ matchedAssets.length }}</span>
                    </template>
                </span>
            </button>
        </template>

        <!-- 弹窗 -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showModal" class="gh-modal-overlay" @click.self="closeModal">
                    <div class="gh-modal">
                        <!-- 弹窗头部 -->
                        <div :class="['gh-modal-header', { 'gh-modal-header-pre': modalIsPrerelease }]">
                            <div class="gh-modal-title">
                                <span class="gh-modal-title-icon" v-html="showFileList ? icons.folder : icons.file"></span>
                                <span v-if="showFileList">选择文件 ({{ modalMatchedAssets.length }})</span>
                                <span v-else>文件详情</span>
                                <!-- Pre-release 标记 -->
                                <span v-if="modalIsPrerelease" class="gh-modal-pre-tag">
                                    <span class="gh-modal-pre-icon" v-html="icons.flask"></span>
                                    Pre-release
                                </span>
                            </div>
                            <button class="gh-modal-close" @click="closeModal">
                                <span v-html="icons.close"></span>
                            </button>
                        </div>

                        <!-- 版本信息条 -->
                        <div :class="['gh-version-bar', { 'gh-version-bar-pre': modalIsPrerelease }]">
                            <span class="gh-version-bar-icon" v-html="modalIsPrerelease ? icons.flask : icons.tag"></span>
                            <span class="gh-version-bar-text">
                                {{ modalRelease?.name || modalRelease?.tag_name || 'Unknown' }}
                            </span>
                            <span class="gh-version-bar-tag">{{ modalRelease?.tag_name }}</span>
                        </div>

                        <!-- 文件列表 -->
                        <div v-if="showFileList" class="gh-modal-body">
                            <div class="gh-file-list">
                                <div v-for="asset in modalMatchedAssets" :key="asset.id" class="gh-file-item"
                                    @click="selectFile(asset)">
                                    <div class="gh-file-icon" v-html="icons.package"></div>
                                    <div class="gh-file-info">
                                        <div class="gh-file-name">{{ asset.name }}</div>
                                        <div class="gh-file-meta">
                                            <span>{{ formatSize(asset.size) }}</span>
                                            <span>·</span>
                                            <span>{{ formatDownloads(asset.download_count) }} 次下载</span>
                                        </div>
                                    </div>
                                    <div class="gh-file-arrow" v-html="icons.arrowRight"></div>
                                </div>
                            </div>
                        </div>

                        <!-- 文件详情 -->
                        <div v-else-if="selectedAsset" class="gh-modal-body">
                            <div v-if="modalMatchedAssets.length > 1" class="gh-back-btn" @click="backToList">
                                <span class="gh-back-icon" v-html="icons.arrowLeft"></span>
                                返回列表
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">
                                    <span class="gh-detail-title-icon" v-html="icons.package"></span>
                                    文件信息
                                </div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.edit"></span>
                                            文件名
                                        </div>
                                        <div class="gh-detail-value gh-copyable"
                                            @click="copyToClipboard(selectedAsset.name)">
                                            {{ selectedAsset.name }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.hardDrive"></span>
                                            文件大小
                                        </div>
                                        <div class="gh-detail-value">{{ formatSize(selectedAsset.size) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.download"></span>
                                            下载次数
                                        </div>
                                        <div class="gh-detail-value">{{ selectedAsset.download_count.toLocaleString() }} 次</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.upload"></span>
                                            上传时间
                                        </div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.created_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(4).bg, borderColor: getRowColor(4).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.refresh"></span>
                                            更新时间
                                        </div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.updated_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(5).bg, borderColor: getRowColor(5).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.clipboard"></span>
                                            Content-Type
                                        </div>
                                        <div class="gh-detail-value">{{ selectedAsset.content_type }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">
                                    <span class="gh-detail-title-icon" v-html="icons.link"></span>
                                    相关链接
                                </div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.download"></span>
                                            下载地址
                                        </div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(selectedAsset.browser_download_url)">
                                            {{ selectedAsset.browser_download_url }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.home"></span>
                                            项目地址
                                        </div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(projectUrl)">
                                            {{ projectUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.list"></span>
                                            发布列表
                                        </div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(releasesUrl)">
                                            {{ releasesUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.star"></span>
                                            最新发布
                                        </div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(latestUrl)">
                                            {{ latestUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">
                                    <span class="gh-detail-title-icon" v-html="icons.shield"></span>
                                    校验信息
                                </div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.key"></span>
                                            SHA256
                                        </div>
                                        <div v-if="getSHA256(selectedAsset.name)" class="gh-detail-value gh-copyable gh-hash"
                                            @click="copyToClipboard(getSHA256(selectedAsset.name))">
                                            {{ getSHA256(selectedAsset.name) }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                        <div v-else class="gh-detail-value gh-na">未提供</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 弹窗底部 -->
                        <div :class="['gh-modal-footer', { 'gh-modal-footer-pre': modalIsPrerelease }]">
                            <a v-if="selectedAsset" :href="selectedAsset.browser_download_url" 
                               :class="['gh-download-btn', { 'gh-download-btn-pre': modalIsPrerelease }]" 
                               target="_blank">
                                <span class="gh-download-icon" v-html="icons.download"></span>
                                <span>下载文件</span>
                            </a>
                            <a :href="modalRelease?.html_url || releaseUrl" class="gh-github-btn" target="_blank">
                                <span class="gh-github-icon" v-html="icons.externalLink"></span>
                                在 GitHub 查看
                            </a>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </span>
</template>

<style scoped>
.gh-release {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    flex-wrap: wrap;
    line-height: 1.8;
}

/* ========== SVG 图标通用样式 ========== */
.gh-release :deep(svg) {
    width: 1em;
    height: 1em;
    vertical-align: middle;
    flex-shrink: 0;
}

/* ========== 版本切换开关 ========== */
.gh-version-toggle {
    display: inline-flex;
    background: var(--vp-c-bg-soft, #f1f5f9);
    border-radius: 8px;
    padding: 3px;
    gap: 2px;
    margin-right: 8px;
}

.gh-toggle-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    color: var(--vp-c-text-2, #64748b);
    transition: all 0.2s;
}

.gh-toggle-btn:hover:not(.disabled) {
    background: var(--vp-c-bg-mute, #e2e8f0);
}

.gh-toggle-btn.active {
    background: #fff;
    color: var(--vp-c-text-1, #1a202c);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.gh-toggle-btn.active.gh-toggle-pre {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    color: #92400e;
}

.gh-toggle-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.gh-toggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.gh-toggle-icon :deep(svg) {
    width: 14px;
    height: 14px;
}

.gh-toggle-text {
    font-size: 11px;
}

/* ========== 版本组（同时显示模式） ========== */
.gh-version-group {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    background: var(--vp-c-bg-soft, #f8fafc);
    border-radius: 8px;
    margin-right: 8px;
}

.gh-prerelease-group {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.gh-version-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: var(--vp-c-text-2, #64748b);
    padding-right: 6px;
    border-right: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-pre-label {
    color: #d97706;
}

.gh-label-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.gh-label-icon :deep(svg) {
    width: 14px;
    height: 14px;
}

/* ========== 徽章样式 ========== */
.gh-badge-link {
    text-decoration: none;
}

.gh-badge {
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    font-size: 12px;
    line-height: 1;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    vertical-align: middle;
}

.gh-badge-label {
    padding: 4px 6px;
    color: #fff;
    font-weight: 500;
}

.gh-badge-value {
    padding: 4px 6px;
    background: #f1f5f9;
    color: #475569;
    font-weight: 500;
}

.gh-stable-label {
    background: #67c23a;
}

.gh-prerelease-label {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.gh-release-label {
    background: #409eff;
}

.gh-pre-release-label {
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.gh-prerelease-badge {
    box-shadow: 0 1px 3px rgba(245, 158, 11, 0.3);
}

/* ========== 下载按钮 ========== */
.gh-dl-btn {
    display: inline-flex;
    border-radius: 0.25em;
    overflow: visible;
    font-size: inherit;
    line-height: 1;
    cursor: pointer;
    border: none;
    padding: 0;
    margin: 0.2em 0.4em 0.2em 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    vertical-align: middle;
    position: relative;
}

.gh-dl-btn:hover:not(.disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.gh-dl-btn.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.gh-dl-btn-pre {
    box-shadow: 0 1px 3px rgba(217, 119, 6, 0.3);
}

.gh-dl-label {
    padding: 0.35em 0.6em;
    color: #fff;
    font-weight: 500;
    position: relative;
    border-radius: 0.25em 0 0 0.25em;
    display: inline-flex;
    align-items: center;
    gap: 0.25em;
}

/* Pre-release 标签样式 - 移到按钮内部 */
.gh-btn-pre-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 0.2em;
    padding: 0.1em 0.2em;
    margin-left: 0.15em;
}

.gh-btn-pre-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 0.9em;
    height: 0.9em;
}

.gh-btn-pre-icon :deep(svg) {
    width: 0.9em;
    height: 0.9em;
    color: #fff;
}

.gh-dl-arch {
    padding: 0.35em 0.6em;
    color: #fff;
    font-weight: 500;
    position: relative;
    border-radius: 0 0.25em 0.25em 0;
}

.gh-multi-badge {
    position: absolute;
    top: -0.4em;
    right: -0.4em;
    background: #ef4444;
    color: #fff;
    font-size: 0.7em;
    font-weight: 600;
    padding: 0.15em 0.35em;
    border-radius: 0.7em;
    line-height: 1;
    min-width: 1.2em;
    text-align: center;
    box-shadow: 0 1px 3px rgba(239, 68, 68, 0.4);
    z-index: 1;
}

/* ========== 弹窗样式 ========== */
.gh-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);
}

.gh-modal {
    background: var(--vp-c-bg, #fff);
    border-radius: 16px;
    width: 100%;
    max-width: 500px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.gh-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
    background: var(--vp-c-bg-soft, #f8fafc);
}

.gh-modal-header-pre {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-bottom-color: #fde68a;
}

.gh-modal-title {
    font-weight: 600;
    font-size: 16px;
    color: var(--vp-c-text-1, #1a202c);
    display: flex;
    align-items: center;
    gap: 8px;
}

.gh-modal-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--vp-c-text-2, #64748b);
}

.gh-modal-title-icon :deep(svg) {
    width: 20px;
    height: 20px;
}

.gh-modal-pre-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #92400e;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 3px 8px;
    border-radius: 12px;
    border: 1px solid #fcd34d;
}

.gh-modal-pre-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
}

.gh-modal-pre-icon :deep(svg) {
    width: 12px;
    height: 12px;
}

.gh-modal-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--vp-c-text-2, #64748b);
    transition: all 0.2s;
}

.gh-modal-close :deep(svg) {
    width: 16px;
    height: 16px;
}

.gh-modal-close:hover {
    background: var(--vp-c-bg-mute, #e2e8f0);
    color: var(--vp-c-text-1, #1a202c);
}

/* ========== 版本信息条 ========== */
.gh-version-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-bottom: 1px solid #bbf7d0;
    font-size: 13px;
}

.gh-version-bar-pre {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-bottom-color: #fde68a;
}

.gh-version-bar-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: #166534;
}

.gh-version-bar-pre .gh-version-bar-icon {
    color: #92400e;
}

.gh-version-bar-icon :deep(svg) {
    width: 16px;
    height: 16px;
}

.gh-version-bar-text {
    flex: 1;
    font-weight: 500;
    color: var(--vp-c-text-1, #1a202c);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.gh-version-bar-tag {
    font-size: 11px;
    font-weight: 600;
    color: #166534;
    background: rgba(22, 163, 74, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
}

.gh-version-bar-pre .gh-version-bar-tag {
    color: #92400e;
    background: rgba(217, 119, 6, 0.1);
}

.gh-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
}

/* ========== 文件列表 ========== */
.gh-file-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.gh-file-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: var(--vp-c-bg-soft, #f8fafc);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.gh-file-item:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    border-color: var(--vp-c-brand, #3b82f6);
}

.gh-file-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    color: var(--vp-c-text-2, #64748b);
}

.gh-file-icon :deep(svg) {
    width: 20px;
    height: 20px;
}

.gh-file-info {
    flex: 1;
    min-width: 0;
}

.gh-file-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--vp-c-text-1, #1a202c);
    word-break: break-word;
    overflow-wrap: break-word;
    line-height: 1.4;
}

.gh-file-meta {
    font-size: 11px;
    color: var(--vp-c-text-3, #94a3b8);
    margin-top: 2px;
    display: flex;
    gap: 4px;
}

.gh-file-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--vp-c-text-3, #94a3b8);
}

.gh-file-arrow :deep(svg) {
    width: 16px;
    height: 16px;
}

/* ========== 返回按钮 ========== */
.gh-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    margin-bottom: 12px;
    background: var(--vp-c-bg-soft, #f8fafc);
    border-radius: 6px;
    font-size: 12px;
    color: var(--vp-c-text-2, #64748b);
    cursor: pointer;
    transition: all 0.2s;
}

.gh-back-btn:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    color: var(--vp-c-brand, #3b82f6);
}

.gh-back-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.gh-back-icon :deep(svg) {
    width: 14px;
    height: 14px;
}

/* ========== 详情区域 ========== */
.gh-detail-section {
    margin-bottom: 16px;
}

.gh-detail-section:last-child {
    margin-bottom: 0;
}

.gh-detail-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1, #1a202c);
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-detail-title-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    color: var(--vp-c-text-2, #64748b);
}

.gh-detail-title-icon :deep(svg) {
    width: 16px;
    height: 16px;
}

.gh-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
}

.gh-detail-item {
    background: var(--vp-c-bg-soft, #f8fafc);
    padding: 8px 10px;
    border-radius: 6px;
    border: 1px solid transparent;
}

.gh-detail-full {
    grid-column: span 2;
}

.gh-detail-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: var(--vp-c-text-3, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 2px;
}

.gh-detail-label-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
}

.gh-detail-label-icon :deep(svg) {
    width: 12px;
    height: 12px;
}

.gh-detail-value {
    font-size: 12px;
    color: var(--vp-c-text-1, #1a202c);
    word-break: break-all;
    line-height: 1.4;
}

.gh-copyable {
    cursor: pointer;
    position: relative;
    padding-right: 50px;
    transition: background 0.2s;
    border-radius: 4px;
}

.gh-copyable:hover {
    background: rgba(0, 0, 0, 0.05);
}

.gh-copy-hint {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 9px;
    color: var(--vp-c-brand, #3b82f6);
    opacity: 0;
    transition: opacity 0.2s;
}

.gh-copyable:hover .gh-copy-hint {
    opacity: 1;
}

.gh-url {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
}

.gh-hash {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 10px;
}

.gh-na {
    color: var(--vp-c-text-3, #94a3b8);
    font-style: italic;
}

/* ========== 弹窗底部 ========== */
.gh-modal-footer {
    display: flex;
    gap: 10px;
    padding: 14px 20px;
    border-top: 1px solid var(--vp-c-divider, #e2e8f0);
    background: var(--vp-c-bg-soft, #f8fafc);
}

.gh-modal-footer-pre {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border-top-color: #fde68a;
}

.gh-download-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 16px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    font-weight: 600;
    font-size: 13px;
    border-radius: 8px;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.gh-download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.gh-download-btn-pre {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    box-shadow: 0 4px 14px rgba(217, 119, 6, 0.4);
}

.gh-download-btn-pre:hover {
    box-shadow: 0 6px 20px rgba(217, 119, 6, 0.5);
}

.gh-download-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
}

.gh-download-icon :deep(svg) {
    width: 16px;
    height: 16px;
}

.gh-github-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 16px;
    background: var(--vp-c-bg, #fff);
    color: var(--vp-c-text-1, #1a202c);
    font-weight: 500;
    font-size: 13px;
    border-radius: 8px;
    text-decoration: none;
    border: 1px solid var(--vp-c-divider, #e2e8f0);
    transition: all 0.2s;
}

.gh-github-btn:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    border-color: var(--vp-c-brand, #3b82f6);
}

.gh-github-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 14px;
    height: 14px;
}

.gh-github-icon :deep(svg) {
    width: 14px;
    height: 14px;
}

/* ========== 动画 ========== */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.25s ease;
}

.modal-enter-active .gh-modal,
.modal-leave-active .gh-modal {
    transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .gh-modal,
.modal-leave-to .gh-modal {
    transform: scale(0.95) translateY(10px);
}

/* ========== 深色模式 ========== */
.dark .gh-badge,
.dark .gh-dl-btn {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .gh-modal-overlay {
    background: rgba(0, 0, 0, 0.7);
}

.dark .gh-detail-item {
    background: var(--vp-c-bg-soft, #1e293b) !important;
    border-color: var(--vp-c-divider, #334155) !important;
}

.dark .gh-version-toggle {
    background: var(--vp-c-bg-mute, #1e293b);
}

.dark .gh-toggle-btn.active {
    background: var(--vp-c-bg, #0f172a);
    color: var(--vp-c-text-1, #f1f5f9);
}

.dark .gh-toggle-btn.active.gh-toggle-pre {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    color: #fef3c7;
}

.dark .gh-version-group {
    background: var(--vp-c-bg-mute, #1e293b);
}

.dark .gh-prerelease-group {
    background: linear-gradient(135deg, #78350f 0%, #451a03 100%);
}

.dark .gh-pre-label {
    color: #fcd34d;
}

.dark .gh-modal-header-pre {
    background: linear-gradient(135deg, #78350f 0%, #451a03 100%);
    border-bottom-color: #92400e;
}

.dark .gh-modal-pre-tag {
    background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
    color: #fef3c7;
    border-color: #b45309;
}

.dark .gh-version-bar {
    background: linear-gradient(135deg, #14532d 0%, #166534 100%);
    border-bottom-color: #16a34a;
}

.dark .gh-version-bar-icon {
    color: #bbf7d0;
}

.dark .gh-version-bar-tag {
    color: #bbf7d0;
    background: rgba(134, 239, 172, 0.1);
}

.dark .gh-version-bar-pre {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    border-bottom-color: #b45309;
}

.dark .gh-version-bar-pre .gh-version-bar-icon {
    color: #fef3c7;
}

.dark .gh-version-bar-pre .gh-version-bar-tag {
    color: #fef3c7;
    background: rgba(253, 224, 71, 0.1);
}

.dark .gh-modal-footer-pre {
    background: linear-gradient(135deg, #78350f 0%, #451a03 100%);
    border-top-color: #92400e;
}

/* ========== 响应式 ========== */
@media (max-width: 640px) {
    .gh-modal {
        max-height: 90vh;
        border-radius: 12px;
    }

    .gh-detail-grid {
        grid-template-columns: 1fr;
    }

    .gh-detail-full {
        grid-column: span 1;
    }

    .gh-modal-footer {
        flex-direction: column;
    }

    .gh-version-toggle {
        flex-wrap: wrap;
    }

    .gh-toggle-text {
        display: none;
    }

    .gh-version-group {
        flex-wrap: wrap;
    }
}
</style>