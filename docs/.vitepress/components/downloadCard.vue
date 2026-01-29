<template>
  <section class="dl-card" :style="cssVars">
    <!-- 顶部 toast（复制成功） -->
    <Teleport to="body">
      <Transition name="dl-toast">
        <div v-if="toast.visible" class="dl-toast" role="status" aria-live="polite">
          <span class="dl-toast-icon" v-html="icons.check"></span>
          <span class="dl-toast-text">已复制到剪贴板</span>
        </div>
      </Transition>
    </Teleport>

    <!-- 头部：文件类型 icon + 文件名 -->
    <header class="dl-header">
      <div class="dl-file-icon" :style="{ background: 'var(--dl-icon-bg)', color: 'var(--dl-accent)' }">
        <span v-if="fileIconSvg" v-html="fileIconSvg"></span>
        <span v-else v-html="icons.file"></span>
      </div>

      <div class="dl-title">
        <div class="dl-name">{{ name }}</div>
        <div class="dl-sub">
          <span class="dl-sub-item">
            <span class="dl-sub-ico" :style="iconPillStyle"><span v-html="icons.tag"></span></span>
            <span class="dl-sub-text">{{ computedType }}</span>
          </span>

          <span class="dl-sub-item">
            <span class="dl-sub-ico" :style="iconPillStyle"><span v-html="icons.database"></span></span>
            <span class="dl-sub-text">{{ computedSize }}</span>
          </span>
        </div>
      </div>

      <!-- 大下载按钮 -->
      <a class="dl-download-btn" :href="url" target="_blank" rel="noopener noreferrer" :title="`下载：${name}`">
        <span class="dl-download-ico" v-html="icons.download"></span>
        <span class="dl-download-text">{{ downloadLabel }}</span>
      </a>
    </header>

    <!-- 详情区 -->
    <div class="dl-grid">
      <!-- 1) 文件类型图标 / 文件类型 -->
      <div class="dl-item">
        <div class="dl-label">
          <span class="dl-label-ico" :style="iconPillStyle" v-html="icons.fileType"></span>
          <span>文件类型</span>
        </div>
        <div class="dl-value">{{ computedType }}</div>
      </div>

      <!-- 2) 文件大小 -->
      <div class="dl-item">
        <div class="dl-label">
          <span class="dl-label-ico" :style="iconPillStyle" v-html="icons.size"></span>
          <span>文件大小</span>
        </div>
        <div class="dl-value">{{ computedSize }}</div>
      </div>

      <!-- 3) 下载渠道 -->
      <div class="dl-item dl-full">
        <div class="dl-label">
          <span class="dl-label-ico" :style="iconPillStyle" v-html="icons.channel"></span>
          <span>下载渠道</span>
        </div>
        <div class="dl-value dl-channel">
          <span class="dl-channel-ico" :style="{ background: 'var(--dl-icon-bg)', color: 'var(--dl-accent)' }">
            <span v-if="channelIconSvg" v-html="channelIconSvg"></span>
            <span v-else v-html="resolvedChannelIcon"></span>
          </span>
          <span class="dl-channel-name">{{ channelName }}</span>
        </div>
      </div>

      <!-- 4) 下载链接（域名高亮 + slug 灰 + 点击复制） -->
      <div class="dl-item dl-full dl-copyable" role="button" tabindex="0"
        @click="copy(url)"
        @keydown.enter.prevent="copy(url)"
        @keydown.space.prevent="copy(url)">
        <div class="dl-label">
          <span class="dl-label-ico" :style="iconPillStyle" v-html="icons.link"></span>
          <span>下载链接</span>
        </div>

        <div class="dl-value dl-url">
          <span class="dl-url-domain">{{ urlDomain }}</span><span class="dl-url-path">{{ urlPath }}</span>
          <span class="dl-copy-hint">点击复制</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'

