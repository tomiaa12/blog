# React 获取原生 DOM 节点

```html
<p ref='p1'>p1</p>
```
```jsx
<p ref={el => this.p2 = el}>p2</p>
```

推荐第三种

```jsx
<p ref={this.p3}>p3</p>
constructor() {
  super()
  this.p3 = React.createRef();
}
```