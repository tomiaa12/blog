# 开箱即用的 Live2d

你可能注意到网站右下角的`Live2d`人物了，对此我对`Live2d`做了类封装几行代码就能实现网站加载`Live2d`人物。该库包含了`live2d`与`live2d_3`的模型。

## 安装

```sh
npm i @tomiaa/live2d
```

## 使用

```js
import { Live2d } from "@tomiaa/live2d"

new Live2d({
  // el: "#live2d",
  el: document.getElementById("live2d"),
})
```

## TS 类型

```ts
// 配置类型
import type { Live2dOptions } from "@tomiaa/live2d"
```

## 依赖文件地址配置

依赖文件的地址文件`IP`都在`github`，下面参数主要考虑到国内经常被墙，可以使用下面参数使用其他服务器地址。

- jsBaseURL：配置依赖的`js`文件`baseURL`地址目录，默认加载的`https://github.com/tomiaa12/live2d/tree/main/public`下的`js`文件，修改后需要保证该目录下也应该存在同样的文件。
- live2d_2_ModelBaseURL: `live2d`模型的`baseURL`地址目录，默认使用`jsBaseURL`参数。
- live2d_3_ModelBaseURL: `live2d_3`模型的`baseURL`地址目录，默认使用`jsBaseURL`参数。

## Vue Demo

<<< @/layout/Live2d.vue

## 参数

| 属性                  | 说明                                                           | 类型                                                                                                                                                                                   | 默认值                             |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| el                    | 容器 querySelector 选择器或 dom                                | string \| DOM 元素                                                                                                                                                                     | #live2d                            |
| jsBaseURL             | 配置依赖的`js`文件`baseURL`地址目录                            | string                                                                                                                                                                                 | `tomiaa12.github.io/live2d/public` |
| live2d_2_ModelBaseURL | live2d 模型地址目录                                            | string                                                                                                                                                                                 | 默认使用 jsBaseURL                 |
| live2d_3_ModelBaseURL | live2d_3 模型地址目录                                          | string                                                                                                                                                                                 | 默认使用 jsBaseURL                 |
| loadLive2d_2          | 是否加载 live2d_2 模型列表                                     | boolean                                                                                                                                                                                | true                               |
| loadLive2d_3          | 是否加载 live2d_3 模型列表                                     | boolean                                                                                                                                                                                | true                               |
| playLoadingAnimation  | 加载模型之后是否播放登场(login)动画，只有存在`login`动画才有效 | boolean                                                                                                                                                                                | true                               |
| showLoading           | 显示加载模型 loading                                           | boolean                                                                                                                                                                                | true                               |
| showControl           | 显示控制栏                                                     | boolean                                                                                                                                                                                | true                               |
| iApplicationOptions   | PIXI.Application 配置                                          | IApplicationOptions                                                                                                                                                                    | {}                                 |
| maxWidth              | 容器最大宽度                                                   | number                                                                                                                                                                                 | 400                                |
| minWidth              | 容器最小宽度                                                   | number                                                                                                                                                                                 | 200                                |
| aspectRatio           | 默认宽高比                                                     | [number,number]                                                                                                                                                                        | [10,9]                             |
| beforeInit            | 初始化之前                                                     | (data: {<br />options:Live2dOptions<br />modelList: ModelOption[]<br />})=> void                                                                                                       |                                    |
| afterInit             | 初始化完成                                                     | (data: {<br />options: Live2dOptions<br />modelList: ModelOption[]<br />currentModelOption: ModelOption<br />Live2DModel: typeof Live2DModelType<br />app: Application<br />}) => void |                                    |
| randomPeople          | 人物随机                                                       | boolean                                                                                                                                                                                | true                               |
| allowDrag             | 允许拖动                                                       | boolean                                                                                                                                                                                | true                               |
| hitokoto              | 是否开启 hitokoto 一言                                         | boolean                                                                                                                                                                                | true                               |
| hitokotoOptions       | 一言配置                                                       | HitokotoOptions                                                                                                                                                                        |                                    |

## 成员属性

| 属性名             | 说明              | 类型                                  | 默认值             |
| ------------------ | ----------------- | ------------------------------------- | ------------------ |
| options            | 构造器配置        | Live2dOptions                         | 参考上一标题默认值 |
| el                 | dom 容器          | any                                   |                    |
| canvas             | canvas 容器       | any                                   |                    |
| Live2DModel        | 模型加载模块      | typeof Live2DModelType                |                    |
| app                | pixi.js 应用      | Application                           |                    |
| loading            | 加载loading       | boolean                               | false              |
| model              | 当前模型          | InstanceType\<typeof Live2DModelType> |                    |
| modelList          | 模型列表          | ModelOption[]                         | []                 |
| currentModelOption | 当前模型配置      | ModelOption                           |                    |
| personIndex        | 模型下标          | number                                | 0                  |
| clothingIndex      | 服装下标          | number                                | 0                  |
| elLoading          | loading dom 元素  | any                                   |                    |
| elControl          | control dom 元素  | any                                   |                    |
| elSwitchPerson     | 切换人物 dom 元素 | any                                   |                    |
| elSwitchClothing   | 切换服装 dom 元素 | any                                   |                    |
| elHitokoto         | 一言 dom 元素     | any                                   |                    |
| hitokoto           | 一言              | Hitokoto                              |                    |

