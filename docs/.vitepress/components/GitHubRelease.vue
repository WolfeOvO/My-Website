<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    owner: { type: String, required: true },
    repo: { type: String, required: true },

    // === 通用配置 ===
    prerelease: { type: Boolean, default: false },

    // === 模式选择 ===
    // 'badge' = 徽章模式（显示下载次数+版本）
    // 'button' = 下载按钮模式
    // 'all' = 显示全部
    mode: { type: String, default: 'badge' },

    // === 徽章模式配置 ===
    showDownloads: { type: Boolean, default: true },
    showVersion: { type: Boolean, default: true },
    tagLabel: { type: String, default: '' },

    // === 下载按钮模式配置 ===
    label: { type: String, default: '下载' },
    arch: { type: String, default: '' },
    match: { type: String, default: '' },

    // === 颜色配置 ===
    labelColor: { type: String, default: '' },
    archColor: { type: String, default: '' },
})

const release = ref(null)
const loading = ref(true)
const error = ref(null)
const totalDownloads = ref(0)
const matchedAsset = ref(null)

// 格式化下载数
const formatDownloads = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
}

// 检查文件名是否匹配
const isMatch = (assetName) => {
    if (!props.match) return false
    const keywords = props.match.toLowerCase().split('|').map(k => k.trim())
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

        // 计算总下载数
        if (release.value?.assets) {
            totalDownloads.value = release.value.assets.reduce(
                (sum, asset) => sum + (asset.download_count || 0), 0
            )

            // 查找匹配的 asset
            if (props.match) {
                matchedAsset.value = release.value.assets.find(a => isMatch(a.name))
            }
        }
    } catch (e) {
        error.value = e.message
    } finally {
        loading.value = false
    }
}

// 计算属性
const computedTagLabel = computed(() => {
    if (props.tagLabel) return props.tagLabel
    return props.prerelease ? '@autobuild' : '@latest'
})

const tagBgColor = computed(() => props.prerelease ? '#e6a23c' : '#67c23a')
const version = computed(() => release.value?.tag_name || 'N/A')
const releaseUrl = computed(() => release.value?.html_url || `https://github.com/${props.owner}/${props.repo}/releases`)
const downloadUrl = computed(() => matchedAsset.value?.browser_download_url || '')
const fileName = computed(() => matchedAsset.value?.name || '')

// 下载按钮颜色
const btnLabelColor = computed(() => props.labelColor || '#555')
const btnArchColor = computed(() => props.archColor || '#67c23a')

// 显示控制
const showBadge = computed(() => props.mode === 'badge' || props.mode === 'all')
const showButton = computed(() => (props.mode === 'button' || props.mode === 'all') && props.match)

onMounted(fetchRelease)
</script>

<template>
    <span class="gh-release">
        <!-- ========== 徽章模式 ========== -->
        <template v-if="showBadge">
            <!-- 下载次数徽章 -->
            <a v-if="showDownloads" :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="gh-badge-link"
                :title="`总下载: ${totalDownloads}`">
                <span class="gh-badge">
                    <span class="gh-badge-label" :style="{ backgroundColor: tagBgColor }">
                        {{ computedTagLabel }}
                    </span>
                    <span class="gh-badge-value gh-badge-count">
                        <template v-if="loading">···</template>
                        <template v-else-if="error">err</template>
                        <template v-else>{{ formatDownloads(totalDownloads) }}</template>
                    </span>
                </span>
            </a>

            <!-- 版本徽章 -->
            <a v-if="showVersion" :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="gh-badge-link"
                :title="`版本: ${version}`">
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

        <!-- ========== 下载按钮模式 ========== -->
        <a v-if="showButton" :href="downloadUrl || '#'"
            :class="['gh-dl-btn', { disabled: loading || error || !downloadUrl }]"
            :title="fileName || error || '加载中...'" target="_blank" rel="noopener noreferrer">
            <span class="gh-dl-label" :style="{ backgroundColor: btnLabelColor }">
                {{ label }}
            </span>
            <span class="gh-dl-arch"
                :style="{ backgroundColor: loading ? '#999' : (error || !downloadUrl ? '#f56c6c' : btnArchColor) }">
                <template v-if="loading">···</template>
                <template v-else-if="error || !matchedAsset">错误</template>
                <template v-else>{{ arch }}</template>
            </span>
        </a>
    </span>
</template>

<style scoped>
.gh-release {
    display: inline-flex;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
}

/* ===== 通用徽章样式 ===== */
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

/* ===== 下载按钮样式 ===== */
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
}

/* ===== 深色模式 ===== */
.dark .gh-badge,
.dark .gh-dl-btn {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .gh-badge:hover,
.dark .gh-dl-btn:hover:not(.disabled) {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
</style>