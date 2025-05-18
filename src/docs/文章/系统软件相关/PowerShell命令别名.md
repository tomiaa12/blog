# PowerShell 中设置快捷命令别名

在 PowerShell 中设置**快捷命令别名**，你可以使用 `Set-Alias` 或自定义函数的方法，下面是具体方法：

---

### ✅ 方法一：临时设置别名（当前 PowerShell 会话有效）

```powershell
Set-Alias gs git status
```

现在你输入 `gs` 就等同于 `git status`。

❗️ 注意：**关闭 PowerShell 之后这个设置会失效**。

---

### ✅ 方法二：永久设置别名（推荐）

你可以把别名写到你的 PowerShell 配置文件里。

#### ① 首先检查配置文件是否存在：

```powershell
Test-Path $PROFILE
```

#### ② 如果不存在就创建一个：

```powershell
New-Item -ItemType File -Path $PROFILE -Force
```

#### ③ 打开配置文件：

```powershell
notepad $PROFILE
```

#### ④ 添加你想要的别名，例如：

```powershell
Set-Alias gs git status
Set-Alias ll Get-ChildItem
Set-Alias .. Set-Location ..
```

你还可以写函数作为别名：

```powershell
function serve { npm run dev }
function ports { netstat -aon | findstr :$args }
```

保存后重启 PowerShell，别名就永久生效了！

---

### ✅ 补充说明

| 命令        | 说明                             |
| ----------- | -------------------------------- |
| `Set-Alias` | 设置简单别名                     |
| 自定义函数  | 适合复杂命令                     |
| `$PROFILE`  | 当前用户 PowerShell 启动配置文件 |

---

### ✅ 创建自定义函数

你可以通过以下步骤在 PowerShell 中创建一个快捷命令别名或自定义函数来运行 `git commit -m "这是自定义内容"` 命令：

1. **添加自定义函数**：

```powershell
function c {
  [CmdletBinding()]
  param(
    # 把所有“剩余”的位置参数都收进来，合成一个 string[]
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Message
  )

  # 拼成一句话
  $commitMessage = $Message -join ' '
  # Write-Host "`"$commitMessage`""  # 用来调试你到底收到什么
  git add .
  git commit -m $commitMessage
}
```

这样，当你在 PowerShell 中输入 `c` 时，会执行 `git commit -m "默认内容"`，你还可以传递自定义的提交信息，例如：

```powershell
c "我的自定义提交信息"
```

如果没有传递参数，它将默认提交 `"默认内容"`。
