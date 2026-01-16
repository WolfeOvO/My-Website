<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
    owner: { type: String, required: true },
    repo: { type: String, required: true },
    prerelease: { type: Boolean, default: false },
    // 自定义标签文本
    label: { type: String, default: '' },
    // 是否显示下载按钮
    showDownload: { type: Boolean, default: true },
    // 是否显示版本按钮  
    showVersion: { type: Boolean, default: true },
})

const release = ref(null)
const loading = ref(true)
const error = ref(null)
const totalDownloads = ref(0)

// 格式化下载数
const formatDownloads = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
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
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                // 如果需要认证，可以添加 token
                // 'Authorization': 'token YOUR_GITHUB_TOKEN'
            }
        })

        if (!res.ok) {
            if (res.status === 404) throw new Error('仓库不存在或无 Release')
            if (res.status === 403) throw new Error('API 请求超限')
            throw new Error(`请求失败: ${res.status}`)
        }

        const data = await res.json()

        if (props.prerelease) {
            // 找到最新的 prerelease，如果没有就用最新的
            release.value = data.find(r => r.prerelease) || data[0]
        } else {
            release.value = data
        }

        // 计算总下载数（所有 assets 的下载量之和）
        if (release.value?.assets) {
            totalDownloads.value = release.value.assets.reduce(
                (sum, asset) => sum + (asset.download_count || 0), 0
            )
        }
    } catch (e) {
        error.value = e.message
        console.error('GitHub Release fetch error:', e)
    } finally {
        loading.value = false
    }
}

// 计算属性
const tagLabel = computed(() => {
    if (props.label) return props.label
    return props.prerelease ? '@autobuild' : '@latest'
})

const tagColor = computed(() => props.prerelease ? '#e6a23c' : '#67c23a')
const version = computed(() => release.value?.tag_name || 'N/A')
const releaseUrl = computed(() => release.value?.html_url || `https://github.com/${props.owner}/${props.repo}/releases`)

onMounted(fetchRelease)
</script>

<template>
    <div class="gh-release-badges">
        <!-- 下载次数徽章 -->
        <a v-if="showDownload" :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="gh-badge-link"
            :title="`总下载次数: ${totalDownloads}`">
            <span class="gh-badge">
                <span class="gh-badge-label" :style="{ backgroundColor: tagColor }">
                    {{ tagLabel }}
                </span>
                <span class="gh-badge-count">
                    <span v-if="loading" class="gh-loading">···</span>
                    <span v-else-if="error" class="gh-error" :title="error">err</span>
                    <span v-else>{{ formatDownloads(totalDownloads) }}</span>
                </span>
            </span>
        </a>

        <!-- 版本号徽章 -->
        <a v-if="showVersion" :href="releaseUrl" target="_blank" rel="noopener noreferrer" class="gh-badge-link"
            :title="`版本: ${version}`">
            <span class="gh-badge">
                <span class="gh-badge-label gh-badge-release">release</span>
                <span class="gh-badge-version">
                    <span v-if="loading" class="gh-loading">···</span>
                    <span v-else-if="error" class="gh-error" :title="error">err</span>
                    <span v-else>{{ version }}</span>
                </span>
            </span>
        </a>
    </div>
</template>

<style scoped>
.gh-release-badges {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}

.gh-badge-link {
    text-decoration: none;
    display: inline-block;
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
    letter-spacing: 0.3px;
}

.gh-badge-count,
.gh-badge-version {
    padding: 5px 8px;
    color: #fff;
    font-weight: 500;
}

.gh-badge-count {
    background-color: #555;
}

.gh-badge-release {
    background-color: #409eff;
}

.gh-badge-version {
    background-color: #67c23a;
}

.gh-loading {
    animation: pulse 1.5s infinite;
}

.gh-error {
    color: #ff6b6b;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* 深色模式支持 */
.dark .gh-badge {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

.dark .gh-badge:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
</style>