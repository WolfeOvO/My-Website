import { defineConfig } from 'vitepress'
// 1. 引入必须放在最上面
import { sidebar } from './sidebar'

export default defineConfig({
  title: "Wolfeの储物间",
  description: "在这里写描述",
  ignoreDeadLinks: true,
  lastUpdated: true,

  markdown: {
    container: {
      tipLabel: '⚠️注意',
      warningLabel: '❗️警告',
      dangerLabel: '🚨危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
  
  themeConfig: {
    outline: {
      level: 'deep', 
      label: '大纲' 
    },
    
    nav: [
      { text: '首页', link: '/' },
      { text: '储物间', link: '/储物间/储物间目录.md' },
      { text: '墙外指南', link: '/墙外指南/墙外指南目录.md' }
    ],

    // 2. 在这里直接使用引入的 sidebar 变量
    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WolfeOvO' }
    ]
  }
})