<script setup>
import { inject, onMounted, ref, computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true
    }
})

const context = inject('tabs-context')
const index = ref(-1)

onMounted(() => {
    if (context) {
        index.value = context.registerTab({
            label: props.label
        })
    }
})

const isActive = computed(() => {
    return context ? context.activeTab.value === index.value : false
})
</script>

<template>
    <div v-show="isActive" class="vp-tab-panel" role="tabpanel">
        <slot />
    </div>
</template>

<style scoped>
.vp-tab-panel {
    /* 内容区样式 */
}

/* 让内部的 Markdown 元素正常显示 */
.vp-tab-panel :deep(h1),
.vp-tab-panel :deep(h2),
.vp-tab-panel :deep(h3),
.vp-tab-panel :deep(h4),
.vp-tab-panel :deep(h5),
.vp-tab-panel :deep(h6) {
    margin-top: 24px;
    margin-bottom: 16px;
}

.vp-tab-panel :deep(h1:first-child),
.vp-tab-panel :deep(h2:first-child),
.vp-tab-panel :deep(h3:first-child),
.vp-tab-panel :deep(h4:first-child),
.vp-tab-panel :deep(h5:first-child),
.vp-tab-panel :deep(h6:first-child) {
    margin-top: 0;
}

.vp-tab-panel :deep(p) {
    margin: 16px 0;
}

.vp-tab-panel :deep(p:first-child) {
    margin-top: 0;
}

.vp-tab-panel :deep(p:last-child) {
    margin-bottom: 0;
}

.vp-tab-panel :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
}

.vp-tab-panel :deep(th),
.vp-tab-panel :deep(td) {
    border: 1px solid var(--vp-c-divider);
    padding: 8px 12px;
    text-align: left;
}

.vp-tab-panel :deep(th) {
    background: var(--vp-c-bg-soft);
    font-weight: 600;
}

.vp-tab-panel :deep(ul),
.vp-tab-panel :deep(ol) {
    padding-left: 1.5em;
    margin: 16px 0;
}

.vp-tab-panel :deep(li) {
    margin: 8px 0;
}

.vp-tab-panel :deep(code) {
    font-size: 0.875em;
    background: var(--vp-c-mute);
    padding: 2px 6px;
    border-radius: 4px;
}

.vp-tab-panel :deep(pre) {
    margin: 16px 0;
    padding: 16px;
    background: var(--vp-code-block-bg);
    border-radius: 8px;
    overflow-x: auto;
}

.vp-tab-panel :deep(pre code) {
    background: transparent;
    padding: 0;
}

/* VitePress 容器样式 */
.vp-tab-panel :deep(.info),
.vp-tab-panel :deep(.tip),
.vp-tab-panel :deep(.warning),
.vp-tab-panel :deep(.danger),
.vp-tab-panel :deep(.details) {
    margin: 16px 0;
}
</style>