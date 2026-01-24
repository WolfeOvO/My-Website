# Clash Mi

<ntags color="blue">Windows</ntags> <ntags color="green">Android</ntags> <ntags color="gray">iOS</ntags> <ntags color="gray">MacOS</ntags> <ntags color="yellow">Linux</ntags> 

<lc url="https://github.com/KaringX/clashmi" />

## 文档

<lc url="https://clashmi.app/" />

<lc url="https://github.com/KaringX/clashmi/blob/main/README.md" />

## 介绍

Clash Mi 是一款跨平台的 Clash/Mihomo 图形化客户端，支持 Windows、Android、iOS、MacOS 和 Linux 多种操作系统，致力于为用户提供简洁易用且功能强大的代理工具。

- **内置 Mihomo 内核**：基于最新且持续更新的 Mihomo (Clash.Meta) 内核，内核及客户端均持续更新维护，放心使用；
- **操作简单**：支持 MetaCubeX 的推荐配置, 内核基于 yaml 配置运行，小白使用机场订阅即可使用；
- **自带 [ZashBoard 面板](https://github.com/Zephyruso/zashboard)**：Web面板，或许你更加熟悉。

## 下载

::: details 系统要求
- **Windows** 10 及以上且仅支持 ARM64；
- **Android** 8 及以上且为 ARMv7 或 ARMv8 架构；
- **iOS** 15 及以上；
- **MacOS** 12 及以上，Apple M 或 Inter 芯片均可；
- **Linux** 所有发型版本但仅支持 ARM64 架构。
:::

作者已[自行提供](https://clashmi.app/download)所有下载链接。

<!-- tabs:start -->

=== "Windows" @1

- 正式版：[安装包](https://dot.clashmi.app/client.html?tag=windows-installer-stable)、[压缩包](https://dot.clashmi.app/client.html?tag=windows-zip-stable)
- 测试版：[安装包](https://dot.clashmi.app/client.html?tag=windows-installer-beta)、[压缩包](https://dot.clashmi.app/client.html?tag=windows-zip-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="压缩包" arch="zip" match="windows_x64.zip" /> | <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="压缩包" arch="zip" match="windows_x64.zip" /> |

=== "Android/HarmonyOS" @1

::: tip
小米/MIUI 用户如遇无法安装的情况，可尝试先关网或打开`飞行模式`和关闭``安全守护``-``增强防护``再安装。
:::

- 正式版：[ARMv8](https://dot.clashmi.app/client.html?tag=android-stable)、[ARMv7](https://dot.clashmi.app/client.html?tag=android-armv7a-stable)
- 测试版：[ARMv8](https://dot.clashmi.app/client.html?tag=android-beta)、[ARMv7](https://dot.clashmi.app/client.html?tag=android-armv7a-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="ARM" match="android_arm.apk" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="ARMv7" match="android_armeabi-v7a.apk" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="ARMv8" match="android_arm64-v8a.apk" /> | <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="ARM" match="android_arm.apk" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="ARMv7" match="android_armeabi-v7a.apk" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="ARMv8" match="android_arm64-v8a.apk" /> |

||~~听作者说 ARMv7 架构的包可以装在电视上😁~~||

=== "苹果设备" @1

=== "iOS (iPhone/iPad)" @2

::: tip
- App Store 正式版和 TestFilght 测试版不可共存，请根据需要选择安装其中一个版本；
- 如果您的账号无法正常下载应用，请尝试港区、美区等**非中国大陆地区账号**，具体内容详见[《Apple ID 账号获取》](/墙外指南/教程/AppleID)。
:::

- App Store 正式版下载：[https://apps.apple.com/us/app/clash-mi/id6744321968](https://apps.apple.com/us/app/clash-mi/id6744321968)
- TestFlight 测试版下载：[https://testflight.apple.com/join/bjHXktB3](https://testflight.apple.com/join/bjHXktB3)

=== "MacOS" @2

- 正式版：[https://dot.clashmi.app/client.html?tag=macos-stable](https://dot.clashmi.app/client.html?tag=macos-stable)
- 测试版：[https://dot.clashmi.app/client.html?tag=macos-beta](https://dot.clashmi.app/client.html?tag=macos-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="dmg" match="macos_universal.dmg" /> | <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="dmg" match="macos_universal.dmg" /> |

=== "Linux" @1

::: tip
**Debian 系/Ubuntu/Arch 系/Fedora**​ 推荐命令行工具，纵享丝滑。详见[《😼优雅地部署、使用基于 Clash/Mihomo 的代理环境》](https://github.com/nelvko/clash-for-linux-install?tab=readme-ov-file)。

服务管理基于 ``systemd``，安装前确认下。
:::

- 正式版：[``deb`` 安装包](https://dot.clashmi.app/client.html?tag=linux-deb-stable)、[``rpm`` 安装包](https://dot.clashmi.app/client.html?tag=linux-rpm-stable)
- 测试版：[``deb`` 安装包](https://dot.clashmi.app/client.html?tag=linux-deb-beta)、[``rpm`` 安装包](https://dot.clashmi.app/client.html?tag=linux-rpm-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="deb" match="linux_amd64.deb" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="rpm" match="linux_amd64.rpm" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="AppImage" match="linux_amd64.AppImage" /> | <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="deb" match="linux_amd64.deb" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="rpm" match="linux_amd64.rpm" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="AppImage" match="linux_amd64.AppImage" /> |

<!-- tabs:end -->

## 发布面板

| 发行版本 | 下载次数 | 下载地址 |
| :---: | :---: | :---: |
| Github Release 正式版 | <gtl owner="KaringX" repo="clashmi" mode="badge" :showVersion="false" /> | <gtl owner="KaringX" repo="clashmi" mode="badge" :showDownloads="false" /> |
| Github Release 测试版 | <gtl owner="KaringX" repo="clashmi" mode="badge" :showVersion="false" prerelease /> | <gtl owner="KaringX" repo="clashmi" mode="badge" :showDownloads="false" prerelease /> |