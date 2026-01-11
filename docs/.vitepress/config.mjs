import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/My-Website/',
  title: "Wolfeの储物间",
  description: "在这里写描述",
  
  themeConfig: {
    // 1. 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      // 注意：这里的 link 最好指向该分类下的第一篇文章
      { text: '储物间', link: '/storage/storage' },
      { text: '墙外指南', link: '/gfw-guide/basic' }
    ],

    // 2. 侧边栏 (多侧边栏配置 - 对象格式)
    sidebar: {
      '/storage/': [
        {
          text: '储物间',
          items: [
            { text: '索引', link: '/storage/home' },
            { text: '1 搜索引擎', link: '/storage/1' },
            { text: '第二篇', link: '/storage/2' }
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
