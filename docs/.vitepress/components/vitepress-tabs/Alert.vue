<script setup>
const props = defineProps({
    type: {
        type: String,
        default: 'warning',
        validator: (v) => ['info', 'tip', 'warning', 'danger'].includes(v)
    },
    title: {
        type: String,
        default: ''
    }
})

const icons = {
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
    tip: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4"/><path d="m6.41 6.41 2.83 2.83"/><path d="M2 12h4"/><path d="m17.66 6.41-2.83 2.83"/><path d="M22 12h-4"/><path d="m6.41 17.59 2.83-2.83"/><path d="M12 22v-4"/><path d="m17.66 17.59-2.83-2.83"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    danger: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`
}

const defaultTitles = {
    info: 'Info',
    tip: 'Tip',
    warning: 'Warning',
    danger: 'Danger'
}

const displayTitle = props.title || defaultTitles[props.type]
</script>

<template>
    <div class="vp-alert" :class="`vp-alert-${type}`">
        <div class="vp-alert-title">
            <span class="vp-alert-icon" v-html="icons[type]"></span>
            <span>{{ displayTitle }}</span>
        </div>
        <div class="vp-alert-content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.vp-alert {
    margin: 16px 0;
    padding: 16px 20px;
    border-radius: 8px;
    border-left: 4px solid;
}

.vp-alert-info {
    background: rgba(var(--vp-c-brand-rgb, 100, 108, 255), 0.08);
    border-color: var(--vp-c-brand-1);
}

.vp-alert-tip {
    background: rgba(var(--vp-c-green-rgb, 16, 185, 129), 0.08);
    border-color: var(--vp-c-green-1, #10b981);
}

.vp-alert-warning {
    background: rgba(234, 179, 8, 0.12);
    border-color: #d97706;
}

.vp-alert-danger {
    background: rgba(var(--vp-c-red-rgb, 244, 63, 94), 0.08);
    border-color: var(--vp-c-red-1, #f43f5e);
}

.vp-alert-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    margin-bottom: 8px;
}

.vp-alert-info .vp-alert-title {
    color: var(--vp-c-brand-1);
}

.vp-alert-tip .vp-alert-title {
    color: var(--vp-c-green-1, #10b981);
}

.vp-alert-warning .vp-alert-title {
    color: #d97706;
}

.vp-alert-danger .vp-alert-title {
    color: var(--vp-c-red-1, #f43f5e);
}

.vp-alert-icon {
    display: flex;
    align-items: center;
}

.vp-alert-content {
    color: var(--vp-c-text-1);
    line-height: 1.7;
}

.vp-alert-content :deep(p) {
    margin: 8px 0;
}

.vp-alert-content :deep(p:first-child) {
    margin-top: 0;
}

.vp-alert-content :deep(p:last-child) {
    margin-bottom: 0;
}

.vp-alert-content :deep(ul),
.vp-alert-content :deep(ol) {
    padding-left: 1.25em;
    margin: 8px 0;
}

.vp-alert-content :deep(li) {
    margin: 6px 0;
}

.vp-alert-content :deep(code) {
    font-size: 0.875em;
    background: var(--vp-c-mute);
    padding: 2px 6px;
    border-radius: 4px;
}

.vp-alert-content :deep(a) {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 2px;
}
</style>