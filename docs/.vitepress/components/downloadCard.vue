<template>
  <section
    class="dl-card"
    :style="cssVars"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- shine 扫光层（整卡 hover） -->
    <div class="dl-shine" :style="{ opacity: isHovered ? 1 : 0 }"></div>

    <!-- 顶部 toast（复制成功） -->
    <Teleport to="body">
      <Transition name="dl-toast">
        <div v-if="toast.visible" class="dl-toast" role="status" aria-live="polite">
          <span class="dl-toast-icon" v-html="icons.check"></span>
          <span class="dl-toast-text">已复制到剪贴板</span>
        </div>
      </Transition>
    </Teleport>

    <!-- header -->
    <header class="dl-header">
      <!-- 文件 icon：只负责文件 -->
      <div class="dl-file-icon">
        <span v-if="fileIconSvg" v-html="fileIconSvg"></span>
        <span v-else v-html="icons.file"></span>
      </div>

      <div class="dl-title">
        <div class="dl-name">{{ name }}</div>
        <div class="dl-sub">
          <span class="dl-sub-item">
            <span class="dl-sub-ico"><span v-html="icons.tag"></span></span>
            <span class="dl-sub-text">{{ computedType }}</span>
          </span>
          <span class="dl-sub-item">
            <span class="dl-sub-ico"><span v-html="icons.database"></span></span>
            <span class="dl-sub-text">{{ computedSize }}</span>
          </span>
        </div>
      </div>

      <!-- ✅ split download button + dropdown -->
      <div class="dl-split">
        <a
          class="dl-download-btn"
          :href="selectedChannel.url"
          target="_blank"
          rel="noopener noreferrer"
          :title="`下载：${name}（${selectedChannel.name}）`"
        >
          <span class="dl-download-ico" v-html="icons.download"></span>
          <span class="dl-download-text">{{ downloadLabel }}</span>
          <span class="dl-download-sub">{{ selectedChannel.name }}</span>
        </a>

        <button
          class="dl-download-caret"
          type="button"
          aria-label="选择下载平台"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          @click="toggleMenu"
        >
          <span v-html="icons.chevronDown"></span>
        </button>

        <Transition name="dl-menu">
          <div v-if="menuOpen" class="dl-menu" role="menu">
            <button
              v-for="(ch, idx) in normalizedChannels"
              :key="idx"
              class="dl-menu-item"
              type="button"
              role="menuitem"
              @click="selectChannel(idx, true)"
            >
              <span class="dl-menu-ico" v-html="ch.iconSvg"></span>
              <span class="dl-menu-name">{{ ch.name }}</span>
              <span v-if="idx === selectedIndex" class="dl-menu-check" v-html="icons.checkMini"></span>
            </button>
          </div>
        </Transition>
      </div>
    </header>

    <!-- body -->
    <div class="dl-stack">
      <!-- ✅ 下载渠道：显示所有平台名称 + 图标 -->
      <div class="dl-row">
        <div class="dl-label">
          <span class="dl-label-ico" v-html="icons.channel"></span>
          <span>下载渠道</span>
        </div>

        <div class="dl-value dl-channels">
          <a
            v-for="(ch, idx) in normalizedChannels"
            :key="idx"
            class="dl-channel-pill"
            :href="ch.url"
            target="_blank"
            rel="noopener noreferrer"
            :title="`打开：${ch.name}`"
          >
            <span class="dl-channel-pill-ico" v-html="ch.iconSvg"></span>
            <span class="dl-channel-pill-name">{{ ch.name }}</span>
          </a>
        </div>
      </div>

      <!-- ✅ 下载链接：列出所有平台，每条前有平台 icon，每条可复制 -->
      <div class="dl-row">
        <div class="dl-label">
          <span class="dl-label-ico" v-html="icons.link"></span>
          <span>下载链接</span>
        </div>

        <div class="dl-links">
          <div
            v-for="(ch, idx) in normalizedChannels"
            :key="idx"
            class="dl-link-item"
            role="button"
            tabindex="0"
            @click="copy(ch.url)"
            @keydown.enter.prevent="copy(ch.url)"
            @keydown.space.prevent="copy(ch.url)"
          >
            <span class="dl-link-ico" v-html="ch.iconSvg"></span>

            <div class="dl-link-main">
              <div class="dl-link-top">
                <span class="dl-link-name">{{ ch.name }}</span>
                <button class="dl-link-copybtn" type="button" @click.stop="copy(ch.url)">
                  <span v-html="icons.copy"></span>
                  复制
                </button>
              </div>

              <div class="dl-link-url">
                <span class="dl-url-domain">{{ splitUrl(ch.url).domain }}</span
                ><span class="dl-url-path">{{ splitUrl(ch.url).path }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const props = defineProps({
  // 基本信息
  name: { type: String, required: true },
  url: { type: String, default: "" }, // 兜底（如果你不传 channels）
  icon: { type: String, default: "" },

  // type / size
  ext: { type: String, default: "" },
  typeName: { type: String, default: "" },
  size: { type: String, default: "" },

  // ✅ 核心：全平台数据源
  // [{ name: 'GitHub', icon: 'github', url: '...' }, ...]
  channels: { type: Array, default: null },

  // 默认选中哪个平台（影响按钮一键下载）
  defaultIndex: { type: Number, default: 0 },

  // 配色（参考 GitHubRelease 那套 6 色）
  color: { type: String, default: "blue" }, // blue/green/yellow/pink/purple/orange
  theme: { type: Object, default: null },

  // 按钮文案
  downloadLabel: { type: String, default: "立即下载" },
});

const isHovered = ref(false);

/* ========= 暗黑模式检测 ========= */
const isDark = ref(false);
let observer;

const checkDarkMode = () => {
  if (typeof document === "undefined") return;
  isDark.value =
    document.documentElement.classList.contains("dark") ||
    document.body.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
};

onMounted(() => {
  checkDarkMode();
  if (typeof document !== "undefined") {
    observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    window.matchMedia?.("(prefers-color-scheme: dark)")?.addEventListener?.("change", checkDarkMode);
    document.addEventListener("click", onDocClick, true);
    document.addEventListener("keydown", onKeyDown, true);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect?.();
  window.matchMedia?.("(prefers-color-scheme: dark)")?.removeEventListener?.("change", checkDarkMode);
  document.removeEventListener("click", onDocClick, true);
  document.removeEventListener("keydown", onKeyDown, true);
});

/* ========= 颜色预设（6 色） ========= */
const PRESETS = {
  blue: {
    light: { bg: "#f0f7ff", border: "#c6deff", accent: "#3b82f6", text: "#1e40af", muted: "#64748b", iconBg: "#e6f1ff", shadow: "rgba(59,130,246,.35)" },
    dark: { bg: "#1e3a5f", border: "#2563eb", accent: "#60a5fa", text: "#93c5fd", muted: "#94a3b8", iconBg: "#16314f", shadow: "rgba(37,99,235,.40)" },
  },
  green: {
    light: { bg: "#f0fdf4", border: "#bbf7d0", accent: "#22c55e", text: "#166534", muted: "#64748b", iconBg: "#e8fff1", shadow: "rgba(34,197,94,.30)" },
    dark: { bg: "#14532d", border: "#16a34a", accent: "#4ade80", text: "#86efac", muted: "#94a3b8", iconBg: "#114425", shadow: "rgba(22,163,74,.38)" },
  },
  yellow: {
    light: { bg: "#fefce8", border: "#fef08a", accent: "#eab308", text: "#a16207", muted: "#64748b", iconBg: "#fff8cf", shadow: "rgba(234,179,8,.30)" },
    dark: { bg: "#422006", border: "#ca8a04", accent: "#facc15", text: "#fde047", muted: "#94a3b8", iconBg: "#341905", shadow: "rgba(202,138,4,.40)" },
  },
  pink: {
    light: { bg: "#fdf2f8", border: "#fbcfe8", accent: "#ec4899", text: "#9d174d", muted: "#64748b", iconBg: "#ffe7f2", shadow: "rgba(236,72,153,.28)" },
    dark: { bg: "#500724", border: "#db2777", accent: "#f472b6", text: "#fbcfe8", muted: "#94a3b8", iconBg: "#3f061c", shadow: "rgba(219,39,119,.42)" },
  },
  purple: {
    light: { bg: "#f5f3ff", border: "#ddd6fe", accent: "#8b5cf6", text: "#5b21b6", muted: "#64748b", iconBg: "#ede9ff", shadow: "rgba(139,92,246,.30)" },
    dark: { bg: "#2e1065", border: "#7c3aed", accent: "#a78bfa", text: "#c4b5fd", muted: "#94a3b8", iconBg: "#250e52", shadow: "rgba(124,58,237,.42)" },
  },
  orange: {
    light: { bg: "#fff7ed", border: "#fed7aa", accent: "#f97316", text: "#c2410c", muted: "#64748b", iconBg: "#ffedd5", shadow: "rgba(249,115,22,.28)" },
    dark: { bg: "#431407", border: "#ea580c", accent: "#fb923c", text: "#fdba74", muted: "#94a3b8", iconBg: "#351006", shadow: "rgba(234,88,12,.42)" },
  },
};

const palette = computed(() => {
  const base = PRESETS[props.color] || PRESETS.blue;
  const picked = isDark.value ? base.dark : base.light;
  return { ...picked, ...(props.theme || {}) };
});

const cssVars = computed(() => ({
  "--dl-bg": palette.value.bg,
  "--dl-border": palette.value.border,
  "--dl-accent": palette.value.accent,
  "--dl-text": palette.value.text,
  "--dl-muted": palette.value.muted,
  "--dl-icon-bg": palette.value.iconBg,
  "--dl-shadow": palette.value.shadow,
}));

/* ========= icons ========= */
const icons = {
  file: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  tag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41 12 22l-8-8V2h12l4.59 4.59z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
  database: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  channel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>`,
  copy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
  checkMini: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`,
};

/* ========= 平台 icons ========= */
const CHANNEL_ICONS = {
  github: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.9 1.3 3.6 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.9 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0C17.4 4.9 18.4 5.2 18.4 5.2c.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.6-2.7 5.6-5.3 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>`,
  gitee: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h6a4 4 0 0 0 4-4v-6c0-5.52-4.48-10-10-10zm5.5 10.5H12a1.5 1.5 0 0 1 0-3h5.5a1.5 1.5 0 0 1 0 3z"/></svg>`,
  onedrive: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 7.5a4.5 4.5 0 0 1 8.5 2A3.5 3.5 0 0 1 19.5 16H7a4 4 0 1 1 1.2-7.8A4.5 4.5 0 0 1 10.5 7.5z"/></svg>`,
  dropbox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 3l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zM0 15l6-4 6 4-6 4-6-4zm18-4l6 4-6 4-6-4 6-4zM6 19l6-4 6 4-6 4-6-4z"/></svg>`,
  "google-drive": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.7 3h8.6l5 8.7-4.3 7.3H6.9L2.7 11.7 7.7 3zm1.7 2.5L5.6 11h6.7l3.8-5.5H9.4zm4.9 6.5H5.6l3.8 6.5h8.7L14.3 12zm1.4-1h6.7L18.6 5.5l-3.8 5.5z"/></svg>`,
  docker: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 11.4c-.6-.4-1.8-.5-2.5-.4-.2-1.4-1.1-2.4-2.3-3.1l-.2-.1-.1.2c-.4.8-.5 1.8-.2 2.7H7.2V7.9h2.2V5.7H7.2V3.5H5v2.2H2.8v2.2H5v2.8H2.4c-.2 2.8 1.2 5.1 4 5.9 1.5.4 3.2.3 4.8-.1 1.7-.4 3.2-1.2 4.3-2.4.7-.8 1.3-1.7 1.6-2.7.9.1 2.2.1 2.9-.6l.1-.1-.1-.1z"/></svg>`,
  website: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

/* ========= data normalize ========= */
const fileIconSvg = computed(() => (props.icon ? props.icon : null));

const normalizedChannels = computed(() => {
  // 优先 channels；否则用 url 做一个 website 渠道兜底
  const raw = Array.isArray(props.channels) && props.channels.length
    ? props.channels
    : (props.url ? [{ name: "下载", icon: "website", url: props.url }] : []);

  return raw.map((ch) => {
    const name = ch?.name ?? "渠道";
    const url = ch?.url ?? props.url ?? "";
    const icon = ch?.icon ?? "website";
    const iconSvg =
      typeof icon === "string" && icon.trim().startsWith("<svg")
        ? icon
        : (CHANNEL_ICONS[String(icon).toLowerCase()] || CHANNEL_ICONS.website);
    return { name, url, iconSvg };
  });
});

const safeDefaultIndex = computed(() => {
  const max = Math.max(0, normalizedChannels.value.length - 1);
  const idx = Number.isFinite(props.defaultIndex) ? props.defaultIndex : 0;
  return Math.min(Math.max(0, idx), max);
});

const selectedIndex = ref(0);
onMounted(() => {
  selectedIndex.value = safeDefaultIndex.value;
});

const selectedChannel = computed(() => normalizedChannels.value[selectedIndex.value] || { name: "下载", url: props.url || "", iconSvg: CHANNEL_ICONS.website });

/* ========= type / size ========= */
const computedType = computed(() => {
  const ext = (props.ext || "").trim();
  const cleanExt = ext ? (ext.startsWith(".") ? ext : `.${ext}`) : "";
  const tn = (props.typeName || "").trim();
  if (cleanExt && tn) return `${cleanExt}/${tn}`;
  if (cleanExt) return cleanExt;
  if (tn) return tn;
  const guess = guessExtFromUrl(selectedChannel.value.url || props.url);
  return guess ? `.${guess}/文件` : "文件";
});

const computedSize = computed(() => {
  const raw = (props.size || "").trim();
  const bytes = parseToBytes(raw);
  if (!raw && bytes == null) return "—";
  if (bytes == null) return raw || "—";
  const nf = new Intl.NumberFormat("en-US");
  return raw ? `${raw} / ${nf.format(bytes)} B` : `${nf.format(bytes)} B`;
});

/* ========= dropdown ========= */
const menuOpen = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const selectChannel = (idx, openNow) => {
  selectedIndex.value = idx;
  menuOpen.value = false;
  if (openNow) window.open(normalizedChannels.value[idx].url, "_blank", "noopener,noreferrer");
};

const onDocClick = (e) => {
  // 点击外部关闭菜单（简单处理：点到 menu 或按钮就不关）
  const el = e.target;
  if (!el) return;
  const root = el.closest?.(".dl-split");
  if (!root) menuOpen.value = false;
};

const onKeyDown = (e) => {
  if (e.key === "Escape") menuOpen.value = false;
};

/* ========= URL split（域名高亮） ========= */
const splitUrl = (u) => {
  try {
    const urlObj = new URL(u);
    return { domain: `${urlObj.protocol}//${urlObj.host}`, path: `${urlObj.pathname}${urlObj.search}${urlObj.hash}` };
  } catch {
    return { domain: u, path: "" };
  }
};

/* ========= toast / copy ========= */
const toast = reactive({ visible: false, timer: null });

const showToast = () => {
  toast.visible = true;
  if (toast.timer) clearTimeout(toast.timer);
  toast.timer = setTimeout(() => (toast.visible = false), 1600);
};

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "true");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast();
    } catch {}
  }
};

