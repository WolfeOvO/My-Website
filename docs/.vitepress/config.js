import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'
import { tabbed } from './plugins/vitepress-tabbed.js'
import footnote from 'markdown-it-footnote'
import { customContainerColorPlugin } from './plugins/customContainerColor'
import { licenseDeclarationPlugin } from './plugins/licenseDeclaration'

export default defineConfig({
  title: "Wolfeの储物间",
  description: "Wolfe 的小破站，始于 2026/1/11",
  ignoreDeadLinks: true,
  lastUpdated: true,

  markdown: {
    // ✅ 合并成一个 config 函数
    config(md) {
      md.use(tabsMarkdownPlugin)
      md.use(tabbed)
      md.use(footnote)
      md.use(licenseDeclarationPlugin)
      customContainerColorPlugin(md)
      
      // 自定义脚注渲染
      md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf) => {
        const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf)
        const refid = id
        const n = Number(tokens[idx].meta.id + 1).toString()
        
        return `<sup class="footnote-ref">
          <a href="#fn${id}" id="fnref${refid}" class="footnote-link" data-footnote="${n}">
            ${n}
          </a>
        </sup>`
      }
    }
  },

  themeConfig: {
    darkModeSwitchLabel: '切换主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '侧边栏',
    returnToTopLabel: '返回顶部',
    externalLinkIcon: true,
    
    footer: {
      message: '2010.9.15 wzy❤️ | 使用 VitePress 搭建，遵循 MIT 协议开源',
      copyright: 'Copyright © 2026 Wolfe Group'
    },

    outline: {
      level: 'deep', 
      label: '大纲' 
    },

    nav: [
      { text: '首页', link: '/' },
      { text: '储物间', link: '/储物间/储物间目录' },
      { text: '墙外指南', link: '/墙外指南/墙外指南目录' }
    ],

    sidebar: sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WolfeOvO' },
      { icon: 'twitter', link: 'https://x.com/_WolfeOvO_' }
    ],

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
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    }
  }
})