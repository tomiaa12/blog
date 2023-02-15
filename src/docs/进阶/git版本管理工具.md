# git 版本管理工具

## git 项目操作流程

1. `git clone [url]` 克隆项目 / git pull 拉取最新代码
2. `git remote` 查看是否有远程仓库
3. 没有远程仓库 ---> `git remote add [远程仓库名] [远程地址]` 配置远程仓库
4. `git branch -b [新分支名]` 创建新的分支，在新分支上修改代码
5. `git add .` 提交
6. `git commit -m '描述'` 提交
7. `git checkout [分支名]` 切换到要合并的分支
8. `git merge [分支名]` 把修改代码的分支合并到当前分支
9. `git push [远程仓库名] [分支名]` 提交到远程仓库
10. `git branch -d [分支名]` 删除之前修改代码的分支,删之前先 branch 查看

或

1. `git clone [url]` 克隆代码
2. `git checkout [分支名]` 切换到最新的开发分支，如 `git checkou dev`
3. `git checkout -b [分支名]` 将当前分支复制到新的分支进行开发，如`git checkout -b my_dev`

提交代码前先更新远程的代码，但如果当前分支修改了代码没有提交，更新下来的代码可能会导致与当前未提交的代码冲突或被覆盖。

4. `git stash` 将当前修改但未提交的代码弹出
5. `git pull`或`git pull origin [分支名]` 更新代码
6. `git stash pop` 将弹出的代码取出
7. `git add .`
8. `git commit -m '描述'`
9. `git push`

## 配置 ssh

```sh
git config -l                         // 查看配置
git config --system --list            // 查看系统的配置 安装目录 Git\etc\gitconfig
git config --global --list            // 查看用户的配置 用户目录 C:\Users\Administrator\ .gitconfig
git config --global user.name "用户名" // 用户名
git config --global user.email "邮箱"  // 邮箱
// ssh-keygen 生成公钥 C:\Users\Administrator\.ssh 目录 实现免密码登录！
ssh-keygen -t rsa -C '邮箱'            // rsa加密  两个文件 .pub 公共的公钥，另一个私钥
```

## 配置代理

- http/https 代理

```sh
git config --global http.proxy http://127.0.0.1:10809
git config --global https.proxy https://127.0.0.1:10809
```

- socks5 代理

```sh
git config --global http.proxy 'socks5://127.0.0.1:10808'
git config --global https.proxy 'socks5://127.0.0.1:10808'
```

- 取消代理

```sh
git config --global --unset http.proxy
git config --global --unset https.proxy
```

## 建立版本库

```sh
git clone <url> 克隆远程版本库
git init        初始化一个 git 仓库
```

## 分支

```sh
git branch                          查看本地所有分支
git branch -r                       列出所有远程分支
git branch -va                      查看本地+远程所有分支
git checkout [分支名]                切换到某个分支上
git checkout -b [新分支名]           创建新分支并选择到新分支
git branch [分支名]                  新建一个分支，但依然停留在当前分支
git merge [分支名] --no-ff           将分支合并到当前分支上
git branch -D [分支名]               删除分支
git push origin --delete [分支名]    删除远端分支
```

## 修改和提交

```sh
git status            查看当前仓库状态
git diff              查看变更内容
git add [路径]        添加多个文件跟踪
git commit -m '描述'  提交文件到仓库
```

## 远程操作

```sh
git pull                                拉取最新代码合并
git remote                              查看当前项目配置的远程仓库
git remote add [远程仓库名称] [远程地址]  配置远程仓库地址
git push [远程仓库名称] [分支名]          指定分支推送到指定远程仓库
git push [远程仓库名] --delete [分支名]   删除远程分支
git branch -dr [远程仓库名/分支名]        删除远程分支
```

## 版本控制

```sh
// [HEAD表示当前版本 HEAD^上一版本 HEAD^^上上一版本 ..以此类推]
git log                      查看历史提交记录
git log --pretty=oneline     查看历史提交记录[显示信息简化]

git reset --hard HEAD^       回退到上一版本
// git reset --hard '1094a'  回到未来,可以使用未来的版本号前几位数快进

git reflog                   查看记录每次的命令
cat <readme.txt>             查看 readme.txt版本是否被回退
```

## 标签

```sh
git tag                              # 列出所有tag
git tag [tag]                        # 新建一个tag在当前commit
git tag [tag] [commit]               # 新建一个tag在指定commit
git tag -d [tag]                     # 删除本地tag
git push origin :refs/tags/[tagName] # 删除远程tag
git show [tag]                       # 查看tag信息
git push [remote] [tag]              # 提交指定tag
git push [remote] --tags             # 提交所有tag
git checkout -b [branch] [tag]       # 新建一个分支，指向某个tag
```

## 重置为新仓库

1. `git checkout --orphan latest_branch`迁出
2. `git add -A`追踪所有文件
3. `git commit -am "commit message"`填写提交信息
4. `git branch -D master`删除旧分支
5. `git branch -m master`重命名当前分支为主分支
6. `git push -f origin master`强制推送

## Linux 命令

```sh
cd       // 改变目录。
cd ..    // 回退到上一个目录，直接cd进入默认目录
pwd      // 显示当前所在的目录路径。
ls(ll)   // 都是列出当前目录中的所有文件，只不过 ll（两个 ll）列出的内容更为详细。
touch    // 新建一个文件 如 touch index.js 就会在当前目录下新建一个 index.js 文件。
rm       // 删除一个文件, rm index.js 就会把 index.js 文件删除。
mkdir    // 新建一个目录,就是新建一个文件夹。
rm -r    // 删除一个文件夹, rm -r src 删除src目录
rm -rf / // 切勿在Linux中尝试！删除电脑中全部文件！
mv       // 移动文件, mv index.html src index.html 是要移动的文件, src 是目标文件夹,当然, 这样写,必须保证文件和目标文件夹在同一目录下。
reset    // 重新初始化终端/清屏。
clear    // 清屏。
history  // 查看命令历史。
help     // 帮助。
exit     // 退出。
\##      // 表示注释
```