const downloadLabel = computed(() => props.downloadLabel);

/* ========= utils ========= */
function guessExtFromUrl(url) {
  try {
    const u = new URL(url);
    const last = u.pathname.split("/").pop() || "";
    const m = last.match(/\.([a-z0-9]+)$/i);
    return m ? m[1].toLowerCase() : "";
  } catch {
    return "";
  }
}

function parseToBytes(input) {
  if (!input) return null;
  const m = input.replace(/,/g, "").trim().match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]{0,3})$/);
  if (!m) return null;
  const val = Number(m[1]);
  if (!Number.isFinite(val)) return null;
  const unit = (m[2] || "B").toUpperCase();

  const table = {
    B: 1,
    KB: 1024, MB: 1024 ** 2, GB: 1024 ** 3, TB: 1024 ** 4, PB: 1024 ** 5,
    KIB: 1024, MIB: 1024 ** 2, GIB: 1024 ** 3, TIB: 1024 ** 4, PIB: 1024 ** 5,
  };

  const factor = table[unit] ?? null;
  if (!factor) return null;
  return Math.round(val * factor);
}
</script>

<style scoped>
/* card hover + shine */
.dl-card {
  position: relative;
  overflow: hidden;
  background: var(--dl-bg);
  border: 1px solid var(--dl-border);
  border-radius: 14px;
  padding: 16px;
  margin: 18px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.dl-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}
