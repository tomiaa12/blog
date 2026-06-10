# channel

1. make(chan int) 定义一个 channel 管道
2. c <- 666，num := <-c 会有隐式阻塞，一发一收

- <-c 中间不能加空格

```go
package main
import "fmt"

func main() {
	//定义一个channel 管道
	c := make(chan int)

	go func() {
		defer fmt.Println("goroutine结束")

		fmt.Println("goroutine 正在运行...")

		c <- 666 //将666 发送给c
	}()

	num := <-c //从c中接受数据，并赋值给num

	fmt.Println("num = ", num)
	fmt.Println("main goroutine 结束...")
}
```

## channel 缓冲

1. c 变量 channel 缓冲 3 个
2. 存满 3 个后，就会阻塞，等待被取出第一个之后，go 子协程继续执行

```go
package main
import (
	"fmt"
	"time"
)

func main() {
	c := make(chan int, 3) //带有缓冲的channel

	fmt.Println("len(c) = ", len(c), ", cap(c)", cap(c))

	go func() {
		defer fmt.Println("子go程结束")

		for i := 0; i < 4; i++ {
			c <- i
			fmt.Println("子go程正在运行, 发送的元素=", i, " len(c)=", len(c), ", cap(c)=", cap(c))
		}
	}()

	time.Sleep(2 * time.Second)

	for i := 0; i < 4; i++ {
		num := <-c //从c中接收数据，并赋值给num
		fmt.Println("num = ", num)
	}

	fmt.Println("main 结束")
}
```

## 关闭 channel

- close 可以关闭一个 channel
- 如果没有 close，到最后会报错，提示 go 子协程不会再往 c 写入数据，但是还有地方在读取 c

```go
package main

import "fmt"

func main() {
	c := make(chan int)

	go func() {
		for i := 0; i < 5; i++ {
			c <- i
			//close可以关闭一个channel
			close(c)
		}
	}()

	for {
		//ok如果为true表示channel没有关闭，如果为false表示channel已经关闭
		if data, ok := <-c; ok {
			fmt.Println(data)
		} else {
			break
		}
	}

	fmt.Println("Main Finished..")
}
```


- channel不不像⽂文件⼀一样需要经常去关闭，只有当你确实没有任何发送数据了了，或者你想显式的结束range循环之类的，才去关闭channel；
- 关闭channel后，⽆无法向channel 再发送数据(引发 panic 错误后导致接收⽴立即返回零值)；
- 关闭channel后，可以继续从channel接收数据；
- 对于nil channel，⽆无论收发都会被阻塞

### range 不断操作 channel

```go
package main

import "fmt"

func main() {
	c := make(chan int)

	go func() {
		for i := 0; i < 5; i++ {
			c <- i
		}

		//close可以关闭一个channel
		close(c)
	}()

	//可以使用range来迭代不断操作channel
	for data := range c {
		fmt.Println(data)
	}

	fmt.Println("Main Finished..")
}
```

## select


```go
package main

import "fmt"

func fibonacii(c, quit chan int) {
	x, y := 1, 1

  // 一直循环
	for {
		select {
		case c <- x:
			//如果c可写，则该case就会进来
      // 写了之后就会触发fmt.Println(<-c)的可读
			x = y
			y = x + y
		case <-quit:
      // fmt.Println(<-c) 读完之后,上面的case不可写了,就触发了 quit的可读
			fmt.Println("quit")
			return
		}
	}
}

func main() {
	c := make(chan int)
	quit := make(chan int)

	//sub go
	go func() {
		for i := 0; i < 10; i++ {
      // 等待c可读
			fmt.Println(<-c)
		}

    // 写入 0
		quit <- 0
	}()

	//main go
	fibonacii(c, quit)
}
```
