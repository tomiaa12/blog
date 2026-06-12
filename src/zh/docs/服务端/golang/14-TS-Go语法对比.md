---
title: TypeScript 与 Go 语法对比
description: 通过变量、函数、结构体、接口、泛型、错误处理、并发和模块组织，对比 TypeScript 与 Go 的常见写法。
keywords: TypeScript, Go, Golang, 语法对比, 后端开发, 前端开发
---

<script setup>
import SyntaxCompare from '@/components/SyntaxCompare.vue'
</script>

# TypeScript 与 Go 语法对比

这篇文档用「同一个需求，两种语言写法」的方式对比 TypeScript 和 Go。  
TypeScript 更偏向 JavaScript 生态里的类型增强，Go 更偏向简单、明确、可编译成单个二进制的工程语言。

## 快速对照

| 主题 | TypeScript | Go |
| --- | --- | --- |
| 类型系统 | 结构类型，主要在编译期检查 | 静态类型，编译期检查，接口隐式实现 |
| 变量声明 | `const`、`let`，可显式标注类型 | `var`、`const`、`:=` |
| 对象建模 | `type`、`interface`、`class` | `struct`、`interface`、方法接收者 |
| 错误处理 | `throw` / `try...catch`，也常用 `Result` 风格 | 显式返回 `error` |
| 异步并发 | `Promise`、`async/await`、事件循环 | `goroutine`、`channel`、`context` |
| 模块组织 | `import` / `export`，由打包器或运行时处理 | `package` / `import`，由 Go Module 管理 |

## 基础语法

<SyntaxCompare title="变量声明" description="TypeScript 常用 const / let；Go 在函数内常用 :=，包级变量仍然使用 var。">

<template #ts>

```ts
const name = "kyx"
let count = 1

const age: number = 18
let enabled: boolean = true

count += 1
```

</template>

<template #go>

```go
package main

func main() {
	name := "kyx"
	count := 1

	var age int = 18
	var enabled bool = true

	count += 1
}
```

</template>

<template #notes>

- TypeScript 的 `const` 表示变量绑定不可重新赋值，对象内部属性仍可能可变。
- Go 的 `:=` 只能在函数内部使用，包级变量要用 `var`。
- Go 未使用的局部变量会直接编译报错，这一点比 TypeScript 更严格。

</template>

</SyntaxCompare>

<SyntaxCompare title="函数" description="两者都支持参数和返回值类型；Go 的返回类型写在参数列表之后，也支持多返回值。">

<template #ts>

```ts
function add(a: number, b: number): number {
  return a + b
}

function divide(a: number, b: number): number | undefined {
  if (b === 0) {
    return undefined
  }

  return a / b
}
```

</template>

<template #go>

```go
package main

func add(a int, b int) int {
	return a + b
}

func divide(a int, b int) (int, bool) {
	if b == 0 {
		return 0, false
	}

	return a / b, true
}
```

</template>

<template #notes>

- Go 经常用多返回值表达「结果 + 状态」或「结果 + error」。
- TypeScript 通常用联合类型、抛异常或自定义 `Result` 类型表达失败。

</template>

</SyntaxCompare>

<SyntaxCompare title="条件与循环" description="Go 没有 while，统一使用 for；TypeScript 保留 JavaScript 的 if / for / while 写法。">

<template #ts>

```ts
const scores = [80, 95, 60]

for (const score of scores) {
  if (score >= 90) {
    console.log("优秀")
  } else {
    console.log("继续努力")
  }
}

let i = 0
while (i < 3) {
  i++
}
```

</template>

<template #go>

```go
package main

import "fmt"

func main() {
	scores := []int{80, 95, 60}

	for _, score := range scores {
		if score >= 90 {
			fmt.Println("优秀")
		} else {
			fmt.Println("继续努力")
		}
	}

	i := 0
	for i < 3 {
		i++
	}
}
```

</template>

