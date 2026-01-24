# Karing

<ntags color="blue">Windows</ntags> <ntags color="green">Android</ntags> <ntags color="gray">iOS</ntags> <ntags color="gray">TVOS</ntags> <ntags color="gray">MacOS</ntags> <ntags color="yellow">Linux</ntags> 

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
- 内置支持[魔改版 sing-box](https://github.com/KaringX/sing-box) 核心；
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

作者已[自行提供](https://clashmi.app/download)所有下载链接。

<!-- tabs:start -->

=== "Windows" @1

- 正式版：[安装包](https://dot.karing.app/client.html?tag=windows-installer-stable)、[压缩包](https://dot.karing.app/client.html?tag=windows-zip-stable)
- 测试版：[安装包](https://dot.karing.app/client.html?tag=windows-installer-beta)、[压缩包](https://dot.karing.app/client.html?tag=windows-zip-beta)

| 正式版 | 测试版 |
| :---: | :---: |
| <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="clashmi" mode="button" label="安装包" arch="exe" match="windows_x64.zip" /> | <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="exe" match="windows_x64.exe" /> <gtl owner="KaringX" repo="clashmi" :prerelease="true" mode="button" label="安装包" arch="exe" match="windows_x64.zip" />

=== "Android/HarmonyOS" @1

- 正式版：[ARMv7](https://dot.karing.app/client.html?tag=android-armv7a-stable)、[ARMv8](https://dot.karing.app/client.html?tag=android-stable)
- 测试版：[ARMv7](https://dot.karing.app/client.html?tag=android-armv7a-beta)、[ARMv8](https://dot.karing.app/client.html?tag=android-beta)

<!-- tabs:end -->