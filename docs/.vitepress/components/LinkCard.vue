<template>
    <a :href="url" target="_blank" rel="noopener noreferrer"
        :class="['link-card', `link-card--${mode}`, { 'link-card--hover': isHovered }]" :style="cardStyle"
        @mouseenter="isHovered = true" @mouseleave="isHovered = false">
        <div class="link-card-content">
            <div class="link-card-header">
                <img v-if="metadata.icon" :src="metadata.icon" :alt="`${metadata.title} icon`" class="link-card-icon"
                    ref="iconImg" @load="handleIconLoad" @error="handleIconError" />
                <div v-else class="link-card-icon-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </div>
                <div class="link-card-url">
                    <span class="url-domain">{{ urlDomain }}</span>
                    <span class="url-path">{{ urlPath }}</span>
                </div>
            </div>

            <h3 class="link-card-title" :style="titleStyle">{{ metadata.title || url }}</h3>

            <p v-if="metadata.description" class="link-card-description" :style="descriptionStyle">
                {{ metadata.description }}
            </p>
        </div>

        <div v-if="metadata.image" class="link-card-image">
            <img :src="metadata.image" :alt="`${metadata.title} preview`" ref="coverImg" @load="handleImageLoad"
                @error="handleImageError" :crossorigin="extractColor ? 'anonymous' : undefined" />
        </div>

        <div class="link-card-shine" :style="{ opacity: isHovered ? 1 : 0 }"></div>
    </a>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
    url: {
        type: String,
        required: true
    },
    title: String,
    description: String,
    icon: String,
    image: String,
    mode: {
        type: String,
        default: 'standard',
        validator: (value) => ['compact', 'standard', 'adaptive'].includes(value)
    },
    // 标题最大行数（仅 standard 和 compact 模式）
    titleLines: {
        type: Number,
        default: null // null = 使用模式默认值
    },
    // 描述最大行数（仅 standard 和 compact 模式）
    descriptionLines: {
        type: Number,
        default: null // null = 使用模式默认值
    },
    extractColor: {
        type: Boolean,
        default: false
    },
    // 智能自动获取：当只提供 URL 时自动尝试获取元数据
    autoFetch: {
        type: Boolean,
        default: true // 改为默认 true
    }
})

const isHovered = ref(false)
const metadata = ref({
    title: props.title || '',
    description: props.description || '',
    icon: props.icon || '',
    image: props.image || ''
})

const coverImg = ref(null)
const iconImg = ref(null)
const extractedColor = ref(null)
const cardStyle = ref({})

// 计算标题和描述的行数样式
const titleStyle = computed(() => {
    if (props.mode === 'adaptive') return {}

    let lines
    if (props.titleLines !== null) {
        lines = props.titleLines
    } else {
        // 默认行数
        lines = props.mode === 'compact' ? 1 : 3
    }

    return {
        display: '-webkit-box',
        '-webkit-line-clamp': lines,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden'
    }
})

const descriptionStyle = computed(() => {
    if (props.mode === 'adaptive') return {}

    let lines
    if (props.descriptionLines !== null) {
        lines = props.descriptionLines
    } else {
        // 默认行数
        lines = props.mode === 'compact' ? 2 : 4
    }

    return {
        display: '-webkit-box',
        '-webkit-line-clamp': lines,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden'
    }
})

const urlParts = computed(() => {
    try {
        const urlObj = new URL(props.url)
        return {
            domain: urlObj.protocol + '//' + urlObj.host,
            path: urlObj.pathname + urlObj.search + urlObj.hash
        }
    } catch {
        return { domain: props.url, path: '' }
    }
})

const urlDomain = computed(() => urlParts.value.domain)
const urlPath = computed(() => urlParts.value.path)