:global(.dark) .dl-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.40);
}

.dl-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  transition: opacity 0.3s ease;
  pointer-events: none;
  animation: dl-shine 3s infinite;
}
@keyframes dl-shine {
  0% { transform: translateX(-100%) skewX(-15deg); }
  100% { transform: translateX(200%) skewX(-15deg); }
}

/* header */
.dl-header { display: flex; align-items: center; gap: 14px; }
.dl-file-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  flex: 0 0 auto;
}
.dl-file-icon :deep(svg) { width: 22px; height: 22px; }

.dl-title { flex: 1; min-width: 0; }
.dl-name { font-size: 16px; font-weight: 800; color: var(--dl-text); margin-bottom: 6px; word-break: break-word; }

.dl-sub { display: flex; flex-wrap: wrap; gap: 8px 14px; }
.dl-sub-item { display: inline-flex; align-items: center; gap: 6px; min-width: 0; }
.dl-sub-ico {
  width: 18px; height: 18px; border-radius: 999px;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  display: inline-flex; align-items: center; justify-content: center;
}
.dl-sub-ico :deep(svg) { width: 12px; height: 12px; }
.dl-sub-text { font-size: 12px; color: var(--dl-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40vw; }

/* split button */
.dl-split { position: relative; display: inline-flex; align-items: stretch; gap: 0; }
.dl-download-btn {
  display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 4px;
  padding: 10px 14px;
  border-radius: 10px 0 0 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, var(--dl-accent) 0%, rgba(0,0,0,0.15) 160%);
  box-shadow: 0 6px 18px var(--dl-shadow);
  user-select: none;
  min-width: 120px;
}
.dl-download-ico { width: 18px; height: 18px; display: inline-flex; }
.dl-download-ico :deep(svg) { width: 18px; height: 18px; }
.dl-download-text { font-size: 14px; line-height: 1; }
.dl-download-sub { font-size: 11px; opacity: .92; line-height: 1; }

