export const sidebar = {
  '/储物间/': [
    {
      text: '储物间',
      base: '/储物间/', 
      items: [
        { text: '目录', link: '储物间目录', isIndex: true }, 
        { text: '1 - 搜索引擎', link: '1-搜索引擎' },
        { text: '2 - 问答导航', link: '2-问答导航' },
        { text: '3 - 百科全书', link: '3-百科全书' },
        { text: '4 - BT 导航', link: '4-BT导航' },
        { text: '5 - 网盘服务', link: '5-网盘服务' },
        { text: '6 - 音乐导航', link: '6-音乐导航' },
        { text: '7 - 社交平台', link: '7-社交平台' },
        { text: '8 - 图书馆', link: '8-图书馆' },
        { text: '9 - 图片资源', link: '9-图片资源' },
        { text: '10 - 网页浏览器', link: '10-网页浏览器' },
        { text: '11 - 维基媒体', link: '11-维基媒体' },
        { text: '12 - 工具箱', link: '12-工具箱' },
        {text: '13 - Telegram 频道推荐', link: '13-TG频道推荐' }
      ]
    }
  ],
  '/墙外指南/': [
    {
      text: '墙外指南',
      base: '/墙外指南/',
      items: [
        { text: '目录', link: '墙外指南目录', isIndex: true },
        { text: '名词解释', link: '名词解释' }
      ]
    },
    {
      text: '镜像',
      base: '/墙外指南/镜像/',
      items: [
        { text: 'GitHub 代理', link: 'GitHub' },
        { text: 'Wikipedia 维基百科', link: 'Wikipedia' }
      ]
    },
    {
      text: '教程',
      base: '/墙外指南/教程/',
      items: [
        { text: '加速 GitHub 下载', link: '加速GitHub下载' },
        { text: 'Apple ID 账号获取', link: 'AppleID' }
      ]
    },
    {
      text: '推荐机场',
      base: '/墙外指南/推荐机场/',
      collapsed: false,
      items: [
        { text: 'Telegram 墙外频道推荐', link: 'gfw-telegram' },
        {
          text: '2026 年',
          collapsed: true,
          items: [
            { text: '1 月', link: '2026/2026-1' }
          ]
        }
      ]
    },
    {
      text: '软件下载',
      base: '/墙外指南/软件下载/proxy-client/', 
      items: [
        { 
          text: '客户端',
          collapsed: true,
          items: [
            { text: '合集（一定要先读完我再下载！）', link: 'client' },
            { text: 'Clash', link: 'Clash' },
            { text: 'Karing', link: 'Karing' },
            { text: 'FlClash', link: 'FlClash' },
            { text: 'Clash Mi', link: 'ClashMi' },
            { text: 'Clash Verge Rev', link: 'ClashVergeRev' },
            { text: 'Clash Meta for Android', link: 'ClashMetaforAndroid' }
          ]
        }
      ]
    }
  ],
  '/blog/': [
    {
      items: [
        {
          text: '2026 年',
          collapsed: false,
          items: [
            { 
              text: '1 月',
              base: '/blog/2026/2026-1/',
              collapsed: true,
              items: [
                { text: '为 Windows 10 和 11 打补丁以显示 Unicode 国旗表情 🇨🇳', link: 'unicode-flags-for-windows' }
              ]
             }
          ]
         }
      ]
    }
  ]
}