const props = defineProps({
  // 必填
  url: { type: String, required: true },
  name: { type: String, required: true },

  // 1) 文件类型图标（svg 字符串，可选）
  icon: { type: String, default: '' },

  // 3) type：.拓展名/具体名称
  ext: { type: String, default: '' },        // 例如 "zip" 或 ".zip"
  typeName: { type: String, default: '' },   // 例如 "压缩包"

  // 4) size：用户填写（如 "12.3 MB" / "1024KB"），组件自动换算 bytes
  size: { type: String, default: '' },

  // 5) 渠道：平台名称 + 图标（svg 字符串可选；也支持内置 key）
  channelName: { type: String, default: 'GitHub' },
  channelIcon: { type: String, default: '' }, // svg 字符串 或 内置 key：github/gitee/onedrive/dropbox/google-drive/docker/website
  // 颜色：预设名 or 自定义
  color: { type: String, default: 'blue' },   // blue/green/yellow/pink/purple/orange/red/cyan/gray
  theme: { type: Object, default: null },     // 自定义覆盖：{ bg, border, accent, text, muted, iconBg, shadow }

  // 按钮文字
  downloadLabel: { type: String, default: '下载' }
})

const isDark = ref(false)
let observer

const checkDarkMode = () => {
  if (typeof document === 'undefined') return
  isDark.value =
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark') ||
    window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
}

