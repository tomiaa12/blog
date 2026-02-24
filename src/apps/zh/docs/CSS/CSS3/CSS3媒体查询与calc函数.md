# CSS3 媒体查询与 calc 函数

## 媒体查询

```css
/* @media 媒介的意思 screen窗口的大小 */
@media screen and (max-width: 640px){/* 当浏览器不超过 640 的时候使用以下样式 */}
@media not and (max-width: 640px){/* 与上面的相反 大于 640px 才会触发 */}
@media screen and ( orientation: landscape){/* 在横屏下触发 */}
@media screen and ( orientation: portrait){/* 竖屏下触发 */}

<link rel="stylesheet" href="css.css" media="all and (mid-width:400px)">
/* 小于400px才引用外部css */
```

## calc() 函数

```css
calc(表达式)
```

- calculate 计算的缩写,是 css3 新增的计算功能，用来指定元素的长度
- 运算符前后必须保留一个空格