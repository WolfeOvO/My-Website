<script setup>
import { ref, provide, reactive, onMounted, computed } from 'vue'

const props = defineProps({
    // 用于多级嵌套时区分层级的唯一标识
    groupId: {
        type: String,
        default: () => `tabs-${Math.random().toString(36).slice(2, 9)}`
    }
})

const activeTab = ref(0)
const tabs = reactive([])

// 注册子 Tab
const registerTab = (tab) => {
    tabs.push(tab)
    return tabs.length - 1
}

// 提供给子组件
provide('tabs-context', {
    activeTab,
    registerTab,
    groupId: props.groupId
})

const setActive = (index) => {
    activeTab.value = index
}
</script>

<template>
    <div class="vp-tabs" :data-group="groupId">
        <div class="vp-tabs-nav" role="tablist">
            <button v-for="(tab, index) in tabs" :key="index" class="vp-tabs-tab"
                :class="{ 'vp-tabs-tab-active': activeTab === index }" role="tab" :aria-selected="activeTab === index"
                :tabindex="activeTab === index ? 0 : -1" @click="setActive(index)">
                {{ tab.label }}
            </button>
        </div>
        <div class="vp-tabs-content">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.vp-tabs {
    margin: 16px 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
    background: var(--vp-c-bg);
}

.vp-tabs-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    border-bottom: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg-soft);
    padding: 0 12px;
}

.vp-tabs-tab {
    position: relative;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-2);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: color 0.25s, background-color 0.25s;
    white-space: nowrap;
}

.vp-tabs-tab:hover {
    color: var(--vp-c-text-1);
}

.vp-tabs-tab-active {
    color: var(--vp-c-brand-1);
}

.vp-tabs-tab-active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 8px;
    right: 8px;
    height: 2px;
    background: var(--vp-c-brand-1);
    border-radius: 2px 2px 0 0;
}

.vp-tabs-content {
    padding: 16px 20px;
}

/* 嵌套 Tabs 样式调整 */
.vp-tabs .vp-tabs {
    margin: 12px 0;
    border-color: var(--vp-c-divider);
}

.vp-tabs .vp-tabs .vp-tabs-nav {
    background: var(--vp-c-bg-alt);
}
</style>