// 从图片提取主色调
const extractColorFromImage = (img) => {
    return new Promise((resolve) => {
        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const size = 100
            canvas.width = size
            canvas.height = size

            ctx.drawImage(img, 0, 0, size, size)
            const imageData = ctx.getImageData(0, 0, size, size).data

            const colorMap = {}
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i]
                const g = imageData[i + 1]
                const b = imageData[i + 2]
                const a = imageData[i + 3]

                if (a < 125) continue
                if (r > 240 && g > 240 && b > 240) continue
                if (r < 15 && g < 15 && b < 15) continue

                const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`
                colorMap[key] = (colorMap[key] || 0) + 1
            }

            let maxCount = 0
            let dominantColor = null

            for (const [color, count] of Object.entries(colorMap)) {
                if (count > maxCount) {
                    maxCount = count
                    dominantColor = color
                }
            }

            if (dominantColor) {
                const [r, g, b] = dominantColor.split(',').map(Number)
                resolve({ r, g, b })
            } else {
                resolve(null)
            }
        } catch (error) {
            console.warn('Color extraction failed:', error)
            resolve(null)
        }
    })
}

// 获取页面背景颜色
const getPageBackgroundColor = () => {
    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
        return { r: 30, g: 41, b: 59 }
    } else {
        return { r: 255, g: 255, b: 255 }
    }
}

// 创建渐变背景
const createGradientStyle = (color) => {
    if (!color) return {}

    const { r, g, b } = color
    const isDark = document.documentElement.classList.contains('dark')

    if (isDark) {
        return {
            background: `linear-gradient(135deg, 
        rgba(${r}, ${g}, ${b}, 0.15) 0%, 
        rgba(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)}, 0.25) 50%,
        rgba(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)}, 0.2) 100%)`,
            borderColor: `rgba(${r}, ${g}, ${b}, 0.3)`
        }
    } else {
        return {
            background: `linear-gradient(135deg, 
        rgba(${r}, ${g}, ${b}, 0.08) 0%, 
        rgba(${Math.min(255, r + 30)}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, 0.15) 50%,
        rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.12) 100%)`,
            borderColor: `rgba(${r}, ${g}, ${b}, 0.25)`
        }
    }
}

// 处理封面图片加载
const handleImageLoad = async () => {
    if (!props.extractColor || !coverImg.value) return

    const color = await extractColorFromImage(coverImg.value)
    if (color) {
        extractedColor.value = color
        cardStyle.value = createGradientStyle(color)
    } else if (iconImg.value) {
        await handleIconLoad()
    }
}

// 处理图标加载
const handleIconLoad = async () => {
    if (!props.extractColor || extractedColor.value || !iconImg.value) return

    const color = await extractColorFromImage(iconImg.value)
    if (color) {
        extractedColor.value = color
        cardStyle.value = createGradientStyle(color)
    } else {
        const pageColor = getPageBackgroundColor()
        cardStyle.value = createGradientStyle(pageColor)
    }
}

const handleIconError = (e) => {
    e.target.style.display = 'none'
    if (!metadata.value.image && props.extractColor) {
        const pageColor = getPageBackgroundColor()
        cardStyle.value = createGradientStyle(pageColor)
    }
}

const handleImageError = (e) => {
    e.target.parentElement.style.display = 'none'
    metadata.value.image = ''
    if (iconImg.value && props.extractColor) {
        handleIconLoad()
    } else if (props.extractColor) {
        const pageColor = getPageBackgroundColor()
        cardStyle.value = createGradientStyle(pageColor)
    }
}

// 智能判断是否需要自动获取
const shouldAutoFetch = computed(() => {
    // 如果用户明确设置了 autoFetch=false，则不获取
    if (props.autoFetch === false) return false

    // 如果用户提供了完整信息，则不需要获取
    if (props.title && props.description && props.icon) return false

    // 其他情况都尝试获取
    return true
})

// 自动获取元数据
const fetchMetadata = async () => {
    if (!shouldAutoFetch.value) return

    try {
        // 尝试使用 microlink.io API
        const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(props.url)}`)
        const data = await response.json()

        if (data.status === 'success') {
            // 只填充用户未提供的字段
            metadata.value = {
                title: props.title || data.data.title || '',
                description: props.description || data.data.description || '',
                icon: props.icon || data.data.logo?.url || '',
                image: props.image || data.data.image?.url || data.data.screenshot?.url || ''
            }
        }
    } catch (error) {
        console.warn('Failed to fetch metadata:', error)
        // 如果获取失败，尝试推断 favicon
        if (!metadata.value.icon && !props.icon) {
            try {
                const urlObj = new URL(props.url)
                metadata.value.icon = `${urlObj.protocol}//${urlObj.host}/favicon.ico`
            } catch { }
        }
    }
}

// 监听主题变化
const updateColorOnThemeChange = () => {
    if (props.extractColor) {
        if (extractedColor.value) {
            cardStyle.value = createGradientStyle(extractedColor.value)
        } else {
            const pageColor = getPageBackgroundColor()
            cardStyle.value = createGradientStyle(pageColor)
        }
    }
}

onMounted(() => {
    // 智能获取元数据
    fetchMetadata()

    if (props.extractColor && !metadata.value.image && !metadata.value.icon) {
        const pageColor = getPageBackgroundColor()
        cardStyle.value = createGradientStyle(pageColor)
    }

    if (props.extractColor) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateColorOnThemeChange()
                }
            })
        })

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        })
    }
})

watch(() => props.url, () => {
    if (shouldAutoFetch.value) {
        fetchMetadata()
    }
})

