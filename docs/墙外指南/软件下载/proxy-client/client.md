# 客户端（代理软件）

::: info 提示
若下载速度过慢或无法下载，请阅读[《加速 GitHub 下载》](/墙外指南/教程/加速GitHub下载)一文。
:::

## 免客户端翻墙

- [https://github.com/bannedbook/fanqiang](https://github.com/bannedbook/fanqiang)（[GitBook 分站](https://fanqiang.gitbook.io/fanqiang)）
- [https://github.com/Alvin9999-newpac/fanqiang](https://github.com/Alvin9999-newpac/fanqiang)

## 客户端导航
- 虚空终端：[https://wiki.metacubex.one/](https://wiki.metacubex.one/)
- [科技分享](https://kejifenxiang.com/)：[https://kejifenxiang.com/tools](https://kejifenxiang.com/tools)
- [SubConverter](https://subconverter.org/clients/)：[https://subconverter.org/clients/](https://subconverter.org/clients/)
- [V2RaySSR 综合网](https://v2rayssr.com/)：[https://v2rayssr.com/vpn-client.html](https://v2rayssr.com/vpn-client.html)
- 全平台翻墙工具：[https://binghe.gitbook.io/quan-ping-tai-fan-qiang-gong-ju/](https://binghe.gitbook.io/quan-ping-tai-fan-qiang-gong-ju/)
- [机场推荐](https://jichangtuijian.com/)：[https://jichangtuijian.com/proxyclient.html](https://jichangtuijian.com/proxyclient.html)
- [找梯子啊](https://findladders.com/)：[https://findladders.com/clients/](https://findladders.com/clients/)

## Android 系统架构区别

- ``armv8 (ARMv8)``、``arm64-v8a (ARM64-v8a)``、``aarch64``：ARM 64位架构，适用于目前所有主流设备；
- ``armv7 (ARMv7)``、``arm32-v7a (ARM32-v7a)``、``armeabi-v7a``：ARM 32位架构，适用于较旧的设备；
- ``x86``、``x86_64``：Intel/AMD 架构，多用于模拟器，极少数设备搭载该架构。``x86`` 为 32 位，``x86_64`` 为 64 位。

## Windows 架构详细说明

<ai media="text" model="gemini" type="generated" text="请注意进行多方查证甄别真实性。" />

::: details 字太多就不展开了，自己点开看看吧……
既然你要求「列出所有内容并详细介绍」，那么我们将不仅仅局限于目前的 Intel vs. ARM 对比，而是从计算机工程和 Windows 历史发展的角度，深入剖析 Windows 曾经支持过、正在支持以及通过特殊技术兼容的所有架构体系。

Windows 操作系统（特别是 Windows NT 内核）在设计之初就具备高度的「可移植性」（Portability），通过硬件抽象层（HAL）隔离底层差异。因此，Windows 历史上运行过的架构非常多。

以下是 Windows 电脑架构的**完整全景图**：

---

<h3>第一部分：现代主流架构 (Current Mainstream)</h3>

这是你现在去商店能买到的电脑所使用的架构：

<h4>1. x86 (32-bit) / IA-32</h4>

- **全称**：Intel Architecture 32-bit
- **状态**：**逐渐淘汰**（Windows 11 已不再发布 32 位版本，但 Windows 10 及更早版本仍支持）。
- **技术细节**：
    - 基于 Intel 80386 确立的标准。
    - **寄存器**：32位通用寄存器（EAX, EBX, ECX 等）。
    - **内存寻址**：理论最大寻址空间为 4GB ($2^{32}$)。虽然通过 PAE (物理地址扩展) 技术可以支持更多物理内存，但单个进程只能使用 2GB 或 3GB 用户空间。
    - **指令集特点**：CISC（复杂指令集）。指令长度可变。
    - **适用场景**：老旧的工业电脑、ATM 机、早期上网本。

<h4>2. x86-64 / x64 / AMD64</h4>

- **全称**：x86-64 (AMD64 / Intel 64)
- **状态**：**绝对霸主**（目前的行业标准）。
- **历史冷知识**：这个架构是 **AMD** 发明的（所以叫 AMD64），后来 Intel 被迫跟进并授权使用（称为 Intel 64）。
- **技术细节**：
    - 是 x86 的 64 位扩展，向后兼容 32 位 x86 代码。
    - **寄存器**：64 位通用寄存器（RAX, RBX...）以及增加了 R8-R15 等新寄存器。
    - **内存寻址**：理论支持 16 EB（Exabytes）内存，目前的 Windows 专业版通常限制在 2TB - 6TB 左右，彻底解决了内存瓶颈。
    - **安全特性**：引入了 NX Bit (No-Execute) 防止缓冲区溢出攻击。
- **适用场景**：95% 以上的家用电脑、游戏本、工作站、服务器。

<h4>3. ARM64 / AArch64 (Windows on ARM)</h4>

- **全称**：ARM Architecture 64-bit
- **状态**：**快速上升期**（微软和高通重点发力的未来方向）。
- **技术细节**：
    - 基于 **RISC**（精简指令集）。指令长度通常固定，译码效率高。
    - **SoC 设计**：也就是 System on Chip。CPU、GPU、NPU（神经处理单元）、基带通常封装在一起，内存通常直接焊死在主板或封装在芯片旁（Unified Memory），以此降低延迟。
    - **大小核架构 (big.LITTLE)**：拥有高性能核心（Performance Cores）和高能效核心（Efficiency Cores），这也是其续航极长的物理基础。
- **适用场景**：Copilot+ PC、Surface Pro X/11、主打 AI 和长续航的轻薄本。

---

<h3>第二部分：中间层与兼容架构 (Emulation & Compatibility)</h3>

Windows 最强大的地方在于：即便硬件架构变了，它也能通过软件让旧程序跑起来。这些是「虚拟」的架构层。

<h4>1. WOW64 (Windows on Windows 64)</h4>

- **功能**：让 **32位 x86 软件** 运行在 **64位 x64 系统** 上。
- **原理**：当你在 64 位 Windows 上运行一个老游戏（如《红警2》）时，系统会加载 `wow64.dll` 等库，将 32 位的系统调用（System Calls）「翻译」成 64 位调用传给内核。
- **重要性**：没有它，你的新电脑就玩不了旧游戏，用不了旧软件。

<h4>2. ARM 上的 x86/x64 模拟器 (Prism / CHPE)</h4>

- **功能**：让 **传统 Intel/AMD 软件** 运行在 **ARM 芯片** 上。
- **Windows 10 ARM**：只能模拟 32位 x86 软件。
- **Windows 11 ARM**：引入了 **ARM64EC** (Emulation Compatible) 和 **Prism** 转译技术，支持模拟 64位 x64 软件。
- **原理**：类似于苹果的 Rosetta 2，它包含即时编译（JIT）和缓存机制，将 x86 指令块翻译成 ARM64 指令块。
- **限制**：不能模拟内核驱动程序（AVX 指令集支持也有限）。

<h4>4. MSIL / CIL (.NET 架构)</h4>

- **概念**：也就是 C# 或 VB.NET 编译出的 `.exe`。
- **Any CPU**：这类程序不直接包含机器码，而是包含「中间语言」。当你运行它时，CLR (公共语言运行时) 会根据你当前的 CPU（无论是 x64 还是 ARM64）**即时编译**成原生代码。
- **优势**：这是真正的「一次编写，到处运行」。

---

<h3>第三部分：已消亡的历史架构 (The Graveyard of Windows NT)</h3>

Windows NT 内核设计之初是为了支持 RISC 工作站的。以下是 Windows 曾经正式支持，但因市场原因被砍掉的架构。

<h4>1. IA-64 (Itanium / 安腾)</h4>

- **厂商**：Intel & HP
- **特点**：**EPIC** (显式并行指令运算)。Intel 曾以此豪赌未来，认为它会取代 x86。它不兼容 x86（除非通过极慢的模拟）。
- **支持版本**：Windows XP 64-bit Edition (Version 2002/2003), Windows Server 2003/2008 for Itanium.
- **结局**：彻底失败。因为 AMD 推出的 x86-64 (x64) 完美兼容旧软件，性能也不差，安腾被市场抛弃。

<h4>2. DEC Alpha</h4>

- **厂商**：Digital Equipment Corp (DEC)
- **特点**：90年代地球上**速度最快**的处理器，纯 64 位设计（但在 Windows 上运行在 32 位模式）。
- **支持版本**：Windows NT 3.1 到 Windows NT 4.0，甚至 Windows 2000 的早期 Beta 版。
- **结局**：康柏（Compaq）收购 DEC 后终止了该项目，Windows 停止支持。

<h4>3. MIPS (R4000 等)</h4>

- **厂商**：MIPS Technologies
- **特点**：精简指令集的代表。事实上，**Windows NT 的第一行代码是在 MIPS 电脑上写出来的**，而不是 Intel 电脑。
- **支持版本**：Windows NT 3.1 到 NT 4.0。
- **结局**：微软为了减少维护成本，在 Windows 2000 发布前放弃了支持。

<h4>4. PowerPC</h4>

- **厂商**：IBM / Motorola
- **特点**：也就是当年苹果 Mac 使用的架构。IBM 和微软曾合作推出基于 PowerPC 的 ThinkPad（运行 Windows NT）。
- **支持版本**：Windows NT 3.51 和 NT 4.0。
- **结局**：市场占有率太低，被砍掉。

<h4>5. Windows RT (ARM32)</h4>

- **厂商**：Nvidia (Tegra), Qualcomm
- **特点**：微软在 2012 年发布的 Surface RT 使用的架构。这是微软首次尝试 ARM。
- **致命伤**：虽然内核是 Windows，但微软**人为锁死**了系统，禁止运行任何传统的桌面软件（exe），只能装应用商店的 App。它和现在的 "Windows on ARM" 是两回事。
- **结局**：惨败，被废弃。

---

<h3>第四部分：深度技术参数对比表</h3>

以下是从操作系统内核开发角度的对比：

| 特性 | x86 (Legacy) | x64 (Mainstream) | ARM64 (Modern) | IA-64 (Itanium) - 已死 |
| :--- | :--- | :--- | :--- | :--- |
| **指令集类型** | CISC (变长指令) | CISC (变长指令) | RISC (定长指令 4字节) | EPIC (显式并行) |
| **字节序 (Endianness)** | Little-Endian | Little-Endian | Bi-Endian (Windows 强制使用 Little-Endian) | Little-Endian |
| **内存页大小 (Page)** | 4KB (支持 4MB 大页) | 4KB (支持 2MB/1GB 大页) | 4KB (支持 64KB 等多级) | 8KB / 16KB 等 |
| **函数调用约定** | cdecl, stdcall (依赖堆栈) | **FastCall** (前4个参数用寄存器 RCX/RDX/R8/R9) | **AAPCS64** (前8个参数用寄存器 X0-X7) | - |
| **内核态/用户态切换** | 较慢 (Ring 0 - Ring 3) | 优化过 (Syscall 指令) | 极快 (Exception levels EL0/EL1) | - |
| **驱动程序要求** | `.sys` (32位 x86) | `.sys` (64位 x64, 必须有数字签名) | `.sys` (ARM64 专用, 必须签名) | `.sys` (IA-64 专用) |
| **硬件强制兼容性** | 极高 | 极高 | 较低 (依赖 ACPI 表描述硬件) | - |

<h3>总结：我该怎么看？</h3>

1.  **如果你是普通用户/玩家**：你只需要关心 **x64**。这是你目前使用的，也是兼容性最好的。
2.  **如果你追求极致移动体验**：关注 **ARM64** (Snapdragon X Elite)，这是 Windows 的未来变数，类似于 MacBook 的 M 系列芯片体验。
3.  **如果你是考古爱好者**：可以去研究 DEC Alpha 或 Itanium 版本的 Windows，那是 Windows NT 架构「纯洁性」的证明——证明了 Windows 不仅仅是 Intel 的附属品。
:::


## ↓在这里选择客户端~
<sidebar />