# husky 禁止 git 某个分支合并到另一个分支

## 安装 Husky

```sh
pnpm add husky --dev
# or
npm install -D husky
```

## package.json 添加脚本

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

## 初始化

```sh
npm run prepare
```

## 根目录`.husky`文件夹下创建`post-merge`钩子文件

```sh
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 当前分支的名称
CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# 受保护的分支
PROTECTED_BRANCH_NAME="master"

# 禁止合并的分支
FORBIDDEN_BRANCH_NAME="dev"

if [[ "$CURRENT_BRANCH_NAME" == *"$PROTECTED_BRANCH_NAME"* ]]; then
  if [[ "$GIT_REFLOG_ACTION" == *"$FORBIDDEN_BRANCH_NAME"* ]]; then
    echo "检测到非法合并: ${GIT_REFLOG_ACTION//merge / } ==合并到==> $CURRENT_BRANCH_NAME"
    echo "撤销合并中..."
    $(git reset --merge HEAD@{1})
    echo "已撤销合并 done"
    exit 1
  fi
fi
```