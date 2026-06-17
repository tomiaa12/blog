Windows 默认没有安装 telnet，有几种替代方案：

**方案一：用 PowerShell 内置命令测试（只测试端口是否通）**

```powershell
Test-NetConnection -ComputerName 127.0.0.1 -Port 8888
```

**方案二：启用 Windows 自带的 Telnet 客户端**

```powershell
# 以管理员身份运行
dism /online /Enable-Feature /FeatureName:TelnetClient
```

启用后就可以用 `telnet 127.0.0.1 8888` 了。

**方案三：用 `nc`（netcat）— 推荐**

PowerShell 没有内置 nc，但可以用以下方式安装：

```powershell
# 用 winget 安装
winget install nmap  # nmap 包含 ncat
```

然后：
```powershell
ncat 127.0.0.1 8888
```

**方案四：最简单 — 直接用 PowerShell 建立 TCP 连接**

```powershell
$client = New-Object System.Net.Sockets.TcpClient("127.0.0.1", 8888)
$stream = $client.GetStream()
$writer = New-Object System.IO.StreamWriter($stream)
$writer.AutoFlush = $true
$writer.WriteLine("hello")
```

对于 IM 系统这种需要交互式输入的场景，推荐**方案二（启用 Telnet）**或安装 **ncat**，体验最接近 Linux 下的使用方式。