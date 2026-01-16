# GitHubRelease 组件使用指南

一个 VitePress 组件，支持显示 GitHub Release 徽章和下载按钮。

## 📁 安装

1. 将 `GitHubRelease.vue` 放到 `docs/.vitepress/theme/components/`

2. 在 `docs/.vitepress/theme/index.js` 注册：

```js
import DefaultTheme from 'vitepress/theme'
import GitHubRelease from './components/GitHubRelease.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GitHubRelease', GitHubRelease)
  }
}
```

---

## 📖 三种模式

### 模式一：徽章模式 (默认)

显示下载次数 + 版本号徽章：

```md
<GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" />
```

效果：`[@latest 1.4M] [release v2.4.4]`

---

### 模式二：下载按钮模式

显示下载按钮：

```md
<GitHubRelease 
  owner="clash-verge-rev" 
  repo="clash-verge-rev" 
  mode="button" 
  label="安装包" 
  arch="x64" 
  match="x64-setup.exe" 
/>
```

效果：`[安装包 x64]`

---

### 模式三：全部显示

同时显示徽章和按钮：

```md
<GitHubRelease 
  owner="clash-verge-rev" 
  repo="clash-verge-rev" 
  mode="all" 
  label="安装包" 
  arch="x64" 
  match="x64-setup.exe" 
/>
```

---

## 🎯 完整页面示例

```md
# 发布地址

::: warning 注意
Clash Verge Rev 目前仅通过 GitHub Release 发布，请注意辨别。
:::

| 发行版本 | 下载次数 | 下载地址 | 备注 |
|---------|---------|---------|------|
| 正式版 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" /> | | |
| 测试版 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" :prerelease="true" /> | | |

## Windows

| 架构 | 下载地址 |
|:----|:---------|
| x64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="x64" match="x64-setup.exe" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="内置Webview2" arch="x64" match="x64_fixed_webview2" labelColor="#409eff" /> |
| arm64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="安装包" arch="arm64" match="arm64-setup.exe" /> |

## macOS

| 架构 | 下载地址 |
|:----|:---------|
| Intel | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="DMG" arch="x64" match="x64.dmg" /> |
| Apple Silicon | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="DMG" arch="aarch64" match="aarch64.dmg" /> |

## Linux

| 架构 | 下载地址 |
|:----|:---------|
| x64 | <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="AppImage" arch="amd64" match="amd64.AppImage" archColor="#e6a23c" /> <GitHubRelease owner="clash-verge-rev" repo="clash-verge-rev" mode="button" label="deb" arch="amd64" match="amd64.deb" archColor="#409eff" /> |
```

---

## 🔧 全部参数

| 参数 | 类型 | 默认值 | 说明 |
|-----|------|-------|------|
| `owner` | String | **必填** | GitHub 用户名/组织名 |
| `repo` | String | **必填** | 仓库名 |
| `mode` | String | `'badge'` | `'badge'` / `'button'` / `'all'` |
| `prerelease` | Boolean | `false` | 获取预发布版本 |
| `showDownloads` | Boolean | `true` | 显示下载次数徽章 |
| `showVersion` | Boolean | `true` | 显示版本徽章 |
| `tagLabel` | String | `'@latest'` | 自定义标签文字 |
| `label` | String | `'下载'` | 按钮左侧文字 |
| `arch` | String | `''` | 按钮右侧文字 |
| `match` | String | `''` | 文件名匹配，支持 `\|` 分隔 |
| `labelColor` | String | `'#555'` | 左侧背景色 |
| `archColor` | String | `'#67c23a'` | 右侧背景色 |

---

## 🎨 推荐配色

| 用途 | labelColor | archColor |
|-----|-----------|-----------|
| 默认 | `#555` | `#67c23a` |
| 内置版 | `#409eff` | `#67c23a` |
| AppImage | `#555` | `#e6a23c` |
| deb | `#555` | `#409eff` |
| rpm | `#555` | `#f56c6c` |
