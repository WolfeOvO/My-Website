# GitHub 代理

## GitHub 代理下载合集



稳定、快速地下载 GitHub Release、Archive、Raw 等文件，支持 [github.com](https://github.com/) 和 [raw.githubusercontent.com](https://raw.githubusercontent.com/) 链接，众多代理合集确保你再也不用担心 GitHub 文件下载问题。

::: details
<h1>稳定下载</h1>

我们搜集了许多代理服务，确保在任何时候都有可用服务。

<h1>实时测试</h1>

我们自动验证代理服务，确保提供最方便快捷的下载服务。

<h1>完全免费</h1>

我们不会收取任何费用，所有代理服务也都是大佬免费提供。
:::

### 使用说明

#### 文件分享

为了方便分享，您可以直接在我们的网址后面附加 GitHub 链接，无需手动输入：

``` uri
https://ghproxylist.com/https://github.com/user/repo/releases/download/tag/file
```

系统会自动识别并处理您的 GitHub 链接，为您生成所有可用的代理下载链接。

<font color="gray">支持 **github.com** 和 **raw.githubusercontent.com** 的所有文件链接。请确保在我们的域名后直接附加完整的 GitHub 链接（注意包含 ``https://``）。</font>

试试点击[这里](https://ghproxylist.com/https://github.com/kamranahmedse/developer-roadmap/blob/master/public/roadmaps/computer-science.png)？

#### 文件下载

**示例：**

- 源码下载:

``` HTTP
https://ghproxylist.com/https://github.com/geekan/MetaGPT/archive/refs/heads/main.zip
```

- Release 源码下载：

``` HTTP
https://ghproxylist.com/https://github.com/langgenius/dify/archive/refs/tags/1.0.1.zip
```

- Release 文件下载：

``` HTTP
https://ghproxylist.com/https://github.com/glanceapp/glance/releases/download/v0.7.7/glance-linux-arm64.tar.gz
```

- Raw 文件下载：

``` HTTP
https://ghproxylist.com/https://raw.githubusercontent.com/FujiwaraChoki/MoneyPrinterV2/main/assets/banner.txt
```

#### 终端/命令行使用

在地址栏输入 GitHub 文件链接，点击一键生成，即可生成多个代理服务器的下载链接，复制链接后就可以在终端/命令行中使用，支持 ``git clone``、``wget``、``curl`` 等命令。

**示例：**

- ``git clone`` 使用示例：

``` Bash
git clone [复制一键生成的链接]
```

- ``wget`` 使用示例：

``` Bash
wget [复制一键生成的链接]
```

- ``curl`` 使用示例：

``` Bash
curl -O [复制一键生成的链接]
```