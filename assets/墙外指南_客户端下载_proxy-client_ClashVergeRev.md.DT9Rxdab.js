import{_ as r,C as s,c as n,o as l,aj as i,j as e,G as a}from"./chunks/framework.CtAXNf5e.js";const R=JSON.parse('{"title":"Clash Verge Rev","description":"","frontmatter":{},"headers":[],"relativePath":"墙外指南/客户端下载/proxy-client/ClashVergeRev.md","filePath":"墙外指南/客户端下载/proxy-client/ClashVergeRev.md","lastUpdated":1768626070000}'),u={name:"墙外指南/客户端下载/proxy-client/ClashVergeRev.md"},v={tabindex:"0"},c={style:{"text-align":"center"}},d={style:{"text-align":"center"}},h={style:{"text-align":"center"}},g={style:{"text-align":"center"}};function p(b,t,q,x,m,_){const o=s("GitHubRelease");return l(),n("div",null,[t[3]||(t[3]=i(`<h1 id="clash-verge-rev" tabindex="-1">Clash Verge Rev <a class="header-anchor" href="#clash-verge-rev" aria-label="Permalink to &quot;Clash Verge Rev&quot;">​</a></h1><ul><li>GitHub 项目地址：<a href="https://github.com/clash-verge-rev/clash-verge-rev" target="_blank" rel="noreferrer">https://github.com/clash-verge-rev/clash-verge-rev</a></li><li>发布地址：<a href="https://github.com/clash-verge-rev/clash-verge-rev/releases" target="_blank" rel="noreferrer">https://github.com/clash-verge-rev/clash-verge-rev/releases/</a></li></ul><div class="vp-tabs" data-id="t0"><div class="vp-tabs-nav"><button class="vp-tabs-tab active" data-i="0">Windows</button></div><div class="vp-tabs-panel active" data-i="0"><pre><code>==== &quot;GitHub Release&quot;

    ::: warning
    - 如果你不清楚你的电脑系统架构，请下载 \`\`x64\`\` 架构文件，目前多数 Windows 电脑使用该架构；
    - Windows 7 用户请升级至 Win10/11 或改为使用 Linux 桌面发行版，现版本已经不再支持 Windows 7；
    - 带有 \`\`fix_webview2\`\` 字样的安装包为内置 Webview2 环境版本。该文件体积比普通安装包大，仅用于当系统缺少且无法安装 WebView2 环境时使用，当你无法正常打开面板也可以试试这个版本。
    :::

    | 系统架构 | 下载地址 |
    | :---: | :---: |
    | x64 | &lt;GitHubRelease owner=&quot;clash-verge-rev&quot; repo=&quot;clash-verge-rev&quot; mode=&quot;button&quot; label=&quot;安装包&quot; arch=&quot;x64&quot; match=&quot;x64-setup.exe&quot; /&gt; &lt;GitHubRelease owner=&quot;clash-verge-rev&quot; repo=&quot;clash-verge-rev&quot; mode=&quot;button&quot; label=&quot;内置 Webview2 安装包&quot; arch=&quot;x64&quot; match=&quot;x64_fixed_webview2-setup.exe&quot; /&gt; |
    | ARM64 | &lt;GitHubRelease owner=&quot;clash-verge-rev&quot; repo=&quot;clash-verge-rev&quot; mode=&quot;button&quot; label=&quot;安装包&quot; arch=&quot;ARM64&quot; match=&quot;arm64-setup.exe&quot; /&gt; &lt;GitHubRelease owner=&quot;clash-verge-rev&quot; repo=&quot;clash-verge-rev&quot; mode=&quot;button&quot; label=&quot;内置 Webview2 安装包&quot; arch=&quot;ARM64&quot; match=&quot;arm64_fixed_webview2-setup.exe&quot; /&gt; |
====

==== &quot;WinGet&quot;

    通过 Windows 11 自带的包管理器 WinGet 安装：

    \`\`\`
    winget install ClashVergeRev.ClashVergeRev
    \`\`\`
====

==== &quot;Scoop&quot;

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
 irm get.scoop.sh -outfile &#39;install.ps1&#39;
 .\\install.ps1 -ScoopDir &#39;D:\\Scoop&#39; -ScoopGlobalDir &#39;D:\\ScoopGlobal&#39; # 仅作示例，可根据实际需求调整
 \`\`\`

 安装 Clash Verge Rev：

 \`\`\`
 scoop bucket add extras
 scoop install extras/clash-verge-rev
 \`\`\`
====
</code></pre></div></div><div class="vp-tabs" data-id="t1"><div class="vp-tabs-nav"><button class="vp-tabs-tab active" data-i="0">Linux</button></div><div class="vp-tabs-panel active" data-i="0"></div></div>`,4)),e("table",v,[t[2]||(t[2]=e("thead",null,[e("tr",null,[e("th",{style:{"text-align":"center"}},"发行版本"),e("th",{style:{"text-align":"center"}},"下载次数"),e("th",{style:{"text-align":"center"}},"下载地址")])],-1)),e("tbody",null,[e("tr",null,[t[0]||(t[0]=e("td",{style:{"text-align":"center"}},"Github Release 正式版",-1)),e("td",c,[a(o,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showVersion:!1})]),e("td",d,[a(o,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showDownloads:!1})])]),e("tr",null,[t[1]||(t[1]=e("td",{style:{"text-align":"center"}},"Github Release 测试版",-1)),e("td",h,[a(o,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showVersion:!1,prerelease:""})]),e("td",g,[a(o,{owner:"clash-verge-rev",repo:"clash-verge-rev",mode:"badge",showDownloads:!1,prerelease:""})])])])])])}const f=r(u,[["render",p]]);export{R as __pageData,f as default};
