# CSS3 Flex 弹性盒子

## 设置 flex 属性

```css
display:flex/inline-flex;  /* IE11支持，IE10-不支持 */
```

## 容器属性

```css
flex-direction:row / row-reverse / column / column-reverse; /* 排列方向 */
justify-content: flex-start / flex-end / center /space-between /space-around / space-evenly /* 对齐方式(主轴) */
align-items ： stretch 默认|| flex-start ||  flex-end  ||  center || baseline /* 对齐方式(交叉轴) */
flex-wrap : nowrap || wrap  || wrap-reverse 
```

## 项目属性

```css
order: 0; /* 数值越小，排列越靠前 */
flex-grow: 0;/* 放大 */
flex-shrink: 1; /* 默认缩小 */
flex-basis: auto;/* 分配多余空间前，项目占据的主轴空间， */
flex：flex-grow flex-shrink  flex-basis;
flex: 0 1 auto;   /* 放大  缩小  占据主轴空间 */
align-self: stretch 默认|| flex-start ||  flex-end  ||  center || baseline
```