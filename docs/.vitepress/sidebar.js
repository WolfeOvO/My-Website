import { text } from "node:stream/consumers";

export const sidebar = {
      '/储物间/': [
        {
          text: '储物间',
          items: [
            { text: '目录', link: '/储物间/储物间目录.md' },
            { text: '1 - 搜索引擎', link: '/储物间/1-搜索引擎.md' },
            { text: '2 - 问答导航', link: '/储物间/2-问答导航.md' },
            { text: '3 - 百科全书', link: '/储物间/3-百科全书.md' },
            { text: '4 - BT 导航', link: '/储物间/4-BT导航.md' },
            { text: '5 - 网盘服务', link: '/储物间/5-网盘服务.md' },
            { text: '6 - 音乐导航', link: '/储物间/6-音乐导航.md' },
            { text: '7 - 社交平台', link: '/储物间/7-社交平台.md' },
            { text: '8 - 图书馆', link: '/储物间/8-图书馆.md' },
            { text: '9 - 图片资源', link: '/储物间/9-图片资源.md' },
            { text: '10 - 网页浏览器', link: '/储物间/10-网页浏览器.md' },
            { text: '11 - 维基媒体', link: '/储物间/11-维基媒体.md' },
            { text: '12 - 工具箱', link: '/储物间/12-工具箱.md' }
          ]
        }
      ],
      '/墙外指南/': [
        {
          text: '墙外指南',
          items: [
            { text: '目录', link: '/墙外指南/墙外指南目录.md' },
            { text: '名词解释', link: '/墙外指南/名词解释.md' }
          ]
        },
        {
          text: '镜像',
          items: [
            { text: 'Wikipedia 维基百科', link: '/墙外指南/镜像/Wikipedia.md' },
            { text: 'GitHub 代理', link: '/墙外指南/镜像/GitHub.md' }
          ]
        },
        {
          text: '教程',
          items: [
            { text: '加速 GitHub 下载', link: '/墙外指南/教程/加速GitHub下载.md' }
          ]
        },
        {
           text: '推荐机场',
           collapsed: false,
           items: [
            { text: 'Telegram 频道推荐', link: '/墙外指南/推荐机场/Telegram频道推荐.md' },
            {
              text: '2026 年',
              collapsed: true,
              items: [
                { text: '1 月', link: '/墙外指南/推荐机场/2026年/2026年1月.md' }
              ]
            }
          ]
        },
        {
          text: '面板&客户端',
          items: [
            { text: '客户端',
              collapsed: true,
              items: [
                { text: '合集', link: '/墙外指南/面板&客户端/proxy-client/client.md' },
                { text: 'Clash', link: '墙外指南/面板&客户端/proxy-client/Clash.md' },
                { text: 'Clash Verge Rev', link: '/墙外指南/面板&客户端/proxy-client/ClashVergeRev.md' }
              ]
            }
          ]
        }
      ]
    }