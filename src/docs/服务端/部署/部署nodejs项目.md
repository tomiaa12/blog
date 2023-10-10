# 服务器运行 nodejs 项目

## 安装 lrzsz 上传文件到服务器

:::code-group

```sh[Ubuntu]
sudo apt-get install lrzsz  # 对于基于 Debian 的系统，如 Ubuntu
```

```sh[CentOS]
sudo yum install lrzsz  # 对于基于 CentOS/RHEL 的系统
```

:::

安装完成后，您可以使用以下步骤进行文件上传：

1. 在本地计算机上，打开终端。
2. 使用 rz 命令选择要上传的文件
3. 在选择文件后，文件将被上传到远程服务器的当前目录。

:::tip 注意
如果您的目标是从本地计算机上传文件到服务器，更常见且便捷的方法是使用 scp 命令。scp 命令可以直接在本地计算机上使用，无需在服务器上运行额外的命令。
:::

## 安装 unzip 解压文件

一般项目会打包成压缩包，使用 unzip 解压文件

:::code-group

```sh[Ubuntu/Debian]
sudo apt-get update
sudo apt-get install unzip
```

```sh[CentOS/RHEL]
sudo yum install unzip
```

```sh[Fedora]
sudo dnf install unzip
```

```sh[openSUSE]
sudo zypper install unzip
```

:::

安装完成后，可以在服务器上使用 unzip 命令来解压缩 zip 文件了

## 安装 nvm 管理 nodejs 版本

NVM 是一个方便的工具，可以帮助你在同一台机器上管理和切换不同版本的 Node.js。

1. 安装 NVM

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

2. 安装完成后，重启终端或运行以下命令使 NVM 变为可用

```sh
source ~/.bashrc
```

3. 安装新版本的 Node.js

通过 NVM，你可以安装任何你想要的 Node.js 版本。以下是安装最新 LTS 版本的示例：

```sh
nvm install --lts
```

可以使用以下命令，将 X.Y.Z 替换为你想要的版本号

```sh
nvm install X.Y.Z
```

4. 切换使用的 Node.js 版本：

```sh
nvm use X.Y.Z
```

5. 验证版本更新，确认已经切换到了正确的 Node.js 版本

```sh
node -v
npm -v
```

## pm2 启动 node 项目

- 使用 PM2 运行 Node.js 服务是一种常见的方法，它可以帮助你管理和监控 Node.js 进程。
- 直接使用 node 运行服务时，在报错之后会导致 node 服务停止，pm2 则可以自动拉起应用重新运行。

### 安装 pm2

1. `npm install -g pm2`
2. `rz`上传项目需要的文件
3. 如果是压缩包则使用`unzip`解压
4. `npm i`安装依赖
5. 启动项目：`pm2 start xxx.js`或启动并设置当前项目名`pm2 start xxx.js --name my-node-project`，启动后控制台输出示例如下：

```sh
root:/node-chatgpt-wechat# pm2 start index.js --name node-chatgpt-wechat
[PM2] Starting /node-chatgpt-wechat/index.js in fork_mode (1 instance)
[PM2] Done.
┌────┬────────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                   │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ node-chatgpt-wechat    │ default     │ 0.0.1   │ fork    │ 49505    │ 0s     │ 0    │ online    │ 0%       │ 12.8mb   │ root     │ disabled │
└────┴────────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

### pm2 常用命令

- `pm2 start xxx.js`启动 Node.js 服务
- `pm2 list`监控运行状态
- `pm2 logs <app-name>`查看日志
- `pm2 stop <app-name>`停止进程
- `pm2 restart <appname>` 重启
- `pm2 delete <app-name>`删除进程
- `pm2 stop all`停止所有进程
- `pm2 delete all`删除所有进程
- `pm2 update <app-id-or-name> --name <new-name>`修改应用程序的名称 name，app-id-or-name 是程序的 name 或 pid 值
- 删除日志文件：

```sh
cd ~/.pm2/logs # 进入 PM2 的日志文件目录
rm <log-file-name> # 删除日志文件
```

## 重启服务器后恢复之前的项目

```sh
pm2 resurrect
```
