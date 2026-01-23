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
        // 同时显示模式下，默认返回当前选中的版本
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

        // 始终获取所有 releases 以支持切换功能
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

        // 找到最新的稳定版（非 prerelease 且非 draft）
        stableRelease.value = data.find(r => !r.prerelease && !r.draft) || null

        // 找到最新的预发布版
        prereleaseRelease.value = data.find(r => r.prerelease && !r.draft) || null

        // 如果没有找到预发布版，但有稳定版中包含 alpha/beta/rc 等标记的
        if (!prereleaseRelease.value) {
            const possiblePrerelease = data.find(r => 
                !r.draft && /alpha|beta|rc|preview|dev|nightly|canary/i.test(r.tag_name)
            )
            if (possiblePrerelease && possiblePrerelease !== stableRelease.value) {
                prereleaseRelease.value = possiblePrerelease
            }
        }

        // 设置初始选中状态
        if (props.prerelease && prereleaseRelease.value) {
            isPrerelease.value = true
        } else if (!props.prerelease && stableRelease.value) {
            isPrerelease.value = false
        } else {
            // 回退逻辑：如果指定的版本类型不存在，使用另一个
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
                <span class="gh-toggle-icon">🏷️</span>
                <span class="gh-toggle-text">Stable</span>
            </button>
            <button 
                :class="['gh-toggle-btn', 'gh-toggle-pre', { active: isPrerelease, disabled: !hasPrereleaseVersion }]"
                @click="hasPrereleaseVersion && (isPrerelease = true)"
                :disabled="!hasPrereleaseVersion"
            >
                <span class="gh-toggle-icon">🧪</span>
                <span class="gh-toggle-text">Pre-release</span>
            </button>
        </span>

        <!-- ========== 同时显示两个版本模式 ========== -->
        <template v-if="showBothVersions">
            <!-- Stable 徽章组 -->
            <span v-if="hasStableVersion" class="gh-version-group gh-stable-group">
                <span class="gh-version-label">
                    <span class="gh-label-icon">🏷️</span>
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
                    <span class="gh-label-icon">🧪</span>
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
                    <span class="gh-dl-label gh-dl-label-pre" :style="{ backgroundColor: '#d97706' }">{{ label }}</span>
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
                <!-- Pre-release 标识 -->
                <span v-if="isPrerelease && !loading && !error" class="gh-pre-indicator" title="这是预发布版本">
                    🧪
                </span>
            </template>

            <!-- 下载按钮 -->
            <button v-if="showButton" type="button"
                :class="['gh-dl-btn', { disabled: loading || error || matchedAssets.length === 0, 'gh-dl-btn-pre': isPrerelease }]"
                :title="firstAsset?.name || error || '加载中...'" @click="handleButtonClick">
                <span class="gh-dl-label" :style="{ backgroundColor: isPrerelease ? '#d97706' : btnLabelColor }">
                    {{ label }}
                    <span v-if="isPrerelease" class="gh-btn-pre-tag">β</span>
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
                                <span v-if="showFileList">📁 选择文件 ({{ modalMatchedAssets.length }})</span>
                                <span v-else>📄 文件详情</span>
                                <!-- Pre-release 标记 -->
                                <span v-if="modalIsPrerelease" class="gh-modal-pre-tag">
                                    🧪 Pre-release
                                </span>
                            </div>
                            <button class="gh-modal-close" @click="closeModal">✕</button>
                        </div>

                        <!-- 版本信息条 -->
                        <div :class="['gh-version-bar', { 'gh-version-bar-pre': modalIsPrerelease }]">
                            <span class="gh-version-bar-icon">{{ modalIsPrerelease ? '🧪' : '🏷️' }}</span>
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
                                    <div class="gh-file-icon">📦</div>
                                    <div class="gh-file-info">
                                        <div class="gh-file-name">{{ asset.name }}</div>
                                        <div class="gh-file-meta">
                                            <span>{{ formatSize(asset.size) }}</span>
                                            <span>·</span>
                                            <span>{{ formatDownloads(asset.download_count) }} 次下载</span>
                                        </div>
                                    </div>
                                    <div class="gh-file-arrow">→</div>
                                </div>
                            </div>
                        </div>

                        <!-- 文件详情 -->
                        <div v-else-if="selectedAsset" class="gh-modal-body">
                            <div v-if="modalMatchedAssets.length > 1" class="gh-back-btn" @click="backToList">
                                ← 返回列表
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">📦 文件信息</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">📝 文件名</div>
                                        <div class="gh-detail-value gh-copyable"
                                            @click="copyToClipboard(selectedAsset.name)">
                                            {{ selectedAsset.name }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border }">
                                        <div class="gh-detail-label">💾 文件大小</div>
                                        <div class="gh-detail-value">{{ formatSize(selectedAsset.size) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border }">
                                        <div class="gh-detail-label">📥 下载次数</div>
                                        <div class="gh-detail-value">{{ selectedAsset.download_count.toLocaleString() }} 次</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border }">
                                        <div class="gh-detail-label">📤 上传时间</div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.created_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(4).bg, borderColor: getRowColor(4).border }">
                                        <div class="gh-detail-label">🔄 更新时间</div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.updated_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(5).bg, borderColor: getRowColor(5).border }">
                                        <div class="gh-detail-label">📋 Content-Type</div>
                                        <div class="gh-detail-value">{{ selectedAsset.content_type }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">🔗 相关链接</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">⬇️ 下载地址</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(selectedAsset.browser_download_url)">
                                            {{ selectedAsset.browser_download_url }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border }">
                                        <div class="gh-detail-label">🏠 项目地址</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(projectUrl)">
                                            {{ projectUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border }">
                                        <div class="gh-detail-label">📋 发布列表</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(releasesUrl)">
                                            {{ releasesUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border }">
                                        <div class="gh-detail-label">🆕 最新发布</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(latestUrl)">
                                            {{ latestUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">🔐 校验信息</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item gh-detail-full"
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border }">
                                        <div class="gh-detail-label">🔑 SHA256</div>
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
                                <span class="gh-download-icon">⬇️</span>
                                <span>下载文件</span>
                            </a>
                            <a :href="modalRelease?.html_url || releaseUrl" class="gh-github-btn" target="_blank">
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
    gap: 6px;
    flex-wrap: wrap;
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
    font-size: 14px;
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
    font-size: 14px;
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

.gh-pre-indicator {
    font-size: 14px;
    margin-left: 2px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
}

/* ========== 下载按钮 ========== */
.gh-dl-btn {
    display: inline-flex;
    border-radius: 4px;
    overflow: hidden;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    border: none;
    padding: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    vertical-align: middle;
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
    padding: 5px 8px;
    color: #fff;
    font-weight: 500;
    position: relative;
}

.gh-btn-pre-tag {
    position: absolute;
    top: -2px;
    right: -2px;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    background: #dc2626;
    border-radius: 4px;
    padding: 1px 3px;
    line-height: 1;
}

.gh-dl-arch {
    padding: 5px 8px;
    color: #fff;
    font-weight: 500;
    position: relative;
}

.gh-multi-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #ef4444;
    color: #fff;
    font-size: 10px;
    font-weight: 600;
    padding: 1px 4px;
    border-radius: 8px;
    line-height: 1;
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
    gap: 10px;
}

.gh-modal-pre-tag {
    font-size: 11px;
    font-weight: 600;
    color: #92400e;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 3px 8px;
    border-radius: 12px;
    border: 1px solid #fcd34d;
}

.gh-modal-close {
    background: none;
    border: none;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--vp-c-text-2, #64748b);
    transition: all 0.2s;
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
    font-size: 16px;
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
    font-size: 20px;
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
    color: var(--vp-c-text-3, #94a3b8);
    font-size: 16px;
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

/* ========== 详情区域 ========== */
.gh-detail-section {
    margin-bottom: 16px;
}

.gh-detail-section:last-child {
    margin-bottom: 0;
}

.gh-detail-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--vp-c-text-1, #1a202c);
    margin-bottom: 8px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
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
    font-size: 10px;
    color: var(--vp-c-text-3, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 2px;
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
    font-size: 14px;
}

.gh-github-btn {
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

.dark .gh-version-bar-tag {
    color: #bbf7d0;
    background: rgba(134, 239, 172, 0.1);
}

.dark .gh-version-bar-pre {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
    border-bottom-color: #b45309;
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