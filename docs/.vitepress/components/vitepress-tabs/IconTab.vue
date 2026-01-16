<script setup>
import { inject, onMounted, ref, computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: ''
    }
})

const context = inject('icon-tabs-context')
const index = ref(-1)

onMounted(() => {
    if (context) {
        index.value = context.registerTab({
            label: props.label,
            icon: props.icon
        })
    }
})

const isActive = computed(() => {
    return context ? context.activeTab.value === index.value : false
})
</script>

<template>
    <div v-show="isActive" class="vp-icon-tab-panel" role="tabpanel">
        <slot />
    </div>
</template>

<style scoped>
.vp-icon-tab-panel :deep(h1),
.vp-icon-tab-panel :deep(h2),
.vp-icon-tab-panel :deep(h3),
.vp-icon-tab-panel :deep(h4),
.vp-icon-tab-panel :deep(h5),
.vp-icon-tab-panel :deep(h6) {
    margin-top: 24px;
    margin-bottom: 16px;
}

.vp-icon-tab-panel :deep(h1:first-child),
.vp-icon-tab-panel :deep(h2:first-child),
.vp-icon-tab-panel :deep(h3:first-child),
.vp-icon-tab-panel :deep(h4:first-child),
.vp-icon-tab-panel :deep(h5:first-child),
.vp-icon-tab-panel :deep(h6:first-child) {
    margin-top: 0;
}

.vp-icon-tab-panel :deep(p) {
    margin: 16px 0;
}

.vp-icon-tab-panel :deep(p:first-child) {
    margin-top: 0;
}

.vp-icon-tab-panel :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

.vp-icon-tab-panel :deep(th),
.vp-icon-tab-panel :deep(td) {
    border: 1px solid var(--vp-c-divider);
    padding: 8px 12px;
    text-align: left;
}

.vp-icon-tab-panel :deep(th) {
    background: var(--vp-c-bg-soft);
    font-weight: 600;
}
</style>