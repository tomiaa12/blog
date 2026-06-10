# defer

defer 先进后出，在后面的 defer 先执行

return 比 defer 先执行

```go
package main

import "fmt"

func deferFunc() int {
	fmt.Println("defer func called...")
	return 0
}
func returnFunc() int {
	fmt.Println("return func called...")
	return 0
}
func returnAndDefer() int {

	defer deferFunc()
	return returnFunc()
}
func main() {
	//写入defer关键字
	defer fmt.Println("main end1")
	defer fmt.Println("main end2")
	returnAndDefer()
}
```