<template #notes>

- Go 的 `if` 条件不需要小括号，但 `{}` 不能省略。
- Go 用 `for condition` 表达 while，用 `for {}` 表达无限循环。

</template>

</SyntaxCompare>

## 类型建模

<SyntaxCompare title="对象、结构体与方法" description="TypeScript 常用对象类型描述数据结构；Go 用 struct 描述数据，并用接收者给类型绑定方法。">

<template #ts>

```ts
type User = {
  id: number
  name: string
}

function displayName(user: User): string {
  return `${user.id}-${user.name}`
}

const user: User = {
  id: 1,
  name: "kyx",
}
```

</template>

<template #go>

```go
package main

import "fmt"

type User struct {
	ID   int
	Name string
}

func (u User) DisplayName() string {
	return fmt.Sprintf("%d-%s", u.ID, u.Name)
}

func main() {
	user := User{ID: 1, Name: "kyx"}
	_ = user.DisplayName()
}
```

</template>

<template #notes>

- TypeScript 字段大小写不影响可见性；Go 中首字母大写的字段、类型、方法才会导出给其他包使用。
- Go 的方法本质是带接收者的函数，接收者可以是值类型，也可以是指针类型。

</template>

</SyntaxCompare>

<SyntaxCompare title="接口" description="TypeScript 接口通常显式声明实现关系；Go 接口是隐式实现，只要方法集合满足即可。">

<template #ts>

```ts
interface Logger {
  log(message: string): void
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message)
  }
}

function writeLog(logger: Logger) {
  logger.log("hello")
}
```

</template>

<template #go>

```go
package main

import "fmt"

type Logger interface {
	Log(message string)
}

type ConsoleLogger struct{}

func (ConsoleLogger) Log(message string) {
	fmt.Println(message)
}

func writeLog(logger Logger) {
	logger.Log("hello")
}
```

</template>

<template #notes>

- Go 不需要写 `implements`，类型只要拥有接口要求的方法，就自动满足接口。
- TypeScript 的接口还可以描述对象字面量、函数类型和可索引结构，Go 接口主要描述行为。

</template>

</SyntaxCompare>

<SyntaxCompare title="数组、切片与 Map" description="TypeScript 的数组是动态长度；Go 同时区分固定长度数组和动态长度切片。">

<template #ts>

```ts
const names: string[] = ["go", "ts"]
names.push("vue")

const scores = new Map<string, number>()
scores.set("go", 95)
scores.set("ts", 90)

const goScore = scores.get("go")
```

</template>

<template #go>

```go
package main

func main() {
	names := []string{"go", "ts"}
	names = append(names, "vue")

	scores := map[string]int{
		"go": 95,
		"ts": 90,
	}

	goScore, ok := scores["go"]
	_, _ = goScore, ok
}
```

</template>

<template #notes>

- Go 的 `map` 读取时可以接收第二个返回值 `ok`，用于判断键是否存在。
- Go 切片追加元素要接收 `append` 的返回值，因为底层数组可能发生扩容迁移。

</template>

</SyntaxCompare>

<SyntaxCompare title="泛型" description="TypeScript 泛型表达能力更强；Go 泛型更克制，常用于集合、算法和通用数据结构。">

<template #ts>

```ts
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const value = first<number>([1, 2, 3])
```

</template>

<template #go>

```go
package main

func first[T any](items []T) (T, bool) {
	if len(items) == 0 {
		var zero T
		return zero, false
	}

	return items[0], true
}

func main() {
	value, ok := first[int]([]int{1, 2, 3})
	_, _ = value, ok
}
```

</template>

<template #notes>

- Go 用 `any` 表示任意类型，本质上是 `interface{}` 的别名。
- Go 没有 TypeScript 那种复杂的条件类型、映射类型和模板字面量类型。

</template>

</SyntaxCompare>

## 错误处理与并发