watch(() => [props.image, props.icon, props.title, props.description], () => {
    metadata.value = {
        title: props.title || metadata.value.title,
        description: props.description || metadata.value.description,
        icon: props.icon || metadata.value.icon,
        image: props.image || metadata.value.image
    }

    extractedColor.value = null

    nextTick(() => {
        if (props.extractColor && !props.image && !props.icon) {
            const pageColor = getPageBackgroundColor()
            cardStyle.value = createGradientStyle(pageColor)
        }
    })
})
</script>

<style scoped>
/* ==================== 基础样式 ==================== */
.link-card {
    display: flex;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: #ffffff;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin: 1.5rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.link-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.link-card-content {
    flex: 1;
    padding: 20px 24px;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.link-card-header {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}

.link-card-icon {
    width: auto;
    height: auto;
    max-width: 24px;
    max-height: 24px;
    min-width: 18px;
    min-height: 18px;
    border-radius: 4px;
    object-fit: contain;
    flex-shrink: 0;
}

.link-card-icon-placeholder {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    flex-shrink: 0;
}

.link-card-icon-placeholder svg {
    width: 16px;
    height: 16px;
}

.link-card-url {
    font-size: 13px;
    font-family: 'SF Mono', 'Monaco', 'Cascadia Code', 'Consolas', monospace;
    flex: 1;
    min-width: 0;
}

.url-domain {
    color: #334155;
    font-weight: 500;
}

.url-path {
    color: #94a3b8;
    opacity: 0.7;
}

.link-card-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    margin: 0;
    color: #0f172a;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', sans-serif;
}

.link-card-description {
    font-size: 14px;
    line-height: 1.6;
    color: #64748b;
    margin: 0;
}

.link-card-image {
    width: 200px;
    min-width: 200px;
    position: relative;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.link-card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.link-card-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: translateX(-100%);
    transition: opacity 0.3s ease;
    pointer-events: none;
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        transform: translateX(-100%) skewX(-15deg);
    }

    100% {
        transform: translateX(200%) skewX(-15deg);
    }
}

/* ==================== Compact 模式 ==================== */
.link-card--compact {
    min-height: 80px;
    padding: 16px 20px;
}

.link-card--compact .link-card-content {
    padding: 0;
    gap: 6px;
}

.link-card--compact .link-card-header {
    margin-bottom: 4px;
}

.link-card--compact .link-card-icon {
    max-width: 20px;
    max-height: 20px;
    min-width: 16px;
    min-height: 16px;
}

.link-card--compact .link-card-url {
    font-size: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.link-card--compact .link-card-title {
    font-size: 15px;
}

.link-card--compact .link-card-description {
    font-size: 13px;
}

.link-card--compact .link-card-image {
    width: 120px;
    min-width: 120px;
    max-height: 80px;
}

/* ==================== Standard 模式 ==================== */
.link-card--standard .link-card-icon {
    max-width: 28px;
    max-height: 28px;
    min-width: 20px;
    min-height: 20px;
}

.link-card--standard .link-card-url {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* ==================== Adaptive 模式 ==================== */
.link-card--adaptive {
    min-height: 120px;
}

.link-card--adaptive .link-card-icon {
    max-width: 32px;
    max-height: 32px;
    min-width: 20px;
    min-height: 20px;
}

.link-card--adaptive .link-card-url {
    word-break: break-all;
}

.link-card--adaptive .link-card-title {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.link-card--adaptive .link-card-description {
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.link-card--adaptive .link-card-image {
    width: auto;
    min-width: 180px;
    max-width: 300px;
}

/* ==================== 暗黑模式 ==================== */
.dark .link-card {
    background: #1e293b;
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .link-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.dark .url-domain {
    color: #e2e8f0;
}

.dark .url-path {
    color: #64748b;
}

.dark .link-card-title {
    color: #f1f5f9;
}

.dark .link-card-description {
    color: #94a3b8;
}

.dark .link-card-image {
    background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
    .link-card {
        flex-direction: column;
    }

    .link-card-image {
        width: 100%;
        min-width: unset;
        height: 180px;
        order: -1;
    }

    .link-card--compact .link-card-image {
        height: 120px;
    }

    .link-card--adaptive .link-card-image {
        height: auto;
        min-height: 200px;
        max-width: unset;
    }

    .link-card-content {
        padding: 16px 20px;
    }

    .link-card--compact {
        padding: 12px 16px;
    }

    .link-card--compact .link-card-content {
        padding: 0;
    }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
    .link-card--adaptive .link-card-image {
        max-width: 350px;
    }

    .link-card--adaptive .link-card-icon {
        max-width: 36px;
        max-height: 36px;
    }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
    .link-card-url {
        font-size: 11px;
    }

    .link-card-title {
        font-size: 15px;
    }

    .link-card-description {
        font-size: 13px;
    }
}
</style>