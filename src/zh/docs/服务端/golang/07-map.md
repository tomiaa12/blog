# map

## 声明方式

```go
func main() {
	//===> 第一种声明方式

	//声明myMap1是一种map类型 key是string， value是string
	var myMap1 map[string]string
	if myMap1 == nil {
		fmt.Println("myMap1 是一个空map")
	}

	//在使用map前， 需要先用make给map分配数据空间
	myMap1 = make(map[string]string, 10)

	myMap1["one"] = "java"

	//===> 第二种声明方式
	myMap2 := make(map[int]string)
	myMap2[1] = "java"

	//===> 第三种声明方式
	myMap3 := map[string]string{
		"one":   "php",
	}
	fmt.Println(myMap3)
}
```


## 操作

```go
func main() {
	cityMap := make(map[string]string)

	//添加
	cityMap["China"] = "Beijing"
	cityMap["Japan"] = "Tokyo"
	cityMap["USA"] = "NewYork"

	//遍历
	printMap(cityMap)

	//删除
	delete(cityMap, "China")

	//修改
	cityMap["USA"] = "DC"
	ChangeValue(cityMap)

	fmt.Println("-------")

	//是一个引用传递
	printMap(cityMap)
}
```