# HTML-常用标签

## 什么是 html?

- Hyper Text Markup Language 超文本标记语言
- 用来描述网页的一种标记语言
- 标记语言里面包含了一套标记标签

:::tip 提示

文件扩展名以 .html 或 .htm 为标识。包含了 html 的标记和纯文本。

:::

下载编辑器 [Vscode - Download (softonic.com)](https://vscode.en.softonic.com/)

## 浏览器内核

| 内核                | 浏览器          | 前缀   |
| ------------------- | --------------- | ------ |
| webkit              | Safari（苹果）  | webkit |
| webkit/Blink        | Chrome（谷歌）  | webkit |
| Gecko               | firefox（火狐） | moz    |
| presto/webkit/Blink | Opera（欧朋）   | o      |
| Trident             | IE 浏览器的内核 | ms     |

## html 基本结构

1. 在编辑器中创建一个以 .html 结尾的文件
2. 输入 ! 再按下 table 或回车，会看到如下代码：

```html
<!-- 此行为注释内容，不会被浏览器执行。 -->
<!DOCTYPE html>
<!-- 文件的声明，告诉浏览器以什么规则来解析 -->
<html lang="zh-cn">
  <!-- html 网页的开始 lang表示这个网页的语言，zh-cn表示为中文，如果为其他地区的语言浏览器会提示是否翻译网页。-->
  <head>
    <!-- head 提供一些机器可读信息 -->
    <meta charset="UTF-8" />
    <!-- 设置网页的字符编码格式 utf-8包含了所有语言编码，如果文件保存的编码与打开文件的编码不对，会出现乱码的情况。 -->
    <meta
      name="description"
      content="描述信息"
    />
    <!-- 网页的描述 -->
    <meta
      name="keywords"
      content="用于搜索引擎的关键词"
    />
    <!-- 关键词 -->
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0,user-scalable=no"
    />
    <!-- 设置视口信息 -->
    <!-- 网页图标 -->
    <link
      rel="icon"
      href="favicon.ico"
    />

    <title>Document</title>
    <!-- 网页的标题 -->
  </head>
  <body>
    <!-- 网页的主体部分 -->
  </body>
</html>
<!-- 网页的结束 -->
```

- \<!DOCTYPE html>：这是 html5 的声明，不是标记。
  - 用于告诉浏览器此文件的类型，让浏览器正确解析。
  - DOC：document 文件，TYPE = 类型，html = 超文本标记语言（网页）html5
- 元素
  - 以某个标签开始 \<xx> 至 \</xx> 标签结尾，标签中间的是书写内容的地方。
  - 当然也有空标签从 <xx\/> 开始就进行关闭。有少量的这种单标记，列如 \<input/>、\<img/>、\<meta>，也叫做空标记和自闭合标记。
- 属性
  - 所有的元素都有属性，以 属性名='属性值' 存在
  - 属性值始终被引号包起来，推荐使用双引号（不能互相保护）
  - 属性名与值对大小写不敏感，写了大写也会被浏览器转换成小写。（推荐小写）

## meta 标签

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>
<!--   
  author   			  作者
  keywords 			  定义关键字
  description  		  定义描述
  viewport            手机浏览器的窗口大小，
  device-width        浏览器窗口的宽度与手机宽度保持一致
  initial-scale=0.5'  让网页缩放为原来的0.5倍
  user-scalable=no	  不允许用户缩放
-->

<meta
  http-equiv="refresh"
  content="30"
/>
<!-- 每30秒钟刷新当前页面: -->

<!-- 以最高版本的ie渲染显示 -->
<meta
  http-equiv="X-UA-Compatible"
  content="ie=edge"
/>

<!-- 兼容不支持viewport的设备 -->
<meta
  name="HandheldFriendly"
  content="true"
/>
```

## 常用标签

标签分为两类：块级元素和行内元素。

- 块级元素：单独占用一行，从上到下排列。
- 行内元素：从左到右排列，不会以新的一行开始，一行占满后会换行。

### 标题标签

- 尝试在 body 标签内输入以下内容在浏览器中打开

```html
<body>
  <h1>这是标题一</h1>
  <h2>这是标题二</h2>
  <h3>这是标题三</h3>
  <h4>这是标题四</h4>
  <h5>这是标题五</h5>
  <h6>这是标题六</h6>
</body>
```

::: tip 提示

在 vscode 编辑器中安装 open in browser 插件，快捷键 alt+b 可快速在浏览器中打开 html 文件。

[点击下载](https://marketplace.visualstudio.com/items?itemName=techer.open-in-browser)

:::

- h1：作用主标题（最重要的），页面中只能出现一次。在搜索引擎会为网页结构和内容来索引，一般用于网站的 logo。

- h2-h6：则可以出现多次，标题标签包裹的内容会加粗文本，不要仅仅为了加粗改变字体使用 h 标签。

### 段落标签

- 段落

```html
<p>这是段落内容，浏览器会在段落前后自动添加空行</p>
<div>这是区块，块级标签，没有特殊含义，用于划分网页结构</div>
<span>内联元素</span><span>也没有特殊含义</span>
```

- 文本格式

```html
<strong>加粗</strong>
<!-- 有语义 -->
<b>加粗</b>
<!-- 无语义 -->

<hr />
<!-- 分割线标签 -->

<em>倾斜</em>
<!-- 有语义 -->
<i>倾斜</i>
<!-- 无语义 -->
<hr />

<del>删除线</del>
<!-- 有语义 -->
<s>删除线</s>
<!-- 无语义 -->
<hr />

<!-- 2的8次方 -->
2<sup>8</sup>
<!-- 上标 -->
2<sub>2</sub>
<!-- 下标 -->

<!-- 拼音 -->
<ruby> 饕<rt>tāo</rt> </ruby>
<ruby> 餮<rt>tiè</rt> </ruby>
```

::: tip 提示

建议使用有语义的标签

:::

### 图片标签

```html
<img
  src="./1.jpg"
  alt="替换文本"
  width=""
  height=""
/>
```

- src：图片的位置路径
- alt：图片加载失败后显示的文本
- width/height：图片的宽或高，如果只设置一个，另一个则为 auto（自动），自动等比例缩放。

路径

- 相对路径
  - 以./开头， ./ 表示当前文件所在的位置，../表示上一级文件，../../表示上上级，以此类推。
- 绝对路径
  - 以 / 开头，例如：F:\WEB\index.html，服务器上则是网站的根目录。

## 链接

```html
<a
  href=""
  target=""
  title=""
>
  点击打开链接的内容
</a>
```

特点：会改变文本内容的颜色，添加下滑线，把鼠标指针移入到链接的内容上时，鼠标的光标会变成手型.

- href：链接外部文件的路径
- target：定义怎么打开窗口
  - target='\_self '：当前窗口打开（默认）
  - target='\_blank'：新窗口打开
- title：鼠标悬停的提示
- 跳转到已知文件

```html
<!-- 已知网站 完整的网址-->
<a href="https://www.baidu.com"> 百度 </a>
<!--本地文件的链接  -->
<a href="./login.html">请登录</a>
```

- 跳转到未知文件

```html
<!-- 返回到页面的顶部 -->
<a href="#">空链接</a>
<!-- 原地跳转 不会发生任何操作-->
<a href="javascript:;">js的空语句</a>
```

- 下载

```html
<!-- 路径是文件的类型时 -->
<a href="../../文件.rar">下载</a>
```

- 锚点链接

  - 跳到当前页面某个位置

  ```html
  <div id="a">div</div>
  <a href="#ms"
    >跳转<a />
    <!-- 会跳转到id为a的位置 --></a
  >
  ```

  - 跳到其他页面某个位置

  ```html
  <div id="b">登录</div>
  <a href="./login.html#ms"> 跳转</a>
  <!-- 会跳转到另一个文件，并滚动到id = b的位置-->
  ```

## 列表

- 无序列表

```html
<ul>
  <li>无序列表项</li>
  <li>无序列表项</li>
  ....
</ul>
```

列表项默认使用粗体的小圆点进行标记

- 有序列表

```html
<ol>
  <li>有序列表项</li>
  <li>有序列表项</li>
  ...
</ol>
```

项目列表，列表项默认使用数字进行标记

**li 标签可以包含任意其他元素，但 ul 与 ol 不要包含除 li 以外的标签**

- 自定义列表
  - dl 和 dt dd 是组合标签，dl 下只能包含 dt 和 dd
  - dt 和 dd 可以包含其他任意元素
  - dt 和 dd 是同级关系

```html
<dl>
  <dt>定义列表项标题</dt>
  <dd>定义描述内容</dd>
  <dd>定义描述内容</dd>
</dl>
```

## 表格

```html
<table
  border="1"
  cellspacing="0"
>
  <caption>
    学员信息表 表格的标题
  </caption>
  <tbody>
    <tr>
      <td>第一个单元格</td>
      <td>第二个单元格</td>
      <td>第三个单元格</td>
    </tr>
    <tr>
      <td>第一个单元格</td>
      <td>第二个单元格</td>
      <td>第三个单元格</td>
    </tr>
    <tr>
      <td rowspan="2">纵向合并</td>
      <td colspan="2">横向合并</td>
    </tr>
    <tr>
      <td>第二个</td>
      <td>第三个</td>
    </tr>
  </tbody>
  <thead>
    <tr>
      <th>学号</th>
      <th>姓名</th>
      <th>性别</th>
    </tr>
  </thead>
  <tfoot>
    <tr>
      <td>统计人数:</td>
      <td></td>
      <td></td>
    </tr>
  </tfoot>
</table>
```

- table 的属性

  - border：边框线

  - width：宽度

  - height：高度

  - cellspacing：单元格之间的间距 默认值 2

  - cellpadding：内容与单元格边框之间的距离 默认 1

- table 的 css 属性
  - border-collapse：separate（边框独立），collapse（相邻边框被合并）
- td 单元格属性
  - rowspan：纵向合并（跨行合并）
  - colspan：横向合并（跨列合并）

::: tip 提示

table 表格内 tbody 标签可以有多个，把 thead 放在 tbody 下面也可以用于搜索引擎 seo 优先爬到表格的标题 caption 与 tbody 正文。

:::

## html 的书写规范

1. 文档类型的声明以及编码
2. tdk
   - t：title 定义网页的标题
   - d：description 定义描述
   - k：keywords 定义关键字
3. 字体图标的引入
4. 嵌套缩进、标签、属性、属性值小写
5. 语义化，使用有含义的标签，img 要加 alt 属性，多行、单行文本文本溢出要加 title 属性。
6. 合理嵌套标签 ul li，ol li，dl dt 和 dd。交互性标签 a 不要嵌套 button，段落与标题、标题与标签不能嵌套。
