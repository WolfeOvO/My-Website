import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "我的文档站", // 你的网站标题
  description: "在这里写描述",
  
  themeConfig: {
    // 1. 顶部导航栏
    nav: [
      { text: '首页', link: '/' },
      // 注意：这里的 link 最好指向该分类下的第一篇文章
      { text: '储物间', link: '/storage/1' },
      { text: '墙外指南', link: '/gfw-guide/basic' }
    ],

    // 2. 侧边栏 (多侧边栏配置 - 对象格式)
    sidebar: {
      // 当用户在 "/storage/" 目录下时，显示这个侧边栏
      '/storage/': [
        {
          text: '我的储物间',
          items: [
            // 这里的链接对应 docs/storage/1.md
            { text: '第一篇', link: '/storage/1' },
            { text: '第二篇', link: '/storage/2' }
          ]
        }
      ],

      // 当用户在 "/gfw-guide/" 目录下时，显示这个侧边栏
      '/gfw-guide/': [
        {
          text: '墙外指南',
          items: [
            // 这里的链接对应 docs/gfw-guide/basic.md
            { text: '基础篇', link: '/gfw-guide/basic' },
            { text: '进阶篇', link: '/gfw-guide/advanced' }
          ]
        }
      ]
    },

    // 3. 社交链接 (可选)
    socialLinks: [
      // 记得把下面的链接换成你自己的 GitHub 仓库地址
      { icon: 'github', link: 'https://github.com/' }
    ]
  }
})
