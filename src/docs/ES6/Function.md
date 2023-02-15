# JavaScript ES6 Function 箭头函数

## 传参

```js
// 默认参数
// 使用默认参数时，不能有同名形参
function fn(name,age=17){
 console.log(name+","+age);
}

function f(...values){ // [1, 2]
  console.log(values.length); // 2
}
f(1,2); // 2
```
## 箭头函数

- 与一般函数区别
  - 先声明后使用
  - 不能使用 arguments ,使用 ...rest 剩余运算符解决
  - 不能 new 当做构造函数
- 简写
   - 只有一个形参时可以省略圆括号
  - 只有一条语句，且把这条语句当做返回值时可以省略大括号
- this 指向
  - this指向上一层函数的 this
  - 箭头函数的当前调用者不能使用call，apply、bind改变this指向
- 不适用场景
  - 对象中的方法不适用箭头函数
   - DOM绑定事件不适用箭头函数

## 箭头函数不适用的场景：
  1. 对象中的方法不能用箭头函数；
  2. 给 DOM 绑定事件时不能用箭头函数；

```html
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        let obj = {
            "usr": "李四",
            test: () => {
                console.log(this.usr);
            },
            test2() {
                console.log(this.usr);
            }
        };

        obj.test(); //undefined
        obj.test2();
    </script>
</head>

<body>
    <button>测试</button>
    <script>
        let btn = document.getElementsByTagName('button')[0];
        // btn.addEventListener('click', function() {
        //     console.log(this);
        // });

        btn.addEventListener('click', () => {
            console.log(this);
        });
    </script>
</body>
```