onMounted(() => {
  checkDarkMode()
  if (typeof document !== 'undefined') {
    observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    window.matchMedia?.('(prefers-color-scheme: dark)')?.addEventListener?.('change', checkDarkMode)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect?.()
  window.matchMedia?.('(prefers-color-scheme: dark)')?.removeEventListener?.('change', checkDarkMode)
})

/** 颜色预设（light/dark） */
const PRESETS = {
  blue:   { light: { bg:'#f0f7ff', border:'#c6deff', accent:'#3b82f6', text:'#1e40af', muted:'#64748b', iconBg:'#e6f1ff', shadow:'rgba(59,130,246,.35)' },
            dark:  { bg:'#0b1b33', border:'#1d4ed8', accent:'#60a5fa', text:'#bfdbfe', muted:'#94a3b8', iconBg:'#102a4a', shadow:'rgba(59,130,246,.35)' } },
  green:  { light: { bg:'#f0fdf4', border:'#bbf7d0', accent:'#22c55e', text:'#166534', muted:'#64748b', iconBg:'#e8fff1', shadow:'rgba(34,197,94,.30)' },
            dark:  { bg:'#0b2a18', border:'#16a34a', accent:'#4ade80', text:'#bbf7d0', muted:'#94a3b8', iconBg:'#0f3a22', shadow:'rgba(34,197,94,.30)' } },
  yellow: { light: { bg:'#fefce8', border:'#fef08a', accent:'#eab308', text:'#a16207', muted:'#64748b', iconBg:'#fff8cf', shadow:'rgba(234,179,8,.30)' },
            dark:  { bg:'#2a1c06', border:'#ca8a04', accent:'#facc15', text:'#fde68a', muted:'#94a3b8', iconBg:'#3a2608', shadow:'rgba(234,179,8,.30)' } },
  pink:   { light: { bg:'#fdf2f8', border:'#fbcfe8', accent:'#ec4899', text:'#9d174d', muted:'#64748b', iconBg:'#ffe7f2', shadow:'rgba(236,72,153,.28)' },
            dark:  { bg:'#2a0718', border:'#db2777', accent:'#f472b6', text:'#fbcfe8', muted:'#94a3b8', iconBg:'#3a0a22', shadow:'rgba(236,72,153,.28)' } },
  purple: { light: { bg:'#f5f3ff', border:'#ddd6fe', accent:'#8b5cf6', text:'#5b21b6', muted:'#64748b', iconBg:'#ede9ff', shadow:'rgba(139,92,246,.30)' },
            dark:  { bg:'#1a0b33', border:'#7c3aed', accent:'#a78bfa', text:'#ddd6fe', muted:'#94a3b8', iconBg:'#221044', shadow:'rgba(139,92,246,.30)' } },
  orange: { light: { bg:'#fff7ed', border:'#fed7aa', accent:'#f97316', text:'#c2410c', muted:'#64748b', iconBg:'#ffedd5', shadow:'rgba(249,115,22,.28)' },
            dark:  { bg:'#2a1407', border:'#ea580c', accent:'#fb923c', text:'#fed7aa', muted:'#94a3b8', iconBg:'#3a1a09', shadow:'rgba(249,115,22,.28)' } },
  red:    { light: { bg:'#fef2f2', border:'#fecaca', accent:'#ef4444', text:'#991b1b', muted:'#64748b', iconBg:'#ffe4e4', shadow:'rgba(239,68,68,.28)' },
            dark:  { bg:'#2a0b0b', border:'#dc2626', accent:'#f87171', text:'#fecaca', muted:'#94a3b8', iconBg:'#3a1010', shadow:'rgba(239,68,68,.28)' } },
  cyan:   { light: { bg:'#ecfeff', border:'#a5f3fc', accent:'#06b6d4', text:'#155e75', muted:'#64748b', iconBg:'#cffafe', shadow:'rgba(6,182,212,.25)' },
            dark:  { bg:'#06242a', border:'#0891b2', accent:'#22d3ee', text:'#a5f3fc', muted:'#94a3b8', iconBg:'#07313a', shadow:'rgba(6,182,212,.25)' } },
  gray:   { light: { bg:'#f8fafc', border:'#e2e8f0', accent:'#334155', text:'#0f172a', muted:'#64748b', iconBg:'#eef2f7', shadow:'rgba(2,6,23,.12)' },
            dark:  { bg:'#0b1220', border:'#334155', accent:'#cbd5e1', text:'#e2e8f0', muted:'#94a3b8', iconBg:'#111b2c', shadow:'rgba(0,0,0,.35)' } }
}

const palette = computed(() => {
  const base = PRESETS[props.color] || PRESETS.blue
  const picked = isDark.value ? base.dark : base.light
  return { ...picked, ...(props.theme || {}) }
})

const cssVars = computed(() => ({
  '--dl-bg': palette.value.bg,
  '--dl-border': palette.value.border,
  '--dl-accent': palette.value.accent,
  '--dl-text': palette.value.text,
  '--dl-muted': palette.value.muted,
  '--dl-icon-bg': palette.value.iconBg,
  '--dl-shadow': palette.value.shadow
}))

/** icons（svg） */
const icons = {
  file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  tag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 12 22l-8-8V2h12l4.59 4.59z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  channel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  size: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96 12 12.01 20.73 6.96"/></svg>`,
  fileType: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`
}

/** 渠道内置 icon */
const CHANNEL_ICONS = {
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C17.4 4.9 18.4 5.2 18.4 5.2c.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>`,
  gitee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h6a4 4 0 0 0 4-4v-6c0-5.52-4.48-10-10-10zm5.5 10.5H12a1.5 1.5 0 0 1 0-3h5.5a1.5 1.5 0 0 1 0 3z"/></svg>`,
  'google-drive': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.7 3h8.6l5 8.7-4.3 7.3H6.9L2.7 11.7 7.7 3zm1.7 2.5L5.6 11h6.7l3.8-5.5H9.4zm4.9 6.5H5.6l3.8 6.5h8.7L14.3 12zm1.4-1h6.7L18.6 5.5l-3.8 5.5z"/></svg>`,
  dropbox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 15l6-4 6 4-6 4-6-4zm18-4l6 4-6 4-6-4 6-4zM6 19l6-4 6 4-6 4-6-4z"/></svg>`,
  onedrive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 7.5a4.5 4.5 0 0 1 8.5 2A3.5 3.5 0 0 1 19.5 16H7a4 4 0 1 1 1.2-7.8A4.5 4.5 0 0 1 10.5 7.5z"/></svg>`,
  docker: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 11.4c-.6-.4-1.8-.5-2.5-.4-.2-1.4-1.1-2.4-2.3-3.1l-.2-.1-.1.2c-.4.8-.5 1.8-.2 2.7H7.2V7.9h2.2V5.7H7.2V3.5H5v2.2H2.8v2.2H5v2.8H2.4c-.2 2.8 1.2 5.1 4 5.9 1.5.4 3.2.3 4.8-.1 1.7-.4 3.2-1.2 4.3-2.4.7-.8 1.3-1.7 1.6-2.7.9.1 2.2.1 2.9-.6l.1-.1-.1-.1z"/></svg>`,
  website: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
}

const fileIconSvg = computed(() => (props.icon ? props.icon : null))

/** 文件类型字符串：.ext/名称 */
const computedType = computed(() => {
  const ext = (props.ext || '').trim()
  const cleanExt = ext ? (ext.startsWith('.') ? ext : `.${ext}`) : ''
  const tn = (props.typeName || '').trim()
  if (cleanExt && tn) return `${cleanExt}/${tn}`
  if (cleanExt) return cleanExt
  if (tn) return tn
  // fallback：从 url 推断
  const guess = guessExtFromUrl(props.url)
  return guess ? `.${guess}/文件` : '文件'
})

/** size：用户填写 + 自动换算 bytes */
const computedSize = computed(() => {
  const raw = (props.size || '').trim()
  const bytes = parseToBytes(raw)
  if (!raw && bytes == null) return '—'
  if (bytes == null) return raw || '—'
  const nf = new Intl.NumberFormat('en-US')
  return raw ? `${raw} / ${nf.format(bytes)} B` : `${nf.format(bytes)} B`
})

/** URL domain/path（参考 LinkCard.vue 逻辑） */
const urlParts = computed(() => {
  try {
    const u = new URL(props.url)
    return { domain: `${u.protocol}//${u.host}`, path: `${u.pathname}${u.search}${u.hash}` }
  } catch {
    return { domain: props.url, path: '' }
  }
})
const urlDomain = computed(() => urlParts.value.domain)
const urlPath = computed(() => urlParts.value.path)

const resolvedChannelIcon = computed(() => {
  const key = (props.channelIcon || '').trim().toLowerCase()
  if (!key) return CHANNEL_ICONS.github
  return CHANNEL_ICONS[key] || CHANNEL_ICONS.website
})

const channelIconSvg = computed(() => {
  const v = (props.channelIcon || '').trim()
  // 如果看起来像 svg 字符串，就直接用
  if (v.startsWith('<svg')) return v
  return null
})

const downloadLabel = computed(() => props.downloadLabel)

/** label 图标的彩色容器样式 */
const iconPillStyle = computed(() => ({
  background: 'var(--dl-icon-bg)',
  color: 'var(--dl-accent)'
}))

/** toast */
const toast = reactive({ visible: false, timer: null })
const showToast = () => {
  toast.visible = true
  if (toast.timer) clearTimeout(toast.timer)
  toast.timer = setTimeout(() => (toast.visible = false), 1600)
}

/** copy */
const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    showToast()
  } catch {
    // fallback
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', 'true')
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      showToast()
    } catch {
      // 彻底失败就不弹浏览器 alert，静默
    }
  }
}

