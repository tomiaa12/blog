# nginx 部署前端项目

## 安装 nginx

- 安装`nginx`(linux 系统区分命令的不通):

1. `Ubuntu / Debian`在 Ubuntu 和 Debian 等基于 Debian 的系统上，您可以使用 apt 包管理器来安装 Nginx。
2. `CentOS / RHEL：`在 CentOS 和 Red Hat 等基于 RHEL 的系统上，您可以使用 yum 包管理器来安装 Nginx。

安装完成后，Nginx 会自动启动并运行。您可以通过浏览器访问服务器的 IP 地址来确认 Nginx 是否已成功安装。

:::code-group

```sh[Ubuntu / Debian]
sudo apt update
sudo apt install nginx
```

```sh[CentOS / RHEL]
sudo yum install epel-release   # 安装 EPEL 存储库（如果尚未安装）
sudo yum install nginx
```

:::


## 开机自动启动

```sh
sudo systemctl start nginx # 启动 nginx
sudo systemctl enable nginx # 开机自动启动
```

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

## 配置 nginx

1. 上传文件到服务器，一般在`/www/你的项目名`下(mkdir 命令创建文件夹)
2. 进入 nginx 文件夹下新增配置文件，`cd /etc/nginx/sites-available`
3. 新增配置文件`sudo nano /etc/nginx/sites-available/你的配置文件`，可以再文件中添加如下配置

```nginx
server {
    listen 80; # 要监听的端口
    server_name your_domain.com www.your_domain.com; # 域名

    root /var/www/html;  # 这是您上传的文件所在的目录
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

最后按下 ecs，:wq 保存并退出 4. 添加完成后启用配置文件，添加链接

```sh
sudo ln -s /etc/nginx/sites-available/项目配置文件 /etc/nginx/sites-enabled/
```

5. 测试 nginx 配置是否正确

```sh
sudo nginx -t
```

6. 重启 nginx

```sh
sudo systemctl reload nginx
```

## 端口被占用的情况

1. 检查端口是否被占用，80 为你要查询的端口号

```sh
netstat -tuln | grep 80
# 或者
ss -tuln | grep 80
# 或者
sudo lsof -i :80
# 或者
sudo fuser 80/tcp
```

有被占用可以使用 kill 关闭占用的程序的 pid

```sh
kill <pid>
```