.dl-download-caret {
  width: 38px;
  border-radius: 0 10px 10px 0;
  border: none;
  cursor: pointer;
  color: #fff;
  background: linear-gradient(135deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.18) 140%);
  box-shadow: 0 6px 18px var(--dl-shadow);
}
.dl-download-caret :deep(svg) { width: 18px; height: 18px; }

.dl-download-btn:hover, .dl-download-caret:hover { filter: brightness(1.02); transform: translateY(-2px); }
.dl-download-btn, .dl-download-caret { transition: transform .15s ease, filter .15s ease, box-shadow .15s ease; }

/* dropdown menu */
.dl-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 220px;
  background: var(--vp-c-bg, #fff);
  border: 1px solid rgba(0,0,0,0.10);
  border-radius: 12px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 50;
}
:global(.dark) .dl-menu { border-color: rgba(255,255,255,0.10); box-shadow: 0 16px 40px rgba(0,0,0,0.45); }

.dl-menu-item {
  width: 100%;
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--dl-text);
}
.dl-menu-item:hover { background: rgba(0,0,0,0.04); }
:global(.dark) .dl-menu-item:hover { background: rgba(255,255,255,0.06); }

.dl-menu-ico {
  width: 22px; height: 22px;
  border-radius: 999px;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 auto;
}
.dl-menu-ico :deep(svg) { width: 14px; height: 14px; }
.dl-menu-name { font-weight: 750; font-size: 13px; flex: 1; text-align: left; }
.dl-menu-check { color: var(--dl-accent); }
.dl-menu-check :deep(svg) { width: 16px; height: 16px; }

