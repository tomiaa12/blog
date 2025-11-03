# VMware 安装 Linux Ubuntu

## 🧰 一、准备工作

### 1️⃣ 安装 VMware

如果你还没装 VMware：

- 推荐下载 **VMware Workstation Pro** 或 **VMware Workstation Player**（免费版）。
- 官方网站：[https://www.vmware.com](https://www.vmware.com)

安装完成后，**重启电脑**一次。

---

### 2️⃣ 下载 Ubuntu 镜像（ISO 文件）

✅ 纯命令行版本：直接装 Ubuntu Server 版（推荐）

去官网下载：
👉 https://ubuntu.com/download/server

选择 ubuntu-24.04-live-server-amd64.iso

有 UI 版本： Ubuntu 官网下载：
👉 [https://ubuntu.com/download/desktop](https://ubuntu.com/download/desktop)

建议下载版本：

- **Ubuntu 24.04 LTS**（长期支持版，稳定）
- 文件名类似：`ubuntu-24.04.1-desktop-amd64.iso`
- 大约 5GB 左右。

---

#### 在现有 Desktop 上卸载 GUI

```sh
sudo apt remove --purge ubuntu-desktop gnome-shell gdm3
sudo apt autoremove
sudo systemctl set-default multi-user.target
sudo reboot
```

#### 在 server 版本想恢复 UI

```sh
sudo apt install ubuntu-desktop
sudo systemctl set-default graphical.target
sudo reboot
```

## 💽 二、在 VMware 里创建虚拟机

### 1️⃣ 打开 VMware → 点击「**创建新的虚拟机**」

- 选择：**典型（推荐）**
- 点击「下一步」

---

### 2️⃣ 选择安装介质

- 选择 **“稍后安装操作系统 (I will install the operating system later)”**
- 点击「下一步」

---

### 3️⃣ 选择操作系统类型

- 操作系统：**Linux**
- 版本：**Ubuntu 64-bit**
- 点击「下一步」

---

### 4️⃣ 设置虚拟机名称与保存位置

- 名称：`Ubuntu`
- 存放路径：例如 `D:\VM\Ubuntu`
- 点击「下一步」

---

### 5️⃣ 设置磁盘大小

- 建议：**40GB**
- 选择「将虚拟磁盘存储为单个文件」
- 点击「下一步」→ 「完成」

---

## ⚙️ 三、加载 Ubuntu 镜像并启动安装

### 1️⃣ 点击刚创建的虚拟机 → 「编辑虚拟机设置」

- 找到「CD/DVD (SATA)」
- 选择「使用 ISO 映像文件」
- 浏览并选择刚刚下载的 `ubuntu-24.04.1-desktop-amd64.iso`
- 点击「确定」

---

### 2️⃣ 启动虚拟机

点击 **“开启此虚拟机”**
等待片刻，你会看到 Ubuntu 的启动界面。

---

## 🧩 四、Ubuntu 安装步骤

1️⃣ 选择语言 → 中文（简体）
2️⃣ 点击「安装 Ubuntu」
3️⃣ 选择键盘布局：中文 → 默认即可
4️⃣ 安装类型：选择「正常安装」
5️⃣ 分区：直接选「擦除磁盘并安装 Ubuntu」（虚拟机不会影响你的 Windows）
6️⃣ 时区：Asia/Shanghai
7️⃣ 用户名和密码随意设置（记住密码！）

安装过程约 10~20 分钟，安装完点击「重启」。

---

## 🌈 五、安装后建议操作

1️⃣ 登录系统后，可以打开终端输入：

```bash
sudo apt update && sudo apt upgrade -y
```

更新系统。

2️⃣ 如果需要中文界面：

```bash
sudo apt install language-pack-zh-hans
```

3️⃣ 重启后 Ubuntu 就可以流畅使用了 🎉

---

## 💡 小贴士

| 项目 | 建议设置                               |
| ---- | -------------------------------------- |
| 内存 | 至少 4GB（建议 8GB）                   |
| CPU  | 2 核以上                               |
| 磁盘 | 40GB 起                                |
| 网络 | 选择「桥接模式」可以与主机在同一局域网 |

---

## 看是否有网络

非常实用的问题 👍，在 Ubuntu（无论是 Desktop 还是 Server）里，
要判断是否有网络，可以用以下几种方法 👇

---

### 🧩 一、最简单的方式：`ping`

#### ✅ 1. 测试能否访问外网

```bash
ping -c 4 baidu.com
```

如果你看到类似：

```
64 bytes from 220.181.57.216: icmp_seq=1 ttl=52 time=45.2 ms
```

✅ 表示网络 **正常连接外网**。

如果提示：

```
ping: unknown host baidu.com
```

说明 **DNS 解析有问题**（网络配置不正确或未联网）。

---

#### ✅ 2. 测试能否访问 IP（跳过 DNS）

```bash
ping -c 4 8.8.8.8
```

* 如果能 ping 通 `8.8.8.8`（Google DNS），说明网络通，但可能 **DNS 没配置好**。
* 如果也 ping 不通，说明 **网卡或虚拟机网络没连通**。

---

### 🧭 二、查看网络接口状态：`ip` 命令

```bash
ip addr
```

或简写：

```bash
ip a
```

你会看到类似：

```
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.105/24 brd 192.168.1.255 scope global dynamic ens33
```

重点看：

* `ens33` 是你的虚拟网卡。
* `inet 192.168.x.x` 表示已经有 IP 地址 ✅。
* 如果没有 `inet` 一行（只有 `LOOPBACK`），表示 **没有网络连接**。

---

### 🧰 三、查看路由是否存在

```bash
ip route
```

正常会输出类似：

```
default via 192.168.1.1 dev ens33 proto dhcp metric 100
```

说明：

* 默认网关是 `192.168.1.1`
* 说明网络路由配置正常 ✅。

---

### 🧱 四、如果没有网络，可能原因：

| 原因              | 解决方法                                          |
| --------------- | --------------------------------------------- |
| VMware 网络模式设置错误 | 打开虚拟机 → 设置 → 网络适配器 → 选择「桥接模式」或「NAT 模式」        |
| 网卡没启用           | 命令：`sudo systemctl restart NetworkManager`    |
| 没获取到 IP         | 命令：`sudo dhclient -v`（重新申请 IP）                |
| DNS 解析失败        | 编辑 `/etc/resolv.conf` 添加：`nameserver 8.8.8.8` |

---

### 💡 小提示：

* **桥接模式（Bridge）**：Ubuntu 会直接在你电脑所在的局域网里拿到一个 IP（像是独立电脑）。
* **NAT 模式**：Ubuntu 通过 Windows 的网络共享上网（通常最稳定）。
* **仅主机模式（Host-only）**：只能和宿主机通信，不能上网 ❌。

---

你现在想要我帮你具体看一下 VMware 该选哪种网络模式（桥接 / NAT）最合适吗？我可以告诉你对应的配置步骤。


## 本机使用 ssh 连接到 Ubuntu

**VMware 虚拟机里的 Ubuntu 本质上就是一台「本地服务器」**。
所以 ——
💡 **你完全可以用 Tabby、Xshell、Windows Terminal 等 SSH 工具远程连接进去使用，不需要每次都点 VMware 的窗口！**

---

### 🧩 一、VMware 是否要一直开？

要看你怎么用：

| 情况                         | VMware 是否要开          |
| -------------------------- | -------------------- |
| 你只是想用 Ubuntu（命令行 / SSH 登录） | ✅ 需要开虚拟机（但可以最小化）     |
| 你关掉 VMware                 | ❌ Ubuntu 就相当于关机，无法连接 |

> VMware 就是“开机按钮”，Ubuntu 必须在运行中才能连上。

---

### 🧭 二、实现「像连服务器一样」SSH 连接 Ubuntu 的方法

#### 步骤 1️⃣：确认 Ubuntu 有 IP 地址

在 Ubuntu 终端执行：

```bash
ip a
```

找到一行类似：

```
inet 192.168.88.129/24 brd 192.168.88.255 scope global dynamic ens33
```

👉 记下这个 IP，比如 `192.168.88.129`

---

#### 步骤 2️⃣：确认网络模式（建议 NAT 或 桥接）

在 VMware 虚拟机设置里：

* 打开「虚拟机设置」→「网络适配器」
* 选择：

  * **NAT 模式**（推荐，自动联网）
  * 或 **桥接模式**（和宿主机在同一网段）

> ❌ 「仅主机模式（Host-only）」 不能上网。

---

#### 步骤 3️⃣：在 Ubuntu 里启用 SSH 服务

默认 Desktop 版没装 SSH，执行：

```bash
sudo apt update
sudo apt install openssh-server -y
```

安装完成后启用：

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

确认运行中：

```bash
sudo systemctl status ssh
```

出现 `active (running)` ✅ 表示 SSH 服务已启动。

---

#### 步骤 4️⃣：在 Windows 用 Tabby / Xshell 连接

打开 Tabby → 新建连接：

* 协议：SSH
* 主机名：Ubuntu 的 IP（例如 `192.168.88.129`）
* 用户名：你 Ubuntu 登录的用户名
* 密码：Ubuntu 的登录密码

点「连接」即可 🎉
之后你就可以：

* 使用鼠标右键粘贴命令；
* 调整字体；
* 多标签切换多个终端；
* 不需要 VMware 窗口了！

---

### 💡 三、可选优化

| 功能          | 命令                                     |           |
| ----------- | -------------------------------------- | --------- |
| 开机自动启动 SSH  | `sudo systemctl enable ssh`            |           |
| 查看端口（默认 22） | `sudo netstat -tlnp                    | grep ssh` |
| 防火墙放行 SSH   | `sudo ufw allow 22 && sudo ufw enable` |           |

---

### 🌈 结论

✅ 你只需：

1. 在 VMware 里开机 Ubuntu
2. 启动 SSH 服务
3. 用 Tabby 连接 IP

## 设置root 的密码

默认情况下，Ubuntu **禁止 root 账号直接 SSH 登录**，需要你先设置密码并修改 SSH 配置。

---

### 🧩 一、设置 root 密码

先切换到 root 用户：

```bash
sudo su
```

然后为 root 设置密码：

```bash
passwd
```

输入两次你想要的密码。
（没有显示是正常的，Linux 输入密码时不会显示星号。）

设置完成后可以退出 root：

```bash
exit
```

---

### 🧭 二、修改 SSH 配置文件允许 root 登录

用管理员权限编辑 SSH 配置：

```bash
sudo vi /etc/ssh/sshd_config
```

找到（或搜索）以下几行：

```
#PermitRootLogin prohibit-password
```

改成：

```
PermitRootLogin yes
```

如果找不到这一行，可以在文件底部手动加上。

设置完成后需要重启

```bash
reboot # 重启服务器
```
---

## ⚙️ 三、保存并重启 SSH 服务

按下：

> `esc` → `:wq` 回车保存

然后执行：

```bash
sudo systemctl restart ssh
```

---

## 🌐 四、测试 SSH 登录

现在可以在你的 Windows 上（比如 Tabby / Xshell）用：

* 主机：Ubuntu 的 IP（`hostname -I` 可查看）
* 用户名：`root`
* 密码：刚设置的 root 密码

进行登录。

---

## 🧱 五、防火墙（如没放行端口）

如果你启用了防火墙，请确保 SSH 端口（22）已放行：

```bash
sudo ufw allow 22
sudo ufw enable
```

---

## 🔒 可选：增强安全性（建议）

如果你只是临时练习用 root 登录，可以保持上面的配置。
但如果未来你打算长期用 Ubuntu 做服务器，建议：

* 之后禁用 root SSH 登录；
* 使用普通用户 + SSH key 登录。

---

✅ **总结**

| 步骤         | 命令                               | 说明                       |
| ---------- | -------------------------------- | ------------------------ |
| 设置 root 密码 | `sudo passwd root`               | 启用 root 账号               |
| 编辑 SSH 配置  | `sudo nano /etc/ssh/sshd_config` | 修改 `PermitRootLogin yes` |
| 重启 SSH     | `sudo systemctl restart ssh`     | 让配置生效                    |
| 防火墙放行      | `sudo ufw allow 22`              | 放通 SSH                   |
| 查看 IP      | `hostname -I`                    | 用于连接                     |

---
