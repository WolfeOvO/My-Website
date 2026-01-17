# Clash Verge Rev <ntags color="blue">Windows</ntags> <ntags color="yellow">Linux</ntags>

- GitHub 项目地址：[https://github.com/clash-verge-rev/clash-verge-rev](https://github.com/clash-verge-rev/clash-verge-rev)
- 发布地址：见[下文](#发布面板)

## 下载

<!-- tabs:start -->

=== "Windows" @1

=== "GitHub Release" @2

::: warning
- 如果你不清楚你的电脑系统架构，请下载 ``x64`` 架构文件，目前多数 Windows 电脑使用该架构；
- Windows 7 用户请升级至 Win10/11 或改为使用 Linux 桌面发行版，现版本已经不再支持 Windows 7；
- 带有 ``fix_webview2`` 字样的安装包为内置 WebView2 环境版本。该文件体积比普通安装包大，仅用于当系统缺少且无法安装 WebView2 环境时使用，当你无法正常打开面板也可以试试这个版本。
:::

| 系统架构 | 下载地址 |
| :---: | :---: |
| x64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="x64-setup.exe" /> <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 WebView2 安装包" arch="x64" match="x64_fixed_webview2-setup.exe" /> |
| ARM64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARM64" match="arm64-setup.exe" /> <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置 WebView2 安装包" arch="ARM64" match="arm64_fixed_webview2-setup.exe" /> |

=== "WinGet" @2

通过 Windows 11 自带的包管理器 WinGet 安装：
``` PowerShell
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
``` PowerShell
# See https://github.com/ScoopInstaller/Install#readme
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 
irm get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -ScoopDir 'D:\Scoop' -ScoopGlobalDir 'D:\ScoopGlobal' # 仅作示例，可根据实际需求调整
```

安装 Clash Verge Rev：
``` PowerShell
scoop bucket add extras
scoop install extras/clash-verge-rev
```

=== "Linux" @1

=== "Debian/Ubuntu/Deepin" @2

::: warning
Ubuntu 24.04 需要安装额外依赖，详见[常见问题](https://www.clashverge.dev/faq/linux.html)。
:::

| 系统架构 | 下载地址 |
| :---: | :---: |
| x64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="amd64.deb" /> |
| ARM64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARM64" match="arm64.deb" /> |
| ARMv7 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARMv7" match="armhf.deb" /> |

下载上方 ``.deb`` 包后使用 ``apt`` 安装：
``` Bash
sudo apt install -y ./Clash.Verge_x.x.x-_xxx.deb
```

=== "CentOS/Fedora/SUSE" @2

| 系统架构 | 下载地址 |
| :---: | :---: |
| x64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="x86_64.rpm" /> |
| ARM64 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARM64" match="aarch64.rpm" /> |
| ARMv7 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="ARMv7" match="armhfp.rpm" /> |

下载上方 ``.rpm`` 包后使用 ``dnf`` 或 ``yum`` 安装：
``` Bash
sudo dnf install ./Clash.Verge_x.x.x-_xxx.rpm
sudo yum localinstall ./Clash.Verge_x.x.x-_xxx.rpm
```

=== "Arch Linux/Manjaro/SteamOS" @2

::: warning
不建议在 Manjaro、SteamOS 等 Arch 衍生发行版上使用 ``archlinuxcn`` 仓库。
:::

=== "archlinuxcn" @3

1. 添加 ``[archlinuxcn]`` 仓库；
    1.1. 在 ``/etc/pacman.conf`` 文件中写入下列内容：
    ``` ini
    [archlinuxcn]
    Server = https://mirrors.ustc.edu.cn/archlinuxcn/$arch
    Server = https://mirrors.tuna.tsinghua.edu.cn/archlinuxcn/$arch
    Server = https://mirrors.hit.edu.cn/archlinuxcn/$arch
    Server = https://repo.huaweicloud.com/archlinuxcn/$arch
    ```
    1.2. 在终端运行下列命令：
    ``` Bash
    sudo pacman -S archlinuxcn-keyring
    ```
2. 安装 Clash Verge Rev：
``` Bash
sudo pacman -S clash-verge-rev
```

=== "AUR" @3

=== "paru" @4

1. 安装 paru：
``` Bash
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/paru.git
cd paru
makepkg -si
```

2. 使用 paru 安装 Clash Verge Rev：
``` Bash
paru -S clash-verge-rev-bin # 正式版
paru -S clash-verge-rev-autobuild-bin # 测试版
```

=== "yay" @4

1. 安装 yay：
``` Bash
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
```

2. 使用 yay 安装 Clash Verge Rev：
``` Bash
yay -S clash-verge-rev-bin # 正式版
yay -S clash-verge-rev-autobuild-bin # 测试版
```

<!-- tabs:end -->

## 源代码编译安装

编译构建指南请转到[构建](https://github.com/clash-verge-rev/clash-verge-rev/blob/main/CONTRIBUTING.md)。

请注意区分以下文件清单（以用户量比较多的 Windows 为例）：
``` Plain Text
+--- resources                      #资源目录
  +--- locales                      #语言包
  \--- clash-verge-service.exe      #服务模式主程序
  \--- Country.mmdb
  \--- enableLoopback.exe           #解除UWP应用网络回环限制工具
  \--- geoip.dat
  \--- geosite.dat
  \--- install-service.exe          #服务模式安装程序
  \--- sysproxy.exe                 #系统代理程序
  \--- uninstall-service.exe        #服务模式卸载程序
\--- clash-verge.exe                #主程序
\--- verge-mihomo.exe               #Mihomo核心程序
\--- verge-mihomo-alpha.exe         #Mihomo Alpha 版本
```

## 安装问题

如果安装和使用过程中遇到了问题，请参考文档中的《[常见问题](https://www.clashverge.dev/faq/windows.html)》进行处理。

## 发布面板

> Clash Verge Rev 目前**仅通过 GitHub Release 发布**，请注意辨别。

| 发行版本 | 下载次数 | 下载地址 |
| :---: | :---: | :---: |
| Github Release 正式版 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showVersion="false" /> | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showDownloads="false" /> |
| Github Release 测试版 | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showVersion="false" prerelease /> | <gtl owner="clash-verge-rev" repo="clash-verge-rev" mode="badge" :showDownloads="false" prerelease /> |