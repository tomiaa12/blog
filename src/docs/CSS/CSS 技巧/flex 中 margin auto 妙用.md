# flex 中 margin auto 妙用

## 左右对齐

```html
<ul>
  <li>导航A</li>
  <li>导航B</li>
  <li>导航C</li>
  <li>导航D</li>
  <li class="login">登陆</li>
  <li>注册</li>
</ul>
```

```css{5}
ul {
  display: flex;
}
.login {
  margin-left: auto;
}
```

<iframe height="300" style="width: 100%;" scrolling="no" title="Untitled" src="https://codepen.io/tomiaa/embed/QWByeBM?default-tab=css%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/tomiaa/pen/QWByeBM">
  Untitled</a> by tomiaa (<a href="https://codepen.io/tomiaa">@tomiaa</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 底部吸附

```html
<div class="container">
  <div class="content">content</div>
  <div class="footer"></div>
</div>
```

```css{6-14}
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  height: 100px;
  flex-shrink: 0;
}
.footer {
  margin-top: auto;
  flex-shrink: 0;
  height: 30px;
}
```

试着增加`content`的`height`

<iframe height="300" style="width: 100%;" scrolling="no" title="底部吸附" src="https://codepen.io/tomiaa/embed/dyjLJyG?default-tab=css%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/tomiaa/pen/dyjLJyG">
  底部吸附</a> by tomiaa (<a href="https://codepen.io/tomiaa">@tomiaa</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
