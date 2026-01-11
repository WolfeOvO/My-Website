import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Wolfeの储物间",
  description: "在这里写描述",
  ignoreDeadLinks: true,
  lastUpdated: true,

  markdown: {
    container: {
      tipLabel: '⚠️注意/提示',
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
      { text: '储物间', link: '/storage/contents.md' },
      { text: '墙外指南', link: '/gfw-guide/contents.md' }
    ],

    sidebar: {
      '/storage/': [
        {
          text: '储物间',
          items: [
            { text: '目录', link: '/storage/contents.md' },
            { text: '搜索引擎', link: '/storage/search.md' },
            { text: '问答导航', link: '/storage/q&a.md' },
            { text: '百科全书', link: '/storage/encyclopedia.md' },
            { text: 'BT 导航', link: '/storage/bt.md' },
            { text: '网盘服务', link: '/storage/cloud.md' },
            { text: '音乐导航', link: '/storage/music.md' },
            { text: '社交平台', link: '/storage/social.md' },
            { text: '图书馆', link: '/storage/library.md' },
            { text: '图片资源', link: '/storage/photo.md' },
            { text: '网页浏览器', link: '/storage/browser.md' },
            { text: '维基媒体', link: '/storage/wikimedia.md' },
            { text: '工具箱', link: '/storage/toolbox.md' },
          ]
        }
      ],
      '/gfw-guide/': [
        {
          text: '墙外指南',
          items: [
            { text: '目录', link: '/gfw-guide/contents.md' },
            { text: '基础篇', link: '/gfw-guide/basic' },
            { text: '进阶篇', link: '/gfw-guide/advanced' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/WolfeOvO' }
    ]
  }
})
