# modules

Go Modules 是 Go 1.11+ 的官方依赖管理方式，用来管理项目模块和第三方库版本。

## 使用 Go Modules 初始化项目

### 1. 开启 Go Modules

确保 `GO111MODULE=on`（Go 1.16+ 默认已开启）：

```bash
go env -w GO111MODULE=on
```

或通过 shell 环境变量（写入 `~/.bashrc` 后 `source ~/.bashrc`）：

```bash
export GO111MODULE=on
```

### 2. 初始化项目

项目可以放在任意目录，**不再必须**放在 `$GOPATH/src` 下：

```bash
mkdir -p $HOME/aceld/modules_test
cd $HOME/aceld/modules_test
go mod init github.com/aceld/modules_test
```

生成 `go.mod`：

```go
module github.com/aceld/modules_test

go 1.14
```

### 3. 添加依赖

代码中 `import` 第三方库后，可手动下载：

```bash
go get github.com/aceld/zinx/znet
```

也可在 `go build` / `go run` 时自动下载。

更新后的 `go.mod` 示例：

```go
module github.com/aceld/modules_test

go 1.14

require github.com/aceld/zinx v0.0.0-20200315073925-f09df55dc746 // indirect
```

- `require`：声明依赖的模块及版本
- `// indirect`：间接依赖。例如项目直接 import 的是 `zinx/znet` 包，模块 `zinx` 本身属于间接依赖

### 4. go.sum 文件

依赖下载后会生成 `go.sum`，记录各模块版本的校验和，防止依赖被篡改：

```text
github.com/aceld/zinx v0.0.0-20200315073925-f09df55dc746 h1:TturbcEfboY81jsKVSQtGkqk8FN8ag0TmKYzaFHflmQ=
github.com/aceld/zinx v0.0.0-20200315073925-f09df55dc746/go.mod h1:bMiERrPdR8FzpBOo86nhWWmeHJ1cCaqVvWKCGCdVJ5M=
github.com/golang/protobuf v1.3.3/go.mod h1:vzj43D7+SQXF/4pzW/hwtAqwc6iTitCiVSaWz5IYugw=
```

- `h1:xxx`：模块 zip 包内所有文件的 hash
- `xxx/go.mod h1:xxx`：该版本 `go.mod` 文件的 hash
- 若某依赖没有对应 hash，说明项目实际未用到该依赖

## 修改模块版本依赖

使用 `go mod edit -replace` 替换依赖版本：

```bash
go mod edit -replace=zinx@v0.0.0-20200306023939bc416543ae24=zinx@v0.0.0-20200221135252-8a8954e75100
```

`go.mod` 会新增 `replace` 指令：

```go
module github.com/aceld/modules_test

go 1.14

require github.com/aceld/zinx v0.0.0-20200306023939bc416543ae24 // indirect

replace zinx v0.0.0-20200306023939bc416543ae24 => zinx v0.0.0-20200221135252-8a8954e75100
```

## go mod 命令

| 命令 | 说明 |
| ---- | ---- |
| `go mod init` | 生成 `go.mod` 文件 |
| `go mod download` | 下载 `go.mod` 中声明的所有依赖 |
| `go mod tidy` | 整理依赖：移除未使用的，补充缺失的 |
| `go mod graph` | 查看依赖关系图 |
| `go mod edit` | 编辑 `go.mod`（如 `-replace`） |
| `go mod vendor` | 将依赖导出到 `vendor` 目录 |
| `go mod verify` | 校验模块是否被篡改 |
| `go mod why` | 查看为什么需要某个依赖 |

## 环境变量

通过 `go env -w` 持久化设置，或用 Linux `export` 临时设置：

```bash
go env -w GO111MODULE=on
```

### GO111MODULE

是否开启 Go Modules 模式。Go 1.11 之后建议设为 `on`。

### GOPROXY

第三方依赖的下载代理地址。国内建议配置：

```bash
# 阿里云
go env -w GOPROXY=https://mirrors.aliyun.com/goproxy/

# 七牛云（direct 表示代理没有时回源到 GitHub 等原始地址）
go env -w GOPROXY=https://goproxy.cn,direct
```

### GOSUMDB

校验拉取的第三方库是否完整。默认是国外站点；配置 `GOPROXY` 后通常无需单独设置。

### GOPRIVATE

指定私有仓库，不走代理、不做 checksum 校验：

```bash
# 指定具体仓库
go env -w GOPRIVATE="git.example.com,github.com/aceld/zinx"

# 通配符：example.com 下所有子域名
go env -w GOPRIVATE="*.example.com"
```

`GONOPROXY`、`GONOSUMDB` 可通过设置 `GOPRIVATE` 一并处理。

## 常用配置示例

```bash
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GOPRIVATE="git.example.com"
```

查看当前环境变量：

```bash
go env
go env GOPROXY
```
