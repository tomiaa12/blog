# Less 预处理

## 引入

```less
@import "reset.css"; /* 导入css */
```

## 变量

```less
@w:1190px;/* 变量 */
```

## 使用

```less
height:calc(@w - 1000px);
border-@{side}:10px solid @color + 200;
```

## 混入

- @arguments

```less
.boxShadow(@x,@y,@blur,@spreed,@color){
  box-shadow: @arguments ;
}
.box1{
  .public;
  .boxShadow(0px, 0px,30px ,50px , @color)
}
```

## 继承

- :extend

```less
.box3{
  &:extend(.public);
  margin:auto;
}
// 等同于
.box4:extend(.public){
  margin: 50px auto;
  background: green;
}
```

## 运算

```less
.bottom{
  width:(200px-20)*2;
}
```

## 编译为原始 css calc 计算

```less
:root{
  --width: 1rem;
}
.box{
  width: calc(100% - var(--width)); // 这样写会编译成 width: 计算后的结果;
  width: calc(~"100% - var(--width)"); // 应该这样写

  @w=90%;
  width: calc(~"@{w} - var(--width)"); // 使用 less 变量

}
```