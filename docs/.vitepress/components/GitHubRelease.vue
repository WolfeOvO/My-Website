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
    showToggle: { type: Boolean, default: false },
    showBothVersions: { type: Boolean, default: false },
    icon: { type: String, default: '' }, 
})

// === 官方标准图标库 (Material Design / FontAwesome) ===
// 这些路径是官方矢量数据，绝对不会有错位问题
const icons = {
    // 功能图标
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
    
    // === OS 图标 (Material Design & FontAwesome 官方路径) ===
    // 移除所有 width/height 写死，改用 viewBox 配合 CSS 自适应
    android: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6,9.48l1.84-3.18c0.16-0.31,0.04-0.69-0.26-0.85c-0.29-0.15-0.65-0.06-0.83,0.22l-1.88,3.24 c-2.86-1.21-6.08-1.21-8.94,0L5.65,5.67c-0.19-0.29-0.58-0.38-0.87-0.2c-0.28,0.18-0.39,0.57-0.23,0.85l1.85,3.18 c-2.8,1.53-4.5,4.48-4.5,7.73h19.2C22.1,13.96,20.4,11.01,17.6,9.48z"/></svg>`,
    windows: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3,12V6.75L9,5.43V11.91L3,12M20,3V11.75L10,11.91V4.41L20,3M3,13L9,13.09V19.9L3,18.75V13M20,13.25V22L10,20.09V13.1L20,13.25Z"/></svg>`,
    apple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71,19.5c-0.83,1.24-1.71,2.45-3.05,2.47c-1.34,0.02-1.77-0.79-3.29-0.79c-1.53,0-2,0.77-3.27,0.82 c-1.31,0.05-2.3-1.32-3.14-2.53C4.25,17,2.94,12.45,4.7,9.39c0.87-1.52,2.43-2.48,4.12-2.5c1.6,0,2.6,1,3.4,1 c0.8,0,2.3-1,3.9-1c0.6,0,2.5,0.2,3.7,1.96c-3.1,1.9-2.6,6,0.5,7.2C19.91,17.06,19.28,18.53,18.71,19.5z M13,3.5 c0.7-0.8,1.2-1.9,1-3c-1,0-2.3,0.7-2.8,1.3c-0.6,0.6-1,1.5-0.9,2.7C11.5,4.5,12.4,4.2,13,3.5z"/></svg>`,
    linux: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M15.5,7c0.83,0,1.5,0.67,1.5,1.5S16.33,10,15.5,10 S14,9.33,14,8.5S14.67,7,15.5,7z M8.5,7C9.33,7,10,7.67,10,8.5S9.33,10,8.5,10S7,9.33,7,8.5S7.67,7,8.5,7z M12,20 c-2.21,0-4-1.79-4-4h8C16,18.21,14.21,20,12,20z"/></svg>`,
    ubuntu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M5.5,12c0-1.1,0.27-2.14,0.75-3.05 l2.34,1.35C8.19,10.95,8,11.46,8,12s0.19,1.05,0.59,1.7l-2.34,1.35C5.77,14.14,5.5,13.1,5.5,12z M12,20c-1.99,0-3.8-0.73-5.2-1.94 l2.34-1.35c0.75,0.8,1.79,1.29,2.86,1.29c2.21,0,4-1.79,4-4c0-0.34-0.04-0.67-0.12-0.99l2.58-0.73C18.86,11.23,19,12.1,19,13 C19,16.87,15.87,20,12,20z M12,4c3.87,0,7,3.13,7,7c0,0.9-0.14,1.77-0.46,2.72l-2.58-0.73C15.96,12.67,16,12.34,16,12 c0-2.21-1.79-4-4-4c-1.07,0-2.11,0.49-2.86,1.29L6.8,7.94C8.2,6.73,10.01,6,12,6z M5.5,7.5C5.5,6.67,6.17,6,7,6s1.5,0.67,1.5,1.5 S7.83,9,7,9S5.5,8.33,5.5,7.5z M5.5,16.5c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5S5.5,17.33,5.5,16.5z M19.5,12c0-0.83,0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5S19.5,12.83,19.5,12z"/></svg>`,
    debian: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.9,16.35c-1.17,1.56-2.77,2.55-4.68,2.9C10.6,19.55,9.33,19.45,7.72,18.87c-3.04-1.09-5.67-4.07-6.45-7.3 C0.68,9.15,0.97,6.76,2.05,4.86C3.55,2.6,5.35,1.48,7.93,1.2c2.58-0.28,4.38,0.59,5.78,2.83c1.7,2.74,0.04,6.63-3.24,7.44 c-1.63,0.41-3.69-0.39-4.57-1.84c-0.65-1.06-0.3-2.61,0.76-3.28c0.77-0.49,1.53-0.29,2.07,0.54c0.14,0.22,0.11,0.79-0.06,1.06 c-0.21,0.34-0.86,0.36-1.12,0.06c-0.2-0.23-0.12-0.62,0.17-0.79c0.23-0.13,0.6-0.08,0.77,0.11c0.3,0.33,0.19,0.82-0.26,1.05 c-0.64,0.34-1.42-0.22-1.35-0.97c0.07-0.8,1.14-1.33,1.86-0.92c0.75,0.42,0.92,1.35,0.38,2.06c-0.76,1.01-2.42,1.08-3.32,0.16 C5.22,8.08,5.15,6.24,5.65,5.09c1.02-2.31,3.22-3.62,5.67-3.32c1.78,0.21,3.21,1.17,3.87,2.62c0.66,1.42,0.61,3.28-0.63,4.29 C13.51,9.54,12.18,9.83,10.84,9.5C9.62,9.2,8.5,8.04,8.5,7.17c0-0.02,0.19-0.08,0.41-0.13c0.02,0.05,0.19,0.01,0.41-0.11 c1.88,0.19,3.31,1.13,3.97,2.58c0.66,1.41,0.19,3.33-1.05,4.35C11.19,14.72,9.82,15,8.48,14.67C6.53,14.19,5.57,13.15,5.44,11.97 c-0.18-1.73,1.55-3.46,3.56-3.35c0.97,0.05,1.84,0.78,2.02,1.67c0.2,1,1.37,1,1.37,1C11.5,9.08,10.5,8,9,8 C8.21,8.01,7.58,8.66,7.6,9.37c0.02,0.76,0.65,1.19,1.34,1.57c0.49,0.31,0.41,1.23,0.27,1.34c-0.37,0.3-0.67-0.14-1.28-0.05 c-0.6,0.09,0.36,1,0.85,0.69c0.56-0.54,0.45-1.76-0.16-2.5C7.99,9.54,7.49,9.08,7.5,8.37c0-0.01,0.18-0.06,0.41-0.11 C6.03,8.05,4.97,9.15,5.77,10.96C6.83,12.72,8.68,13.1,10.28,11.75c1.45-1.22,1.88-3.13,1.06-4.69C10.5,5.5,9.02,4.5,7.24,4.5 c-1.22,0-2.3,0.5-3.14,1.3C2.86,7.57,3.98,10.08,6.09,10.6C8.2,11.12,9.31,9.6,9.31,8.5c0-0.01,0.19-0.04,0.42-0.08 C9.71,9,9.17,9.79,8.34,10.02C7.3,10.31,6.58,9.83,6.54,8.91C6.48,7.1,8.66,5.37,10.28,6.17c0.75,0.37,1.25,1.07,1.25,1.76 c0,0.51,0.24,0.83,0.64,0.83c0.64,0,1.15-0.83,1.15-1.87c0-1.89-1.28-3.42-3.19-3.82c-1.92-0.4-3.79,0.21-4.88,1.6 C3.75,6.6,4.02,9.66,5.88,11.53c1.78,1.78,4.72,1.66,6.57,0C13.88,10.25,14.5,8.5,14.5,8.5c0,0,0.5,0,0.5,0 c0,1.34-0.67,2.67-1.92,3.83C11.83,13.5,10.17,13.5,8.5,12.5C6.17,11.08,5.17,8.08,6.33,5.92C7.5,3.75,10.5,2.75,12.83,3.75 c1.53,0.66,2.5,2.16,2.5,3.83c0,2.17-1.17,4.17-3,5.17c-1.83,1-4.33,0.67-5.83-0.83C5,10.42,4.83,8.08,6.17,6.42 c0.67-0.83,1.67-1.42,2.83-1.42c1.5,0,2.83,1,3.33,2.5C12.83,9,12.33,10.83,11,12c-1.33,1.17-3.33,1.33-5,0.33 C4.67,11.33,4.17,9.5,5,8.17c0.42-0.67,1.08-1.17,1.92-1.33c0.17-0.03,0.33,0,0.5,0.08C7.17,7,6.83,7.17,6.67,7.5 C6.17,8.5,6.5,9.67,7.42,10.33c0.92,0.66,2.08,0.5,2.75-0.42C10.67,9.42,10.5,8.25,9.75,7.67c-0.33-0.25-0.75-0.33-1.17-0.25 c-0.14,0.03-0.25,0.11-0.33,0.22C8.17,7.75,8,7.92,8,8.17c0,0.08-0.03,0.17-0.08,0.25c-0.11,0.17-0.31,0.25-0.5,0.25 C7.17,8.67,7,8.5,7,8.25c0-0.25,0.08-0.5,0.25-0.67C7.42,7.42,7.67,7.33,7.92,7.33C8.5,7.33,9,7.83,9,8.42c0,0.58-0.5,1.08-1.08,1.08 C7.33,9.5,6.83,9,6.83,8.42C6.83,8.33,6.86,8.25,6.92,8.17C7.25,7.67,7.92,7.33,8.67,7.33c0.75,0,1.42,0.33,1.75,0.83 c0.33,0.5,0.33,1.17,0,1.67c-0.33,0.5-1,0.83-1.75,0.83C8.08,10.67,7.5,10.33,7.17,9.83c-0.06-0.08-0.08-0.17-0.08-0.25 C7.08,9.42,7.17,9.33,7.25,9.33c0.08,0,0.17,0.03,0.25,0.08c0.17,0.11,0.33,0.11,0.5,0C8.33,9.25,8.42,8.92,8.17,8.75 c-0.08-0.06-0.17-0.08-0.25-0.08C7.67,8.67,7.42,8.75,7.25,9C6.92,9.5,7.25,10.17,7.92,10.33c0.67,0.17,1.33-0.17,1.5-0.83 C9.58,9,9.25,8.42,8.67,8.25C8.42,8.17,8.17,8.17,8,8.33C7.92,8.42,7.92,8.5,8,8.58C8.17,8.75,8.42,8.75,8.5,8.58 C8.58,8.5,8.58,8.42,8.5,8.33C8.42,8.25,8.33,8.25,8.25,8.25C8.08,8.25,8,8.42,8,8.58c0,0.17,0.17,0.33,0.33,0.33 C8.5,8.92,8.67,8.75,8.67,8.58C8.67,8.42,8.5,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42c0,0.08,0.08,0.17,0.17,0.17 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58 C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58C8.42,8.58,8.5,8.5,8.5,8.42C8.5,8.33,8.42,8.25,8.33,8.25C8.25,8.25,8.17,8.33,8.17,8.42C8.17,8.5,8.25,8.58,8.33,8.58"/></svg>`,
    appimage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.749 9.387 11.968 1.4l4.248 8.006zM22.6 13.568l-3.376 7.42-7.227-3.95zM4.776 20.988l-3.376-7.42 8.257 1.54zM12 11.23l2.843 5.385-6.52.88z"/></svg>`
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
const detailColorsLight = [
    { bg: '#f0f7ff', border: '#c6deff', label: '#3b82f6', text: '#1e40af' },  // 蓝色系
    { bg: '#f0fdf4', border: '#bbf7d0', label: '#22c55e', text: '#166534' },  // 绿色系
    { bg: '#fefce8', border: '#fef08a', label: '#eab308', text: '#a16207' },  // 黄色系
    { bg: '#fdf2f8', border: '#fbcfe8', label: '#ec4899', text: '#9d174d' },  // 粉色系
    { bg: '#f5f3ff', border: '#ddd6fe', label: '#8b5cf6', text: '#5b21b6' },  // 紫色系
    { bg: '#fff7ed', border: '#fed7aa', label: '#f97316', text: '#c2410c' },  // 橙色系
]

// 深色模式的颜色配置
const detailColorsDark = [
    { bg: '#1e3a5f', border: '#2563eb', label: '#60a5fa', text: '#93c5fd' },  // 蓝色系
    { bg: '#14532d', border: '#16a34a', label: '#4ade80', text: '#86efac' },  // 绿色系
    { bg: '#422006', border: '#ca8a04', label: '#facc15', text: '#fde047' },  // 黄色系
    { bg: '#500724', border: '#db2777', label: '#f472b6', text: '#fbcfe8' },  // 粉色系
    { bg: '#2e1065', border: '#7c3aed', label: '#a78bfa', text: '#c4b5fd' },  // 紫色系
    { bg: '#431407', border: '#ea580c', label: '#fb923c', text: '#fdba74' },  // 橙色系
]

// 检测深色模式
const isDark = ref(false)

// 获取当前主题的颜色
const detailColors = computed(() => isDark.value ? detailColorsDark : detailColorsLight)

const hashString = (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i)
        hash = hash & hash
    }
    return Math.abs(hash)
}

