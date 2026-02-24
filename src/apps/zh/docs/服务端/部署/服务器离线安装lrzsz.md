# 服务器离线安装 lrzsz

## 下载 lrzsz 安装包

先找一台能联网的机器下载[点我下载](https://ohse.de/uwe/releases/lrzsz-0.12.20.tar.gz)

## 上传安装包到服务器

`scp -r lrzsz-0.12.20.tar.gz 用户名@服务器IP:/目录`

## 安装

1. cd 到安装包所在目录
2. `tar  zxvf  lrzsz-0.12.20.tar.gz` 解压安装包
3. `cd  lrzsz-0.12.20` 进入解压的目录
4. `./configure --prefix=/usr/local/lrzsz` 配置安装路径
5. `make` 编译
6. `make install` 安装
7. 配置系统命令

- `cd /usr/bin`
- `ln -s /usr/local/lrzsz/bin/lrz rz`
- `ln -s /usr/local/lrzsz/bin/lsz sz`
- 如果`/usr/bin`下已存在，删除

8. 最后输入`rz` 测试文件框是否弹出
9. 最后删除上传的 .gz 安装包和解压的目录即可
