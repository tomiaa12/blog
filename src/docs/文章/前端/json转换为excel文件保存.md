# 前端 json 转换为 excel 文件保存 xlsx

## 安装 npm

`npm i json-convert-xlsx`

## 使用

- 输入

```js
import JsonToXlsx from 'json-convert-xlsx'

const data = [
  { name: "张三", id: "123" },
  { name: "李四", id: "124" },
  { name: "王五", id: "124", age: 12 },
]

new JsonToXlsx(data).download()
// download(fileName?: string)
```

- 输出

`excel.xlsx`

| name | id   | age  |
| ---- | ---- | ---- |
| 张三 | 123  |      |
| 李四 | 124  |      |
| 王五 | 124  | 12   |


## 替换表头

- 输入

```js
import JsonToXlsx from 'json-convert-xlsx'

const data = [
  { name: "张三", id: "123" },
  { name: "李四", id: "124" },
  { name: "王五", id: "124", age: 12 },
]

new JsonToXlsx(data).replaceHeader({name:'姓名',age:'年龄'}).download('FileName')
```

- 输出

`FileName.xlsx`

| 姓名 | id   | 年龄  |
| ---- | ---- | ---- |
| 张三 | 123  |      |
| 李四 | 124  |      |
| 王五 | 124  | 12   |