// 自动渐变逻辑
const getGradient = computed(() => {
    const uniqueKey = `${props.label}-${props.arch}-${props.match}`
    const preset = gradientPresets[hashString(uniqueKey) % gradientPresets.length]
    return `linear-gradient(135deg, ${preset[0]} 0%, ${preset[1]} 100%)`
})

// 解析图标：优先匹配内置 icons key，如果没有则认为是 SVG 字符串
const resolvedIcon = computed(() => {
    if (!props.icon) return null
    const lowerKey = props.icon.toLowerCase()
    return icons[lowerKey] || props.icon
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

// 左侧标签颜色：优先使用 props.labelColor，否则默认深灰色
const computedLabelBg = computed(() => {
    if (props.labelColor) return props.labelColor
    if (isPrerelease.value && !props.showBothVersions) return '#d97706'
    return '#444c56' 
})

// 右侧 Arch 背景：优先使用 archColor，否则使用 gradient
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
    return detailColors.value[index % detailColors.value.length]
}

// 检测并监听深色模式变化
const checkDarkMode = () => {
    isDark.value = document.documentElement.classList.contains('dark') ||
                   document.body.classList.contains('dark') ||
                   window.matchMedia('(prefers-color-scheme: dark)').matches
}

onMounted(() => {
    fetchRelease()
    
    // 初始检测
    checkDarkMode()
    
    // 监听 class 变化
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode)
})
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
                    <span class="gh-dl-label" :style="{ backgroundColor: props.labelColor || '#444c56' }">
                        <span v-if="resolvedIcon" class="gh-btn-icon" v-html="resolvedIcon"></span>
                        {{ label }}
                    </span>
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
                        <span v-if="resolvedIcon" class="gh-btn-icon" v-html="resolvedIcon"></span>
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
                <span class="gh-dl-label" :style="{ backgroundColor: computedLabelBg }">
                    <span v-if="resolvedIcon" class="gh-btn-icon" v-html="resolvedIcon"></span>
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

        <!-- 弹窗 (保持原逻辑) -->
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
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border, '--label-color': getRowColor(0).label, '--text-color': getRowColor(0).text }">
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
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border, '--label-color': getRowColor(1).label, '--text-color': getRowColor(1).text }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.hardDrive"></span>
                                            文件大小
                                        </div>
                                        <div class="gh-detail-value">{{ formatSize(selectedAsset.size) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border, '--label-color': getRowColor(2).label, '--text-color': getRowColor(2).text }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.download"></span>
                                            下载次数
                                        </div>
                                        <div class="gh-detail-value">{{ selectedAsset.download_count.toLocaleString() }} 次</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border, '--label-color': getRowColor(3).label, '--text-color': getRowColor(3).text }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.upload"></span>
                                            上传时间
                                        </div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.created_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(4).bg, borderColor: getRowColor(4).border, '--label-color': getRowColor(4).label, '--text-color': getRowColor(4).text }">
                                        <div class="gh-detail-label">
                                            <span class="gh-detail-label-icon" v-html="icons.refresh"></span>
                                            更新时间
                                        </div>
                                        <div class="gh-detail-value">{{ formatTime(selectedAsset.updated_at) }}</div>
                                    </div>
                                    <div class="gh-detail-item"
                                        :style="{ backgroundColor: getRowColor(5).bg, borderColor: getRowColor(5).border, '--label-color': getRowColor(5).label, '--text-color': getRowColor(5).text }">
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
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border, '--label-color': getRowColor(0).label, '--text-color': getRowColor(0).text }">
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
                                        :style="{ backgroundColor: getRowColor(1).bg, borderColor: getRowColor(1).border, '--label-color': getRowColor(1).label, '--text-color': getRowColor(1).text }">
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
                                        :style="{ backgroundColor: getRowColor(2).bg, borderColor: getRowColor(2).border, '--label-color': getRowColor(2).label, '--text-color': getRowColor(2).text }">
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
                                        :style="{ backgroundColor: getRowColor(3).bg, borderColor: getRowColor(3).border, '--label-color': getRowColor(3).label, '--text-color': getRowColor(3).text }">
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
                                        :style="{ backgroundColor: getRowColor(0).bg, borderColor: getRowColor(0).border, '--label-color': getRowColor(0).label, '--text-color': getRowColor(0).text }">
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
    vertical-align: middle;
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
    justify-content: center; /* 确保内容居中 */
    gap: 0.4em;
    line-height: 1.5; /* 稳定行高 */
}

/* 按钮内部图标样式 */
.gh-btn-icon {
    display: inline-flex; /* 允许 Flex 布局 */
    align-items: center;  /* 垂直居中 */
    justify-content: center; /* 水平居中 */
    width: 1.15em;  /* 相对尺寸，随字号变化 */
    height: 1.15em; /* 相对尺寸，随字号变化 */
    flex-shrink: 0; /* 禁止被挤压变形 */
    line-height: 1;
}

.gh-btn-icon :deep(svg) {
    width: 100%;
    height: 100%;
    fill: currentColor;
    display: block; /* 消除 SVG 底部默认间隙 */
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
    line-height: 1.5; /* 保持与 Label 一致 */
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
    text-align: left; /* 弹窗内部强制左对齐，防止继承外部 center */
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
    color: var(--label-color, var(--vp-c-text-3, #94a3b8));
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
    color: inherit;
}

.gh-detail-label-icon :deep(svg) {
    width: 12px;
    height: 12px;
}

.gh-detail-value {
    font-size: 12px;
    color: var(--text-color, var(--vp-c-text-1, #1a202c));
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
    color: var(--label-color, var(--vp-c-brand, #3b82f6));
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

/* 深色模式下的 detail-item 颜色由 JS 动态计算 */

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