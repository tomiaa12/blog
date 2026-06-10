# goroutine

- go newTask() 跟 main 的协程是一起执行的
- main 的协程结束，go 开启的子协程都会结束

```go
package main

import (
	"fmt"
	"time"
)

//子goroutine
func newTask() {
	i := 0
	for {
		i++
		fmt.Printf("new Goroutine : i = %d\n", i)
		time.Sleep(1 * time.Second)
	}
}

//主goroutine
func main() {
	//创建一个go程 去执行newTask() 流程
	go newTask()

	fmt.Println("main goroutine exit")

	/*
		i := 0
		for {
			i++
			fmt.Printf("main goroutine: i = %d\n", i)
			time.Sleep(1 * time.Second)
		}
	*/
}
```

## 协程退出

- runtime.Goexit() 调用退出协程，“B”,“A” 都不会输出

```go
package main
import (
	"fmt"
	"time"
)

func main() {
		//用go创建承载一个形参为空，返回值为空的一个函数
		go func() {
			defer fmt.Println("A.defer")

			func() {
				defer fmt.Println("B.defer")
				//退出当前goroutine
				runtime.Goexit()
				fmt.Println("B")
			}()

			fmt.Println("A")
		}()


	//死循环
	for {
		time.Sleep(1 * time.Second)
	}

}
```

下面这种写法 bn 是拿不到返回值的, go 之后的方法是并行的

```go
	bn := go func(a int, b int) bool {
		fmt.Println("a = ", a, ", b = ", b)
		return true
	}(10, 20)
```


