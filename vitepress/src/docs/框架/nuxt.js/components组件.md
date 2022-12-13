# nuxt.js 3 components 组件

## 自动注册 components

1. 在`componen\*.vue`会自动注册到全局

`components\ComFooter.vue`在页面中使用:
```vue
<!-- 文件名是什么组件就是什么 -->
<ComFooter />
```

`components\com-footer.vue`在页面中使用:
```vue
<!-- 文件名是什么组件就是什么 -->
<com-footer />
```

## 多级文件夹

`components\base\test\Button.vue`在页面中使用:
```vue
<BaseTestButton/>
```

## 懒加载

在使用组件时前面加上`Lazy`即可,`components\ComFooter.vue`在页面中使用:
```vue
<LazyComFooter />
```