/* menu transition */
.dl-menu-enter-active, .dl-menu-leave-active { transition: opacity .14s ease, transform .14s ease; }
.dl-menu-enter-from, .dl-menu-leave-to { opacity: 0; transform: translateY(-6px); }

/* rows */
.dl-stack { margin-top: 14px; display: flex; flex-direction: column; gap: 10px; }
.dl-row {
  background: var(--vp-c-bg-soft, rgba(255,255,255,0.45));
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px;
  padding: 10px 12px;
}
:global(.dark) .dl-row { border-color: rgba(255,255,255,0.10); }

.dl-label { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; letter-spacing: .2px; text-transform: uppercase; color: var(--dl-muted); margin-bottom: 6px; }
.dl-label-ico {
  width: 18px; height: 18px; border-radius: 999px;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  display: inline-flex; align-items: center; justify-content: center;
}
.dl-label-ico :deep(svg) { width: 12px; height: 12px; }

.dl-value { color: var(--dl-text); font-size: 13px; line-height: 1.45; word-break: break-all; }

/* channels pills */
.dl-channels { display: flex; flex-wrap: wrap; gap: 8px; }
.dl-channel-pill {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  text-decoration: none;
  color: var(--dl-text);
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
:global(.dark) .dl-channel-pill { border-color: rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); }
.dl-channel-pill:hover { transform: translateY(-1px); box-shadow: 0 10px 18px rgba(0,0,0,0.08); }
:global(.dark) .dl-channel-pill:hover { box-shadow: 0 10px 18px rgba(0,0,0,0.35); }

