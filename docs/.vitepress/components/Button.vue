<script setup>
const props = defineProps({
    href: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(v)
    },
    size: {
        type: String,
        default: 'medium',
        validator: (v) => ['small', 'medium', 'large'].includes(v)
    },
    tag: {
        type: String,
        default: ''
    }
})
</script>

<template>
    <a v-if="href" :href="href" class="vp-button" :class="[`vp-button-${type}`, `vp-button-${size}`]" target="_blank"
        rel="noopener noreferrer">
        <slot />
        <span v-if="tag" class="vp-button-tag">{{ tag }}</span>
    </a>
    <button v-else class="vp-button" :class="[`vp-button-${type}`, `vp-button-${size}`]">
        <slot />
        <span v-if="tag" class="vp-button-tag">{{ tag }}</span>
    </button>
</template>

<style scoped>
.vp-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s;
    white-space: nowrap;
}

/* Sizes */
.vp-button-small {
    padding: 6px 12px;
    font-size: 13px;
}

.vp-button-medium {
    padding: 8px 16px;
    font-size: 14px;
}

.vp-button-large {
    padding: 10px 20px;
    font-size: 15px;
}

/* Types */
.vp-button-primary {
    background: var(--vp-c-brand-1);
    color: var(--vp-c-white);
}

.vp-button-primary:hover {
    background: var(--vp-c-brand-2);
}

.vp-button-secondary {
    background: var(--vp-c-bg-soft);
    color: var(--vp-c-text-1);
    border: 1px solid var(--vp-c-divider);
}

.vp-button-secondary:hover {
    background: var(--vp-c-bg-mute);
    border-color: var(--vp-c-text-3);
}

.vp-button-success {
    background: var(--vp-c-green-1, #10b981);
    color: white;
}

.vp-button-success:hover {
    background: var(--vp-c-green-2, #059669);
}

.vp-button-warning {
    background: #f59e0b;
    color: white;
}

.vp-button-warning:hover {
    background: #d97706;
}

.vp-button-danger {
    background: var(--vp-c-red-1, #f43f5e);
    color: white;
}

.vp-button-danger:hover {
    background: var(--vp-c-red-2, #e11d48);
}

/* Tag badge */
.vp-button-tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 6px;
    font-size: 11px;
    font-weight: 600;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.2);
}

.vp-button-secondary .vp-button-tag {
    background: var(--vp-c-brand-soft);
    color: var(--vp-c-brand-1);
}
</style>