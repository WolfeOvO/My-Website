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
      { text: '储物间', link: '/storage/home' },
      { text: '搜索引擎'，search.md)
2. [问答导航](q&a.md)
3. [百科全书](encyclopedia.md)
4. [BT 导航](bt.md)
5. [网盘服务](cloud.md)
6. [音乐导航](music.md)
7. [社交平台](social.md)
8. [图书馆](library.md)
9. [图片资源](photo.md)
10. [网页浏览器](broswer.md)
11. [维基媒体](wikimedia.md)
12. [工具箱](toolbox.md)
      { text: '墙外指南', link: '/gfw-guide/basic' }
    ],

    // 2. 侧边栏 (多侧边栏配置 - 对象格式)
    sidebar: {
      '/storage/': [
        {
          text: '储物间'，
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
