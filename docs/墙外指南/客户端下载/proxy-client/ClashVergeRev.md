# Clash Verge Rev

- GitHub 项目地址：[https://github.com/clash-verge-rev/clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)
- 发布地址：[https://github.com/clash-verge-rev/clash-verge-rev/releases/](https://github.com/clash-verge-rev/clash-verge-rev/releases)

=== "Windows" @1

=== "GitHub Release" @2

::: warning
- 如果你不清楚你的电脑系统架构，请下载 ``x64`` 架构文件，目前多数 Windows 电脑使用该架构；
- Windows 7 用户请升级至 Win10/11 或改为使用 Linux 桌面发行版，现版本已经不再支持 Windows 7；
- 带有 ``fix_webview2`` 字样的安装包为内置 Webview2 环境版本。该文件体积比普通安装包大，仅用于当系统缺少且无法安装 WebView2 环境时使用，当你无法正常打开面板也可以试试这个版本。
:::

| 系统架构 | 下载地址 |
| :---: | :---: |
| x64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="x64-setup.exe" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 Webview2 安装包" arch="x64" match="x64_fixed_webview2-setup.exe" /> |
| ARM64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARM64" match="arm64-setup.exe" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 Webview2 安装包" arch="ARM64" match="arm64_fixed_webview2-setup.exe" /> |

=== "WinGet" @2

通过 Windows 11 自带的包管理器 WinGet 安装：
```
winget install ClashVergeRev.ClashVergeRev
```

=== "Scoop" @2

::: warning
这是社区维护的 Scoop 分发，Clash Verge Rev 开发团队不为下游渠道产生的问题提供支持。
:::

::: tip ✏️笔记
对于有**修改配置目录**或**便携版**需求的用户适用。
:::

安装 Scoop：
```
# See https://github.com/ScoopInstaller/Install#readme
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 
irm get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\ScoopGlobal' # 仅作示例，可根据实际需求调整
```

安装 Clash Verge Rev：
```
scoop bucket add extras
scoop install extras/clash-verge-rev
```

=== "Linux" @1

===

| 发行版本 | 下载次数 | 下载地址 |
| :---: | :---: | :---: |
| Github Release 正式版 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showVersion="false" /> | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showDownloads="false" /> |
| Github Release 测试版 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showVersion="false" prerelease /> | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showDownloads="false" prerelease /> |