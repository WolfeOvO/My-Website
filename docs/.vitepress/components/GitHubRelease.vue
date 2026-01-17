<script setup>
import { ref, onMounted, computed } from 'vue'

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

const release = ref(null)
const loading = ref(true)
const error = ref(null)
const totalDownloads = ref(0)
const matchedAssets = ref([])
const showModal = ref(false)
const selectedAsset = ref(null)
const showFileList = ref(false)

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

// 解析 match 参数（支持正则）
const parseMatch = (matchStr) => {
    if (!matchStr) return null
    // 检查是否为正则表达式格式: /pattern/flags
    const regexMatch = matchStr.match(/^\/(.+)\/([gimsuy]*)$/)
    if (regexMatch) {
        try {
            return new RegExp(regexMatch[1], regexMatch[2])
        } catch (e) {
            console.error('Invalid regex:', e)
            return null
        }
    }
    // 普通字符串匹配（多关键词用 | 分隔）
    return matchStr
}

// 检查文件名是否匹配
const isMatch = (assetName) => {
    const matcher = parseMatch(props.match)
    if (!matcher) return false

    if (matcher instanceof RegExp) {
        return matcher.test(assetName)
    }
    // 多关键词匹配
    const keywords = matcher.toLowerCase().split('|').map(k => k.trim())
    const name = assetName.toLowerCase()
    return keywords.every(keyword => name.includes(keyword))
}