<SyntaxCompare title="错误处理" description="TypeScript 常见写法是异常或 Result；Go 的主流写法是显式返回 error 并逐层处理。">

<template #ts>

```ts
function parsePort(value: string): number {
  const port = Number(value)

  if (!Number.isInteger(port)) {
    throw new Error("端口必须是整数")
  }

  return port
}

try {
  const port = parsePort("3000")
  console.log(port)
} catch (error) {
  console.error(error)
}
```

</template>

<template #go>

```go
package main

import (
	"fmt"
	"strconv"
)

func parsePort(value string) (int, error) {
	port, err := strconv.Atoi(value)
	if err != nil {
		return 0, fmt.Errorf("端口必须是整数: %w", err)
	}

	return port, nil
}

func main() {
	port, err := parsePort("3000")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(port)
}
```

</template>

<template #notes>

- Go 的 `error` 是普通返回值，不是异常控制流。
- Go 里看到 `if err != nil` 很正常，它让失败路径更显式。
- TypeScript 项目如果追求显式错误，也可以用 `Result<T, E>` 风格替代异常。

</template>

</SyntaxCompare>

<SyntaxCompare title="异步与并发" description="TypeScript 的 async/await 解决异步流程；Go 用 goroutine 和 channel 表达并发通信。">

<template #ts>

```ts
async function fetchUserName(id: number): Promise<string> {
  const response = await fetch(`/api/users/${id}`)
  const user = await response.json()

  return user.name
}

async function main() {
  const [a, b] = await Promise.all([
    fetchUserName(1),
    fetchUserName(2),
  ])

  console.log(a, b)
}
```

</template>

<template #go>

```go
package main

import "fmt"

func fetchUserName(id int, ch chan<- string) {
	ch <- fmt.Sprintf("user-%d", id)
}

func main() {
	ch := make(chan string, 2)

	go fetchUserName(1, ch)
	go fetchUserName(2, ch)

	a := <-ch
	b := <-ch

	fmt.Println(a, b)
}
```

</template>

<template #notes>

- TypeScript 的并发通常围绕事件循环、Promise 和异步 I/O。
- Go 的 `go fn()` 会启动 goroutine，channel 可以用来传递数据和同步。
- 实际 Go 服务中还会经常配合 `context.Context` 处理超时、取消和请求生命周期。

</template>

</SyntaxCompare>

## 工程组织

<SyntaxCompare title="模块与包" description="TypeScript 通过 import / export 组织模块；Go 通过 package、import 和 go.mod 组织工程。">

<template #ts>

```ts
// math.ts
export function add(a: number, b: number): number {
  return a + b
}

// main.ts
import { add } from "./math"

console.log(add(1, 2))
```

</template>

<template #go>

```go
// math/math.go
package math

func Add(a int, b int) int {
	return a + b
}

// main.go
package main

import (
	"fmt"

	"example.com/app/math"
)

func main() {
	fmt.Println(math.Add(1, 2))
}
```

</template>

<template #notes>

- Go 通过标识符首字母大小写控制导出：`Add` 可导出，`add` 仅包内可见。
- TypeScript 的路径解析受 `tsconfig.json`、运行时和打包器共同影响；Go 主要由 `go.mod` 的 module path 决定。

</template>

</SyntaxCompare>

## 学习迁移建议

如果你已经熟悉 TypeScript，学习 Go 时可以重点关注这些差异：

- 不要把 Go 的 `interface` 当成 TypeScript 的 `interface` 完全等价物，Go 的接口更偏行为抽象。
- Go 没有类继承，常用 `struct + method + interface + composition` 组合能力。
- Go 错误处理更显式，优先理解 `error`、`fmt.Errorf("%w")` 和错误包装。
- Go 并发不是 `Promise.all` 的语法替代，而是一套围绕 goroutine、channel、context 的模型。
- Go 工程里命名、包边界、导出规则很重要，首字母大小写会直接影响 API 可见性。
