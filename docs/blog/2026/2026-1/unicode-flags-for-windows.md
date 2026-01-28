# 为 Windows 10 和 11 打补丁以显示 Unicode 国旗表情 🇨🇳

<lc url="https://github.com/tuannvbg/unicode-flags-for-windows" />

让 Unicode 国旗表情（例如 🇻🇳 🇺🇸 🇯🇵 🇫🇷 🇩🇪…）在 Windows 系统中的所有应用程序中正确显示：包括 Notepad、VS Code、Copilot PC 应用、Chrome、Edge、Firefox 等。

## ⚠️ 重要提醒

**在打补丁之前，请先备份原始字体 `Segoe UI Emoji`，以便日后恢复。**

### 🔄 备份方法：

- 打开文件夹 `C:\Windows\Fonts`
- 找到文件 `seguiemj.ttf`
- 复制到安全位置（例如：`E:\FontBackup\seguiemj_original.ttf`）

## ✅ 操作步骤

### 🔹 步骤 1：选择正确的补丁字体版本

| 操作系统     | 使用字体文件               |
|--------------|-----------------------------|
| Windows 10   | `seguiemj_1_31_mod.ttf`     |
| Windows 11   | `Segoe.UI.Emoji.with.Twemoji.Flags.ttf`     |

> 📌 使用正确版本可确保国旗表情显示正常，字符间距合理，无乱码问题。

### 🔹 步骤 2：安装字体

- 打开包含字体的文件夹（例如：`E:\FontEmoji`）
- 右键点击 `.ttf` 文件→选择**安装**
- 📌 如果没有“安装”选项→用字体查看器打开→ 点击右上角的“安装”按钮

### 🔹 步骤 3：将字体复制到系统字体目录（如有需要）

- 以管理员身份打开 PowerShell  
 →按 `Win` 键，输入 `powershell`，右键→**以管理员身份运行**

- 输入以下命令：

```powershell
Copy-Item "E:\FontEmoji\Segoe.UI.Emoji.with.Twemoji.Flags.ttf" -Destination "$env:windir\Fonts" -Force
```

> 根据你的 Windows 版本替换文件名

### 🔹 步骤 4：修改注册表，让 Windows 识别新字体

1. 打开注册表编辑器  
  →按 `Win + R`→输入 `regedit`→回车

2. 导航到以下路径：

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts
```

3. 找到条目：

```
Segoe UI Emoji (TrueType)
```

- 如果存在→双击→修改为：

```
seguiemj_1_33_mod.ttf
```

- 如果不存在→右键→`新建 > 字符串值`

  - 名称：`Segoe UI Emoji (TrueType)`  
  - 值：`Segoe.UI.Emoji.with.Twemoji.Flags.ttf`

### 🔹 步骤 5：重启电脑

- 修改完成后→**重启电脑**以应用新字体

### 🔹 步骤 6：测试国旗表情

尝试输入以下国旗表情：

```
🇨🇳 🇯🇵 🇺🇸 🇧🇷 🇿🇦
```

在以下应用中测试：

- Chrome
- Edge
- Discord
- VS Code
- Copilot PC 应用

→ 如果显示正常：**补丁成功 🎉**

## 📚 示例截图

### 🖼️ Copilot PC 应用
![Copilot PC App](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/Copilot.PC.app.Windows11.Screenshot.2025-09-21.103357.jpg)

### 🖼️ 记事本
![Notepad](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/Notepad.Screenshot.2025-09-21.103618.jpg)

### 🖼️ Visual Studio Code
![VS Code](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/VSC2.Screenshot.2025-09-21.104033.jpg)

### 🖼️ Chrome 浏览器
![Chrome](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/Chrome.Browser.Show.Screenshot.2025-09-21.111129.jpg)

### 🖼️ Microsoft Edge
![Edge](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/Edge.Browser.Show.Screenshot.2025-09-21.111408.jpg)

### 🖼️ Firefox 浏览器
![Firefox](https://raw.githubusercontent.com/tuannvbg/unicode-flags-for-windows/refs/heads/main/screenshots/Firefox.Browser.Screenshot.2025-09-21.183410.jpg)

## 🌐 查看其他语言版本

- 🇻🇳 [Tiếng Việt](https://github.com/tuannvbg/unicode-flags-for-windows/blob/main/guides/windows.vi.md)
- 🇺🇸 [English version](https://github.com/tuannvbg/unicode-flags-for-windows/blob/main/guides/windows.en.md)
- 🇷🇺 [Русская версия](https://github.com/tuannvbg/unicode-flags-for-windows/blob/main/guides/windows.ru.md)