.dl-channel-pill-ico {
  width: 18px; height: 18px; border-radius: 999px;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  display: inline-flex; align-items: center; justify-content: center;
}
.dl-channel-pill-ico :deep(svg) { width: 12px; height: 12px; }
.dl-channel-pill-name { font-weight: 750; font-size: 12px; }

/* links list */
.dl-links { display: flex; flex-direction: column; gap: 10px; }

.dl-link-item {
  display: flex; gap: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.55);
  cursor: pointer;
  transition: transform .15s ease, box-shadow .15s ease, background .15s ease;
}
:global(.dark) .dl-link-item { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.05); }
.dl-link-item:hover { transform: translateY(-1px); box-shadow: 0 10px 18px rgba(0,0,0,0.08); }
:global(.dark) .dl-link-item:hover { box-shadow: 0 10px 18px rgba(0,0,0,0.35); }

.dl-link-ico {
  width: 26px; height: 26px; border-radius: 10px;
  border: 1px solid var(--dl-border);
  background: var(--dl-icon-bg);
  color: var(--dl-accent);
  display: inline-flex; align-items: center; justify-content: center;
  flex: 0 0 auto;
}
.dl-link-ico :deep(svg) { width: 14px; height: 14px; }

.dl-link-main { min-width: 0; flex: 1; }
.dl-link-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; }
.dl-link-name { font-weight: 800; color: var(--dl-text); font-size: 13px; }

.dl-link-copybtn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.10);
  background: rgba(255,255,255,0.65);
  color: var(--dl-text);
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
}
:global(.dark) .dl-link-copybtn { border-color: rgba(255,255,255,0.10); background: rgba(255,255,255,0.06); }
.dl-link-copybtn:hover { background: rgba(0,0,0,0.03); }
:global(.dark) .dl-link-copybtn:hover { background: rgba(255,255,255,0.08); }
.dl-link-copybtn :deep(svg) { width: 14px; height: 14px; }

.dl-link-url {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  word-break: break-all;
}
.dl-url-domain { color: var(--dl-accent); font-weight: 800; }
.dl-url-path { color: rgba(100,116,139,.95); }
:global(.dark) .dl-url-path { color: rgba(148,163,184,.95); }

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
.dl-toast-text { font-weight: 900; font-size: 13px; }
.dl-toast-enter-active, .dl-toast-leave-active { transition: opacity .16s ease, transform .16s ease; }
.dl-toast-enter-from, .dl-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(-6px); }
</style>