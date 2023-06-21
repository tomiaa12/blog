# githubAction 自动化发布部署到服务器

在 github 仓库创建一个自动化配置`new workflows`，创建好的文件会在项目的`.github/workflows/main.yml`出现

将`main.yml`文件内容修改如下：

<<< @/../.github/workflows/main.yml

## github 变量

因为当前仓库是开源的，直接写服务器地址会被看到，所以这里使用的是`github`的变量，可以再仓库的`setting --> Secrets and variables --> Actions`中点击`New repository secret`创建变量名，名为`SERVER_HOST`时参考如下使用

## `secrets.SERVER_PRIVATE_KEY` 的设置

1. 需要在你的服务器运行`ssh-keygen -t rsa -b 4096 -C "你的邮箱"`创建`ssh`
2. 运行`cat .ssh/id_rsa.pub | ssh b@B 'cat >> .ssh/authorized_keys'`，其中`b@B`对应你的服务器登录名与用户名，看控制台当前的用户即可，例如`[root@VM-0-3-centos ~]# `
