# Karing

<nt color="blue">Windows</nt> <nt color="green">Android</nt> <nt color="gray">iOS</nt> <nt color="gray">TVOS</nt> <nt color="gray">MacOS</nt> <nt color="yellow">Linux</nt> 

<lc url="https://github.com/KaringX/karing/" />

## 文档

<lc url="https://karing.app/" />

<lc url="https://github.com/KaringX/karing/blob/main/README_cn.md" />

## 介绍

- 兼容 Clash、V2ray/V2fly、Sing-box、Shadowsocks、Sub、Github 订阅；
- 完全支持 Clash 配置，部分支持 Clash.Meta 配置；
- 一套路由规则应用于多个订阅源, 自动选择高效节点；
- 支持自定义路由规则组、节点组：
    - 为小白用户定制默认路由规则组，开箱即用；
    - 内置 ``geo-ip``、``geo-site``、``acl`` 等[规则集](https://github.com/KaringX/karing-ruleset/)；
- 备份和同步, 一次配置多设备同步：
    - 支持局域网内同步；
    - 支持WebDAV；
    - 支持 zip 文件导入/导出；
- 内置支持[魔改版 Sing-box](https://github.com/KaringX/sing-box) 核心；
- 增加新手模式，配置更简单；
- *计划支持所有平台。*

## 下载

::: details 系统要求
- **Windows** 10 及以上且仅支持 ARM64；
- **Android** 8 及以上且为 ARMv7 或 ARMv8 架构；
- **iOS** 15 及以上；
- **TVOS** 17 及以上；
- **MacOS** 12 及以上，Apple M 或 Inter 芯片均可；
- **Linux** 所有发型版本但仅支持 ARM64 架构。
:::

作者已[自行提供](https://karing.app/download/)所有下载链接。

<!-- tabs:start -->

=== "Windows" @1

- 正式版：[安装包](https://dot.karing.app/client.html?tag=windows-installer-stable)、[压缩包](https://dot.karing.app/client.html?tag=windows-zip-stable)
- 测试版：[安装包](https://dot.karing.app/client.html?tag=windows-installer-beta)、[压缩包](https://dot.karing.app/client.html?tag=windows-zip-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="zip" match="windows_x64.zip" /> | <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="zip" match="windows_x64.zip" />

=== "Android/HarmonyOS" @1

::: tip
- 小米/MIUI 用户如遇无法安装的情况，可尝试先关网或打开`飞行模式`和关闭``安全守护``-``增强防护``再安装；
- 鸿蒙/HarmonyOS 可参考教程[《HarmonyOS 安装 Karing》](https://karing.app/blog/case/harmonyos)。
:::

- 正式版：[ARMv7](https://dot.karing.app/client.html?tag=android-armv7a-stable)、[ARMv8](https://dot.karing.app/client.html?tag=android-stable)
- 测试版：[ARMv7](https://dot.karing.app/client.html?tag=android-armv7a-beta)、[ARMv8](https://dot.karing.app/client.html?tag=android-beta)
- APKPure 下载：[https://apkpure.com/p/com.nebula.karing](https://apkpure.com/p/com.nebula.karing)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="ARM" match="android_arm.apk" /> <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="ARMv7" match="android_armeabi-v7a.apk" /> <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="ARMv8" match="android_arm64-v8a.apk" /> | <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="ARM" match="android_arm.apk" /> <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="ARMv7" match="android_armeabi-v7a.apk" /> <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="ARMv8" match="android_arm64-v8a.apk" />

=== "苹果设备" @1

=== "iOS (iPhone/iPad/TV)" @2

::: tip
- App Store 正式版和 TestFilght 测试版不可共存，请根据需要选择安装其中一个版本；
- 如果您的账号无法正常下载应用，请尝试港区、美区等**非中国大陆地区账号**，具体内容详见[《Apple ID 账号获取》](/墙外指南/教程/AppleID)。
:::

- App Store 正式版下载：[https://apps.apple.com/us/app/karing/id6472431552](https://apps.apple.com/us/app/karing/id6472431552)
- TestFlight 测试版下载：[https://testflight.apple.com/join/RLU59OsJ](https://testflight.apple.com/join/RLU59OsJ)

=== "MacOS" @2

- 正式版：[https://dot.karing.app/client.html?tag=macos-stable](https://dot.karing.app/client.html?tag=macos-stable)
- 测试版：[https://dot.karing.app/client.html?tag=macos-beta](https://dot.karing.app/client.html?tag=macos-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="dmg" march="macos_universal.dmg" /> | <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="dmg" march="macos_universal.dmg" />

=== "Linux" @1

- 正式版：[``Deb`` 安装包](https://dot.karing.app/client.html?tag=linux-deb-stable)、[``RPM`` 安装包](https://dot.karing.app/client.html?tag=linux-rpm-stable)
- 测试版：[``Deb`` 安装包](https://dot.karing.app/client.html?tag=linux-deb-beta)、[``RPM`` 安装包](https://dot.karing.app/client.html?tag=linux-rpm-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="Deb" match="linux_amd64.deb" /> <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="RPM" match="linux_amd64.rpm" /> <gtl owner="KaringX" repo="karing" mode="button" label="安装包" arch="AppImage" match="linux_amd64.AppImage" /> | <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="Deb" match="linux_amd64.deb" /> <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="RPM" match="linux_amd64.rpm" /> <gtl owner="KaringX" repo="karing" :prerelease="true" mode="button" label="安装包" arch="AppImage" match="linux_amd64.AppImage" /> |

<!-- tabs:end -->

## 发布面板

| 发行版本 | 下载次数 | 下载地址 |
| :---: | :---: | :---: |
| Github Release 正式版 | <gtl owner="KaringX" repo="karing" mode="badge" :showVersion="false" /> | <gtl owner="KaringX" repo="karing" mode="badge" :showDownloads="false" /> |
| Github Release 测试版 | <gtl owner="KaringX" repo="karing" mode="badge" :showVersion="false" prerelease /> | <gtl owner="KaringX" repo="karing" mode="badge" :showDownloads="false" prerelease /> |