/** utils */
function guessExtFromUrl(url) {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').pop() || ''
    const m = last.match(/\.([a-z0-9]+)$/i)
    return m ? m[1].toLowerCase() : ''
  } catch {
    return ''
  }
}

function parseToBytes(input) {
  if (!input) return null
  // 支持：12.3 MB / 1024KB / 5GiB / 200 B
  const m = input.replace(/,/g, '').trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]{0,3})$/)
  if (!m) return null
  const val = Number(m[1])
  if (!Number.isFinite(val)) return null
  const unit = (m[2] || 'B').toUpperCase()

  const table = {
    B: 1,
    KB: 1024,
    MB: 1024 ** 2,
    GB: 1024 ** 3,
    TB: 1024 ** 4,
    PB: 1024 ** 5,
    KIB: 1024,
    MIB: 1024 ** 2,
    GIB: 1024 ** 3,
    TIB: 1024 ** 4,
    PIB: 1024 ** 5
  }

  const factor = table[unit] ?? null
  if (!factor) return null
  return Math.round(val * factor)
}
</script>

<style scoped>
.dl-card {
  background: var(--dl-bg);
  border: 1px solid var(--dl-border);
  border-radius: 14px;
  padding: 16px;
  margin: 18px 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.06);
}

/* header */
.dl-header {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dl-file-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border: 1px solid var(--dl-border);
}
.dl-file-icon :deep(svg) { width: 22px; height: 22px; }

