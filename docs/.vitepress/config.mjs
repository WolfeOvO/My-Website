import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/My-Website/',
  title: "Wolfeの储物间",
  description: "在这里写描述",
  
  themeConfig: {
    // 1. 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '墙外指南', link: '/gfw-guide/basic' }
    ],

    // 2. 侧边栏 (多侧边栏配置 - 对象格式)
    sidebar: {
      '/storage/': [
        {
          text: '储物间',
          items: [
            { text: '索引', link: '/storage/home' },
            { text: '储物间', link: '/storage/home' },
            { text: '搜索引擎', link: '/storage/search' },
            { text: '问答导航', link: '/storage/q&a' },
            { text: '百科全书', link: '/storage/encyclopedia' },
            { text: 'BT 导航', link: '/storage/bt' },
            { text: '网盘服务', link: '/storage/cloud' },
            { text: '音乐导航', link: '/storage/music' },
            { text: '社交平台', link: '/storage/social' },
            { text: '图书馆', link: '/storage/library' },
            { text: '图片资源', link: '/storage/photo' },
            { text: '网页浏览器', link: '/storage/broswer' },
            { text: '维基媒体', link: '/storage/wikimedia' },
            { text: '工具箱', link: '/storage/toolbox' },
          ]
        }
      ],
      '/gfw-guide/': [
        {
          text: '墙外指南',
          items: [
            { text: '基础篇', link: '/gfw-guide/basic' },
            { text: '进阶篇', link: '/gfw-guide/advanced' }
          ]
        }
      ]
    },

    // 3. 社交链接 (可选)
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ]
  }
})
