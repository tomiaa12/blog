# ubuntu doker

## 服务器安装 docker

安装 Docker 的依赖：

安装一些必要的依赖，以便 Docker 可以正常安装：

```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

添加 Docker 的官方 GPG 密钥：

通过以下命令添加 Docker 官方· GPG 密钥，这样系统可以验证 Docker 软件包的来源：

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

添加 Docker 的稳定版本仓库：

使用以下命令将 Docker 官方的 APT 仓库添加到系统中：

```bash
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

安装 Docker：

更新软件包列表后，安装 Docker 引擎：

bash
复制代码

```sh
sudo apt update
sudo apt install docker-ce
```

启动并验证 Docker 是否安装成功：

安装完成后，Docker 服务会自动启动。你可以使用以下命令来检查 Docker 是否正常运行：

bash
复制代码

```bash
sudo systemctl status docker
```

## 常用命令

### 镜像操作

- `docker images`查看镜像
- `docker rmi [image id]`删除镜像
- `docker search [name]`搜索镜像

### 容器

- `docker ps`查看 docker 状态
- `docker run`创建容器
  - `-i`表示运行容器
  - `-t`运行后进入命令行
  - `--name`为创建的容器命名，后面带参数
  - `-v`表示目录映射关系
  - `-d`创建一个守护式容器后台运行
  - `-p`端口映射，前者是宿主端口，后者是容器内端口
- `docker rm [image name/image id]` 删除容器
- `docker stop [image name/image id]`停止容器

- 创建了一个 centos 容器
  `docker run -it --name=mycentos centos:7 /bin/bash`

- 进入容器内
  `docker exec -it [image name] [path]`

- 查看容器信息
  `docker inspect [image name]`

过滤要查看的字段`.Network.IP`
`docker inspect --format='{{.Network.IP}}' [image name]`

## 文件拷贝

- 拷贝文件到容器内 `docker cp [path/fileName] [image id]:[path]`
- 拷贝容器内文件到外面`docker cp [image id]:[path] [path/fileName]`

## 目录挂载

可以在创建容器的时候，将宿主（本机的）目录与容器内目录映射，这样修改本机的文件就会同步影响容器内的文件

`docker run -di -v /当前目录:/容器内目录 --name=mycentos centos:7`

## 创建 mysql

1. 拉取镜像 `docker pull mysql:8.4`
2. 创建`docker run -di --name=mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root mysql:8.4`
3. 进入 mysql `docker exec -it mysql /bin/bash`
4. 登录 mysql `mysql -u root -p` 输入密码
5. `show databases` 查看数据库

<!-- db54dafd9551 -->

## 创建 nginx

1. 拉取镜像 `docker pull nginx:latest`
2. 创建`docker run -di --name=nginx -p 80:80 nginx`
3. 把镜像内的 nginx 配置文件拷贝出来`docker cp nginx:/etc/nginx ./nginx`，如已有配置文件可以拷贝进去到容器内
4. `docker stop nginx` 停止容器
5. `docker rm nginx`删除容器，有 nginx 文件后重新创建容器并且挂载文件映射

以上操作是为了拿到 nginx 配置文件

6. 创建容器，并把当前目录挂载到容器内`docker run -di --name=nginx -p 80:80 -v ./nginx:/etc/nginx nginx`

## 迁移与备份

- 创建一个新的镜像`docker commit [image name] [new image name]`

例：`docker commit redis myredis`
此时查看`docker images`会有一个叫`myredis`的镜像

- 根据新的镜像创建一个新的容器`docker run -di --name=myredis myredis`，--name 后面是容器名，最后的 myredis 是镜像名

### 备份镜像

-o 表示output，打包为 myredis.tar

`docker save -o myredis.tar myredis`

### 恢复镜像

`docker load -i myredis.tar`