.dl-title { flex: 1; min-width: 0; }
.dl-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--dl-text);
  line-height: 1.25;
  margin-bottom: 6px;
  word-break: break-word;
}

.dl-sub {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
}
.dl-sub-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.dl-sub-ico {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid var(--dl-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.dl-sub-ico :deep(svg) { width: 12px; height: 12px; }
.dl-sub-text {
  font-size: 12px;
  color: var(--dl-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 40vw;
}

/* big download button (参考 GitHubRelease 的立体感) */
.dl-download-btn {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  background: linear-gradient(135deg, var(--dl-accent) 0%, rgba(0,0,0,0.15) 160%);
  box-shadow: 0 6px 18px var(--dl-shadow);
  transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
  user-select: none;
}
.dl-download-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.02);
  box-shadow: 0 10px 26px var(--dl-shadow);
}
.dl-download-ico { width: 18px; height: 18px; display: inline-flex; }
.dl-download-ico :deep(svg) { width: 18px; height: 18px; }

/* grid */
.dl-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
.dl-item {
  background: var(--vp-c-bg-soft, rgba(255,255,255,0.45));
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px;
  padding: 10px 12px;
}
:global(.dark) .dl-item {
  border-color: rgba(255,255,255,0.10);
}
.dl-full { grid-column: span 2; }

.dl-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: .2px;
  text-transform: uppercase;
  color: var(--dl-muted);
  margin-bottom: 6px;
}
.dl-label-ico {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 1px solid var(--dl-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.dl-label-ico :deep(svg) { width: 12px; height: 12px; }

.dl-value {
  color: var(--dl-text);
  font-size: 13px;
  line-height: 1.45;
  word-break: break-all;
}

/* channel */
.dl-channel {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.dl-channel-ico {
  width: 24px;
  height: 24px;
  border-radius: 10px;
  border: 1px solid var(--dl-border);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.dl-channel-ico :deep(svg) { width: 14px; height: 14px; }
.dl-channel-name { font-weight: 650; }

/* link copy */
.dl-copyable {
  cursor: pointer;
  position: relative;
  transition: background .15s ease;
}
.dl-copyable:hover {
  background: rgba(0,0,0,0.03);
}
:global(.dark) .dl-copyable:hover {
  background: rgba(255,255,255,0.04);
}

.dl-url {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  padding-right: 62px;
  position: relative;
}
.dl-url-domain {
  color: var(--dl-accent);
  font-weight: 700;
}
.dl-url-path {
  color: rgba(100,116,139,.95);
}
:global(.dark) .dl-url-path {
  color: rgba(148,163,184,.95);
}

.dl-copy-hint {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: var(--dl-accent);
  opacity: 0;
  transition: opacity .15s ease;
}
.dl-copyable:hover .dl-copy-hint { opacity: 1; }

/* toast */
.dl-toast {
  position: fixed;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(22,163,74,0.95);
  color: #fff;
  box-shadow: 0 10px 26px rgba(22,163,74,0.35);
  border: 1px solid rgba(255,255,255,0.18);
  backdrop-filter: blur(10px);
}
.dl-toast-icon { width: 18px; height: 18px; display: inline-flex; }
.dl-toast-icon :deep(svg) { width: 18px; height: 18px; }
.dl-toast-text { font-weight: 700; font-size: 13px; }

.dl-toast-enter-active, .dl-toast-leave-active { transition: opacity .16s ease, transform .16s ease; }
.dl-toast-enter-from, .dl-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-6px); }
</style>