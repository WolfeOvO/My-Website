import{_ as a,C as l,c as o,o as i,j as e,a as s,G as n}from"./chunks/framework.CtAXNf5e.js";const y=JSON.parse('{"title":"Clash Verge Rev","description":"","frontmatter":{},"headers":[],"relativePath":"墙外指南/客户端下载/proxy-client/ClashVergeRev.md","filePath":"墙外指南/客户端下载/proxy-client/ClashVergeRev.md","lastUpdated":1768626406000}'),v={name:"墙外指南/客户端下载/proxy-client/ClashVergeRev.md"},c={class:"vp-tabs","data-id":"t0"},d={class:"vp-tabs-panel","data-i":"1"},h={tabindex:"0"},g={style:{"text-align":"center"}},p={style:{"text-align":"center"}},b={style:{"text-align":"center"}},u={style:{"text-align":"center"}};function x(m,t,w,R,f,_){const r=l("GitHubRelease");return i(),o("div",null,[t[6]||(t[6]=e("h1",{id:"clash-verge-rev",tabindex:"-1"},[s("Clash Verge Rev "),e("a",{class:"header-anchor",href:"#clash-verge-rev","aria-label":'Permalink to "Clash Verge Rev"'},"​")],-1)),t[7]||(t[7]=e("ul",null,[e("li",null,[s("GitHub 项目地址："),e("a",{href:"https://github.com/clash-verge-rev/clash-verge-rev",target:"_blank",rel:"noreferrer"},"https://github.com/clash-verge-rev/clash-verge-rev")]),e("li",null,[s("发布地址："),e("a",{href:"https://github.com/clash-verge-rev/clash-verge-rev/releases",target:"_blank",rel:"noreferrer"},"https://github.com/clash-verge-rev/clash-verge-rev/releases/")])],-1)),e("div",c,[t[4]||(t[4]=e("div",{class:"vp-tabs-nav"},[e("button",{class:"vp-tabs-tab active","data-i":"0"},"Windows"),e("button",{class:"vp-tabs-tab","data-i":"1"},"Linux")],-1)),t[5]||(t[5]=e("div",{class:"vp-tabs-panel active","data-i":"0"},[e("pre",null,[e("code",null,`=== "GitHub Release"

    ::: warning
    - 如果你不清楚你的电脑系统架构，请下载 \`\`x64\`\` 架构文件，目前多数 Windows 电脑使用该架构；
    - Windows 7 用户请升级至 Win10/11 或改为使用 Linux 桌面发行版，现版本已经不再支持 Windows 7；
    - 带有 \`\`fix_webview2\`\` 字样的安装包为内置 Webview2 环境版本。该文件体积比普通安装包大，仅用于当系统缺少且无法安装 WebView2 环境时使用，当你无法正常打开面板也可以试试这个版本。
    :::

    | 系统架构 | 下载地址 |
    | :---: | :---: |
    | x64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="x64-setup.exe" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 Webview2 安装包" arch="x64" match="x64_fixed_webview2-setup.exe" /> |
    | ARM64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARM64" match="arm64-setup.exe" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 Webview2 安装包" arch="ARM64" match="arm64_fixed_webview2-setup.exe" /> |

=== "WinGet"

    通过 Windows 11 自带的包管理器 WinGet 安装：

    \`\`\`
    winget install ClashVergeRev.ClashVergeRev
    \`\`\`

=== "Scoop"

    ::: warning
    这是社区维护的 Scoop 分发，Clash Verge Rev 开发团队不为下游渠道产生的问题提供支持。
    :::

    ::: tip ✏️笔记
    对于有**修改配置目录**或**便携版**需求的用户适用。
    :::

    安装 Scoop：

    \`\`\`
    # See https://github.com/ScoopInstaller/Install#readme
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 
    irm get.scoop.sh -outfile 'install.ps1'
    .\\install.ps1 -ScoopDir 'D:\\Scoop' -ScoopGlobalDir 'D:\\ScoopGlobal' # 仅作示例，可根据实际需求调整
    \`\`\`

    安装 Clash Verge Rev：

    \`\`\`
    scoop bucket add extras
    scoop install extras/clash-verge-rev
    \`\`\`
`)])],-1)),e("div",d,[t[3]||(t[3]=e("pre",null,[e("code",null,`=== 
`)],-1)),e("table",h,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"center"}},"发行版本"),e("th",{style:{"text-align":"center"}},"下载次数"),e("th",{style:{"text-align":"center"}},"下载地址")])],-1)),e("tbody",null,[e("tr",null,[t[0]||(t[0]=e("td",{style:{"text-align":"center"}},"Github Release 正式版",-1)),e("td",g,[n(r,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showVersion:!1})]),e("td",p,[n(r,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showDownloads:!1})])]),e("tr",null,[t[1]||(t[1]=e("td",{style:{"text-align":"center"}},"Github Release 测试版",-1)),e("td",b,[n(r,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showVersion:!1,prerelease:""})]),e("td",u,[n(r,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showDownloads:!1,prerelease:""})])])])])])])])}const G=a(v,[["render",x]]);export{y as __pageData,G as default};
