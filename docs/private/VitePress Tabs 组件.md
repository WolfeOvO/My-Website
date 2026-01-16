# VitePress Tabs 组件

支持多级嵌套、富文本内容的 Tab 组件，样式仿照 VitePress 原生风格。

## 安装

将组件文件复制到你的 VitePress 项目中，例如 `.vitepress/theme/components/` 目录。

## 注册组件

在 `.vitepress/theme/index.js` 中注册：

```js
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import { Tabs, Tab, IconTabs, IconTab, Alert, Button } from './components/vitepress-tabs'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Tabs', Tabs)
    app.component('Tab', Tab)
    app.component('IconTabs', IconTabs)
    app.component('IconTab', IconTab)
    app.component('Alert', Alert)
    app.component('VPButton', Button)
  }
}
```

## 使用方法

### 基础 Tabs

```vue
<Tabs>
  <Tab label="GitHub Release">

这里是 GitHub Release 的内容。

支持 **Markdown** 语法！

  </Tab>
  <Tab label="WinGet">

使用 WinGet 安装：

```bash
winget install your-app
```

  </Tab>
  <Tab label="Scoop">

使用 Scoop 安装...

  </Tab>
</Tabs>
```

### 带图标的 Tabs（适合操作系统选择）

```vue
<IconTabs>
  <IconTab label="Windows" icon="windows">

### Windows 安装指南

下载 `.exe` 安装包并运行...

  </IconTab>
  <IconTab label="Linux" icon="linux">

### Linux 安装指南

使用包管理器安装...

  </IconTab>
  <IconTab label="macOS" icon="macos">

### macOS 安装指南

使用 Homebrew 安装...

  </IconTab>
</IconTabs>
```

**支持的内置图标：** `windows`, `linux`, `macos`, `github`, `npm`, `yarn`, `pnpm`

也可以传入自定义 SVG 字符串作为 `icon` 属性。

### 多级嵌套 Tabs

```vue
<IconTabs>
  <IconTab label="Windows" icon="windows">

<Tabs>
  <Tab label="GitHub Release">

从 GitHub 下载安装包...

| 系统架构 | 下载地址 |
|---------|---------|
| x64     | [安装包 x64](#) |
| arm64   | [安装包 arm64](#) |

  </Tab>
  <Tab label="WinGet">

```bash
winget install your-app
```

  </Tab>
  <Tab label="Scoop">

```bash
scoop install your-app
```

  </Tab>
</Tabs>

  </IconTab>
  <IconTab label="Linux" icon="linux">

Linux 安装内容...

  </IconTab>
</IconTabs>
```

### Alert 提示框

```vue
<Alert type="warning" title="Warning">

- 如果你不清楚你的电脑系统架构，请下载 `x64` 架构文件
- Windows 7 用户请先升级至 Win10/11
- 带有 `fix_webview2` 字样的安装包为内置 WebView2 环境版本

</Alert>

<Alert type="info">
这是一条信息提示
</Alert>

<Alert type="tip">
这是一条小技巧
</Alert>

<Alert type="danger">
这是一条危险警告
</Alert>
```

### Button 按钮

```vue
<VPButton href="https://example.com/download" type="primary" tag="x64">
  安装包
</VPButton>

<VPButton href="#" type="success" tag="arm64">
  内置 Webview2 安装包
</VPButton>
```

**属性：**
- `href`: 链接地址（可选，不传则渲染为 button）
- `type`: `primary` | `secondary` | `success` | `warning` | `danger`
- `size`: `small` | `medium` | `large`
- `tag`: 右侧小标签文字

## 完整示例（模仿图片效果）

```vue
<IconTabs>
  <IconTab label="Windows" icon="windows">

<Tabs>
  <Tab label="GitHub Release">

<Alert type="warning">

- 如果你不清楚你的电脑系统架构，请下载 `x64` 架构文件（目前多数 Windows 电脑使用该架构）。
- Windows 7 用户请先升级至Win10/11，或改为使用Linux桌面发行版，现版本已经不再支持Windows7。
- 带有 `fix_webview2` 字样的安装包为内置 Webview2 环境版本（该文件体积比普通安装包大，仅用于当系统缺少且[无法安装WebView2](https://example.com)环境时使用，当你无法正常打开面板也可以试试这个版本）。

</Alert>

| 系统架构 | 下载地址 |
|---------|---------|
| x64 | <VPButton href="#" type="primary" size="small" tag="x64">安装包</VPButton> <VPButton href="#" type="success" size="small" tag="x64">内置 Webview2 安装包</VPButton> |
| arm64 | <VPButton href="#" type="warning" size="small" tag="arm64">安装包</VPButton> <VPButton href="#" type="success" size="small" tag="arm64">内置 Webview2 安装包</VPButton> |

  </Tab>
  <Tab label="WinGet">

```bash
winget install YourApp
```

  </Tab>
  <Tab label="Scoop">

```bash
scoop bucket add extras
scoop install your-app
```

  </Tab>
</Tabs>

  </IconTab>
  <IconTab label="Linux" icon="linux">

Linux 安装说明...

  </IconTab>
  <IconTab label="macOS" icon="macos">

macOS 安装说明...

  </IconTab>
</IconTabs>
```

## 为什么不用 Markdown 容器语法？

VitePress 的 Markdown 解析器会把 `:::` 容器、标题（`#`）、代码块等解析为独立的块级元素，这会导致：

1. Tab 内容被意外分割到外部
2. 嵌套结构被破坏
3. 难以实现真正的多级嵌套

使用 Vue 组件的方式可以完美避免这些问题，因为 Vue 组件的 slot 内容由 Vue 处理，不会被 Markdown 解析器干扰。

## 注意事项

1. Tab 内容前后需要留空行，确保 Markdown 语法正确解析
2. 嵌套 Tabs 时，内层 Tabs 组件需要正确缩进
3. 在 slot 中使用 Markdown 表格时，表格前后也需要空行