// 获取 Release 信息
const fetchRelease = async () => {
    try {
        loading.value = true
        error.value = null

        const endpoint = props.prerelease
            ? `https://api.github.com/repos/${props.owner}/${props.repo}/releases`
            : `https://api.github.com/repos/${props.owner}/${props.repo}/releases/latest`

        const res = await fetch(endpoint, {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        })

        if (!res.ok) {
            if (res.status === 404) throw new Error('仓库不存在')
            if (res.status === 403) throw new Error('请求超限')
            throw new Error(`HTTP ${res.status}`)
        }

        const data = await res.json()
        release.value = props.prerelease
            ? (data.find(r => r.prerelease) || data[0])
            : data

        if (release.value?.assets) {
            totalDownloads.value = release.value.assets.reduce(
                (sum, asset) => sum + (asset.download_count || 0), 0
            )
            if (props.match) {
                matchedAssets.value = release.value.assets.filter(a => isMatch(a.name))
            }
        }
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

// 计算属性
const computedTagLabel = computed(() => props.tagLabel || (props.prerelease ? '@autobuild' : '@latest'))
const tagBgColor = computed(() => props.prerelease ? '#e6a23c' : '#67c23a')
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

// 点击按钮
const handleButtonClick = (e) => {
    e.preventDefault()
    if (loading.value || error.value || matchedAssets.value.length === 0) return

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

// 获取 SHA256（从 release body 中解析）
const getSHA256 = (assetName) => {
    if (!release.value?.body) return null
    const body = release.value.body
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

onMounted(fetchRelease)
</script>

<template>
    <span class="gh-release">
        <!-- 徽章模式 -->
        <template v-if="showBadge">
            <a v-if="showDownloads" :href="releaseUrl" target="_blank" class="gh-badge-link"
                :title="`总下载: ${totalDownloads}`">
                <span class="gh-badge">
                    <span class="gh-badge-label" :style="{ backgroundColor: tagBgColor }">{{ computedTagLabel }}</span>
                    <span class="gh-badge-value gh-badge-count">
                        <template v-if="loading">···</template>
                        <template v-else-if="error">err</template>
                        <template v-else>{{ formatDownloads(totalDownloads) }}</template>
                    </span>
                </span>
            </a>
            <a v-if="showVersion" :href="releaseUrl" target="_blank" class="gh-badge-link" :title="`版本: ${version}`">
                <span class="gh-badge">
                    <span class="gh-badge-label gh-release-label">release</span>
                    <span class="gh-badge-value gh-version-value">
                        <template v-if="loading">···</template>
                        <template v-else-if="error">err</template>
                        <template v-else>{{ version }}</template>
                    </span>
                </span>
            </a>
        </template>

        <!-- 下载按钮 -->
        <a v-if="showButton" href="#"
            :class="['gh-dl-btn', { disabled: loading || error || matchedAssets.length === 0 }]"
            :title="firstAsset?.name || error || '加载中...'" @click="handleButtonClick">
            <span class="gh-dl-label" :style="{ backgroundColor: btnLabelColor }">{{ label }}</span>
            <span class="gh-dl-arch"
                :style="loading ? { backgroundColor: '#999' } : (error || matchedAssets.length === 0 ? { backgroundColor: '#f56c6c' } : archBgStyle)">
                <template v-if="loading">···</template>
                <template v-else-if="error || matchedAssets.length === 0">错误</template>
                <template v-else>
                    {{ arch }}
                    <span v-if="hasMultipleFiles" class="gh-multi-badge">{{ matchedAssets.length }}</span>
                </template>
            </span>
        </a>

        <!-- 弹窗遮罩 -->
        <Teleport to="body">
            <Transition name="modal">
                <div v-if="showModal" class="gh-modal-overlay" @click.self="closeModal">
                    <div class="gh-modal">
                        <!-- 弹窗头部 -->
                        <div class="gh-modal-header">
                            <div class="gh-modal-title">
                                <span v-if="showFileList">📁 选择文件 ({{ matchedAssets.length }})</span>
                                <span v-else>📄 文件详情</span>
                            </div>
                            <button class="gh-modal-close" @click="closeModal">✕</button>
                        </div>

                        <!-- 文件列表 -->
                        <div v-if="showFileList" class="gh-modal-body">
                            <div class="gh-file-list">
                                <div v-for="asset in matchedAssets" :key="asset.id" class="gh-file-item"
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
                            <div v-if="hasMultipleFiles" class="gh-back-btn" @click="backToList">
                                ← 返回列表
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">📦 文件信息</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">文件名</div>
                                        <div class="gh-detail-value gh-copyable"
                                            @click="copyToClipboard(selectedAsset.name)">
                                            {{ selectedAsset.name }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">文件大小</div>
                                        <div class="gh-detail-value">{{ formatSize(selectedAsset.size) }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">下载次数</div>
                                        <div class="gh-detail-value">{{ selectedAsset.download_count.toLocaleString() }}
                                            次</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">上传时间</div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.created_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">更新时间</div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.updated_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">Content-Type</div>
                                        <div class="gh-detail-value">{{ selectedAsset.content_type }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">🔗 相关链接</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item gh-detail-full">
                                        <div class="gh-detail-label">下载地址</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(selectedAsset.browser_download_url)">
                                            {{ selectedAsset.browser_download_url }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full">
                                        <div class="gh-detail-label">项目地址</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(projectUrl)">
                                            {{ projectUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full">
                                        <div class="gh-detail-label">发布列表</div>
                                        <div class="gh-detail-value gh-copyable gh-url"
                                            @click="copyToClipboard(releasesUrl)">
                                            {{ releasesUrl }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                    </div>
                                    <div class="gh-detail-item gh-detail-full">
                                        <div class="gh-detail-label">最新发布</div>
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
                                    <div class="gh-detail-item gh-detail-full">
                                        <div class="gh-detail-label">SHA256</div>
                                        <div v-if="getSHA256(selectedAsset.name)"
                                            class="gh-detail-value gh-copyable gh-hash"
                                            @click="copyToClipboard(getSHA256(selectedAsset.name))">
                                            {{ getSHA256(selectedAsset.name) }}
                                            <span class="gh-copy-hint">点击复制</span>
                                        </div>
                                        <div v-else class="gh-detail-value gh-na">
                                            未在 Release Notes 中找到
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="gh-detail-section">
                                <div class="gh-detail-title">📋 版本信息</div>
                                <div class="gh-detail-grid">
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">版本号</div>
                                        <div class="gh-detail-value">{{ release?.tag_name }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">发布名称</div>
                                        <div class="gh-detail-value">{{ release?.name || release?.tag_name }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">发布时间</div>
                                        <div class="gh-detail-value">{{ formatTime(release?.published_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item">
                                        <div class="gh-detail-label">预发布</div>
                                        <div class="gh-detail-value">{{ release?.prerelease ? '是' : '否' }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 弹窗底部 -->
                        <div class="gh-modal-footer">
                            <a v-if="selectedAsset" :href="selectedAsset.browser_download_url" class="gh-download-btn"
                                target="_blank">
                                <span class="gh-download-icon">⬇</span>
                                下载文件
                            </a>
                            <a :href="releaseUrl" class="gh-github-btn" target="_blank">
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
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

/* 徽章样式 */
.gh-badge-link {
    text-decoration: none;
}

.gh-badge {
    display: inline-flex;
    font-size: 12px;
    line-height: 1;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    transition: all 0.2s ease;
}

.gh-badge:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
}

.gh-badge-label {
    padding: 5px 8px;
    color: #fff;
    font-weight: 600;
}

.gh-badge-value {
    padding: 5px 8px;
    color: #fff;
    font-weight: 500;
}

.gh-badge-count {
    background-color: #555;
}

.gh-release-label {
    background-color: #409eff;
}

.gh-version-value {
    background-color: #67c23a;
}

/* 下载按钮样式 */
.gh-dl-btn {
    display: inline-flex;
    text-decoration: none;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    transition: all 0.2s ease;
    cursor: pointer;
}

.gh-dl-btn:hover:not(.disabled) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

.gh-dl-btn.disabled {
    cursor: not-allowed;
    opacity: 0.7;
}

.gh-dl-label {
    padding: 6px 10px;
    color: #fff;
    font-weight: 500;
}

.gh-dl-arch {
    padding: 6px 10px;
    color: #fff;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

.gh-multi-badge {
    background: rgba(255, 255, 255, 0.3);
    padding: 1px 6px;
    border-radius: 10px;
    font-size: 11px;
}

/* 弹窗样式 */
.gh-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
}

.gh-modal {
    background: var(--vp-c-bg, #fff);
    border-radius: 16px;
    width: 100%;
    max-width: 600px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
}

.gh-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1, #1a202c);
}

.gh-modal-close {
    width: 32px;
    height: 32px;
    border: none;
    background: var(--vp-c-bg-soft, #f1f5f9);
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    color: var(--vp-c-text-2, #64748b);
    transition: all 0.2s;
}

.gh-modal-close:hover {
    background: var(--vp-c-bg-mute, #e2e8f0);
    color: var(--vp-c-text-1, #1a202c);
}

.gh-modal-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
}

/* 文件列表 */
.gh-file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.gh-file-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background: var(--vp-c-bg-soft, #f8fafc);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.gh-file-item:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    border-color: var(--vp-c-brand, #3b82f6);
}

.gh-file-icon {
    font-size: 24px;
}

.gh-file-info {
    flex: 1;
    min-width: 0;
}

.gh-file-name {
    font-weight: 500;
    color: var(--vp-c-text-1, #1a202c);
    word-break: break-all;
}

.gh-file-meta {
    font-size: 12px;
    color: var(--vp-c-text-3, #94a3b8);
    margin-top: 4px;
    display: flex;
    gap: 6px;
}

.gh-file-arrow {
    color: var(--vp-c-text-3, #94a3b8);
    font-size: 18px;
}

/* 返回按钮 */
.gh-back-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    margin-bottom: 16px;
    background: var(--vp-c-bg-soft, #f8fafc);
    border-radius: 8px;
    font-size: 13px;
    color: var(--vp-c-text-2, #64748b);
    cursor: pointer;
    transition: all 0.2s;
}

.gh-back-btn:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    color: var(--vp-c-brand, #3b82f6);
}

/* 详情区域 */
.gh-detail-section {
    margin-bottom: 24px;
}

.gh-detail-section:last-child {
    margin-bottom: 0;
}

.gh-detail-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1, #1a202c);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.gh-detail-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.gh-detail-item {
    background: var(--vp-c-bg-soft, #f8fafc);
    padding: 12px;
    border-radius: 8px;
}

.gh-detail-full {
    grid-column: span 2;
}

.gh-detail-label {
    font-size: 11px;
    color: var(--vp-c-text-3, #94a3b8);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.gh-detail-value {
    font-size: 13px;
    color: var(--vp-c-text-1, #1a202c);
    word-break: break-all;
}

.gh-copyable {
    cursor: pointer;
    position: relative;
    padding-right: 60px;
    transition: background 0.2s;
    border-radius: 4px;
}

.gh-copyable:hover {
    background: var(--vp-c-bg-mute, #e2e8f0);
}

.gh-copy-hint {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: var(--vp-c-brand, #3b82f6);
    opacity: 0;
    transition: opacity 0.2s;
}

.gh-copyable:hover .gh-copy-hint {
    opacity: 1;
}

.gh-url {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
}

.gh-hash {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
}

.gh-na {
    color: var(--vp-c-text-3, #94a3b8);
    font-style: italic;
}

/* 弹窗底部 */
.gh-modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid var(--vp-c-divider, #e2e8f0);
    background: var(--vp-c-bg-soft, #f8fafc);
}

.gh-download-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    border-radius: 10px;
    text-decoration: none;
    transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.gh-download-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

.gh-download-icon {
    font-size: 16px;
}

.gh-github-btn {
    padding: 12px 20px;
    background: var(--vp-c-bg, #fff);
    color: var(--vp-c-text-1, #1a202c);
    font-weight: 500;
    font-size: 14px;
    border-radius: 10px;
    text-decoration: none;
    border: 1px solid var(--vp-c-divider, #e2e8f0);
    transition: all 0.2s;
}

.gh-github-btn:hover {
    background: var(--vp-c-bg-mute, #f1f5f9);
    border-color: var(--vp-c-brand, #3b82f6);
}

/* 动画 */
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

/* 深色模式 */
.dark .gh-badge,
.dark .gh-dl-btn {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .gh-modal-overlay {
    background: rgba(0, 0, 0, 0.7);
}

/* 响应式 */
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
}
</style>