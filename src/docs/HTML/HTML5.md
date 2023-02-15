# HTML5 新标签、音视频、form 表单

## 新增布局标签

html4：1997年，html5：2008年

包括：

- 绘图画布 SVG（矢量图形）canvas（画布）
- 智能表单
- 多媒体
- 地理定位
- 数据存储
- 多线程

```html
<header> 定义了头部区域，标题，logo，搜索表单等 </header>

<footer> 定义了底部区域，友情链接，版权信息等 </footer>

<nav> <!-- 导航条，侧边栏导航，页内导航等 -->
  <a href="#">首页</a>
  <a href="#">登录</a>
  <a href="#">注册</a>
</nav>

<article> 完整含义的内容区域 </article>

<!--  页面内容中的章节，分区，通常是由标题和段落组成 -->
<section>
  <h2>标题</h2>
  <p> 段落 </p>
</section>

<!--  给标题和子标题进行分组 -->
<hgroup>
  <h1>主标题</h1>
  <h3>副标题</h3>
</hgroup>

<!-- 图片的文本内容 -->
<figure>
  <img src="" alt="">
  <figcaption> 定义figure的标题 </figcaption>
</figure>

<!-- 会自带背景颜色 -->
<mark> 标记标签 </mark>

<!-- 日期或时间 -->
<time>11:39</time>
```

::: tip 提示

你知道不用 css 怎么让一个标签有颜色吗？

:::

### html5标签的兼容

比较旧的浏览器可能无法识别 html5 的标签

解决方法：

1.	利用 JavaScript 新增元素的方式

```js
document.createElement('header');
document.createElement('nav');
document.createElement('footer');
document.createElement('article');
document.createElement('aside');
document.createElement('section');
```

::: warning 提示

通过 js 创建的元素是行内元素

:::

2.	使用封装好的插件，引入js文件（html5shive.js）

```html
<script src="https://cdn.bootcdn.net/ajax/libs/html5shiv/r29/html5.min.js"></script>
```

## 视频标签

```html
<video src="" control loop autoplay> </video>
```

- src：规定要播放的视频的路径

- controls：播放控件
- loop：循环播放
- muted：静音播放
- autoplay：自动播放（要在静音播放属性下才有效）
- poster：预览图片
- width：宽度
- height：高度

### 视频浏览器的支持：

Firefox、Safari、chrome、Opera、IE 9+

### 视频的格式

mp4：Firefox、Safari、chrome、IE 9+

webp：Firefox、Safari、Opera

ogg：avi、flv、wvvm 

## 音频标签

```html
<audio src=""></audio>
```

- src：规定要播放的音频的路径
- controls：播放控件
- loop：循环
- muted：静音播放

### 音频标签浏览器支持：

Firefox、Safari、chrome、Opera、IE 9+

### 音频标签的格式：

mp3：Firefox、Safari5+、chrome、Opera10+、IE 9+

wav：Firefox、Safari5+、chrome、Opera10+     

ogg：Firefox、chrome、Opera10+     

## 定义媒体资源

设置多个资源链接

```html
<video controls loop poster="./img/a.jpg"> 
    <source src="./videoAudio/movie.mp4">
    <source src="./videoAudio/movie.webp">
    <source src="./videoAudio/movie.ogg">
    <source src="./videoAudio/movie.avi">
    <object> 您的浏览器不支持 video 元素播放视频 </object>
</video>
```

## 表单

### form

```html
<form action="http" method="GET">
	表单元素，input，button标签等
</form>
```

action：提交表单时执行的动作

method：提交数据的方式

- get：得到数据（不安全，传输数据较小）
- post：传输数据（安全系数较高，传输数据相对较大）

###  button 标签

```html
<button type="submit">按钮</button>
```

- type 属性
  - submit：提交数据（默认值）
  - reset：重置数据（刷新）
  - button：普通按钮（按钮形状）

### input 的类型

```html
<input type="text" name="txt" placeholder="输入文本">
```

- type 属性-按钮

  - button：普通按钮
  - submit：提交按钮
  - reset：重置按钮
  - file：文件上传按钮
  - image：图片按钮

- type 其它属性

  - text：单行文本输入框
  - password： 密码输入框
  - radio：单选按钮
  - checkbox：复选框
  - url：网址
  - email：验证邮箱的格式
  - search：搜索
  - tel：验证电话号码的格式
  - number：数字输入框
  - range：滑动条
  - color：颜色块
  - date：日期 年月日 日历表
  - datetime：日期时间 UTC
  - datetime-local：本地日期时间 年月日 时分 日历表
  - month：月份 年月 日历表
  - time：时间 时分 时钟
  - week：周

  ```html
  <input type="url" name="url" placeholder="验证网址">
  <input type="email" placeholder="正确的邮箱地址">
  <input type="search" placeholder="请输入搜索的内容">
  <input type="tel" placeholder="请输入正确的手机号" pattern="">
  <input type="number" placeholder="请输入数字" value="10" min="0" max="20" step="5">
  <input type="range" value="0" min="5" max="20" step="3">
  <input type="color">
  <input type="date">
  <input type="datetime">
  <input type="datetime-local">
  <input type="month">
  <input type="time">
  <input type="week">
  ```

- 属性

  - value：输入框的初始值
  - checked：默认选中，选中单选按钮和复选框
  - placeholder：input 输入框的提示信息
  - autofocus：自动获取焦点
  - pattern：验证input的模式，pattern 的值是正则表达式
  - required ：必填字段（不能为空）
  - multiple：可以选择多个文件
  - size：定义下拉列表中可见项的数目
  - maxlength：规定输入框的最大长度值
  - readonly：只读状态，只读不可以写入
  - disabled：禁用，不可读，不可写
  - selected：默认选中下拉列表中的项
  - autocomplete：自动填充 on 打开 off 关闭（下次打开网站浏览器会提示上次输入的内容）

  ```html
  <input type="text" autocomplete="on" name="user" placeholder="自动填充">
  ```

    - form：form 属性必须引用所属表单的 id。form 里面的表单提交时也会把绑定 id 不在 form 里面的一并提交

  ```html
  <form action="" id="login">
    用户名：<input type="text" name="username">
    密码： <input type="password" name="pwd" >
    <input type="submit" >
  </form>
  <input type="email" placeholder="请输入邮箱" name="email"  form="login">
  ```


- type=number 数字，range 滑动条时的属性：

  - max：允许最大的值
  - min：允许最小的值
  - step：步长 
  - value：默认值

### datalist

list 指定 input 元素绑定某一个 datalist 数据

```html
<input type="text" list="car">
<datalist id="car"> 
    <option value="一"></option>
    <option value="二"></option>
</datalist>
```

### select 标签

```html
<select size='2'>
	<option selected >默认选中</option>
	<option>下拉框元素</option>
</select>
```

###  textarea 标签

```html
<textarea>多行文本</textarea>
```

