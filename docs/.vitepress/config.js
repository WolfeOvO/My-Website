import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { tabbed } from './plugins/vitepress-tabbed.js'

export default defineConfig({
  title: "Wolfeの储物间",
  description: "Wolfe 的小破站，始于2026/1/11",
  ignoreDeadLinks: true,
  lastUpdated: true,
  darkModeSwitchLabel: "切换主题",
  lightModeSwitchTitle: "切换到浅色模式",
  darkModeSwitchTitle: "切换到深色模式",
  sidebarMenuLabel: "侧边栏",
  returnToTopLabel: "返回顶部",
  externalLinkIcon: true,

  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    },

    config(md) {
      md.use(tabbed)
    },
    
    container: {
      tipLabel: '⚠️注意',
      warningLabel: '❗️警告',
      dangerLabel: '🚨危险',
      infoLabel: '（请在 ``::: info`` 后方自定义容器名称）',
      detailsLabel: '（请在 ``::: details`` 后方自定义容器名称）'
    }
  },

  themeConfig: {
  footer: {
      message: 'Released under the MIT License. 根据 MIT 协议发布。',
      copyright: 'Copyright © 2026-present Wolfe'
    },

    outline: {
      level: 'deep', 
      label: '大纲' 
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '储物间', link: '/储物间/储物间目录.md' },
      { text: '墙外指南', link: '/墙外指南/墙外指南目录.md' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WolfeOvO' }
    ],

    search: {
    provider: 'local'
    },

    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    }
  }
})