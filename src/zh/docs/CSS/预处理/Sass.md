# Scss/Sass 预处理

## 引入

```scss
@import "./sc/base";
```

## 变量

```scss
$yyy : 200px !default;// 默认变量 只要有新值就会覆盖
$yyy : 300px ;
```

## 使用

```scss
#dix1{
  $color : #ccc;// 局部变量
  $color : #ccc !global;// 全局变量
}
#div2 {// 特殊变量 #{表达式/变量}
  border-#{$zzz} : 1px solid black;
}
```

## 混入

```scss
@mixin box-shadow($shadows...) {
  box-shadow: $shadows;
}
.shadows {
  @include box-shadow(0px 4px 5px #666, 2px 6px 10px #999);
}
```

## 继承

- @extend

```scss
#div {
  @extend .btn;// 继承了.btn 与 .btn 下的属性
}
```

## 判断

```scss
$theme : dark;
body {
  @if $theme == darl {
    background-color: black;
  }@else if $theme == light {
    background-color: white;
  }
}
```

## 循环

```scss
$round : 12;
// 开始值           结束值
@for $i from 1 through $round{
  .col-#{$i}{
    width: 100% / $round * $i;
  }
}

$num : 5;
@while $num > 0 {
  .item#{$num}{
    width : $num * 2em;
  }
  $num : $num - 1;
}

$icons : success error waring;
@each $list in $icons {
.box-list{
  background: url("#{$list}.png");
}
```

