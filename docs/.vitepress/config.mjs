import { defineConfig } from 'vitepress'

// 你的网站配置
export default defineConfig({
  title: "Wolfeの储物间",  // 网站左上角的标题
  description: "存资料的地方",
  
  // 主题配置
  themeConfig: {
    // 顶部导航栏
    nav: [
      { text: '储物间', link: '/storage' },
      { text: '墙外指南', link: '/gfw-guide' }
    ]，

    // 左侧侧边栏 (这里代替了原来的 SUMMARY.md)
    sidebar: [
      {
        text: '储物间',
        items: [
          { text: '1', link: '/storage/1' },
          { text: '2', link: '/storage/2' }
        ]
      }
    ],

    // 开启本地搜索 (Ctrl + K)
    search: {
      provider: 'local'
    },

    // 右侧大纲标题
    outlineTitle: '本页目录',
    
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/你的用户名/仓库名' }
    ]
  }
})
