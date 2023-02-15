# vue 预览 word 文件 docx

你可能需要[前端预览 excel 文件](./vue预览Excel表格.md)  

## 安装 npm 依赖

```bash
npm i docx-preview@0.1.4
npm i jszip
```

## 预览在线地址文件

<CodeGroup>
  <CodeGroupItem title="html">

```html
<template>
  <div class="home">
    <div ref="file"></div>
  </div>
</template>
```

  </CodeGroupItem>
  <CodeGroupItem title="vue" active>


``` vue
<script>
import axios from 'axios'
const docx = require('docx-preview');

// 如果 docx-preview 版本比较新需要 es6 导出
// import { renderAsync } from 'docx-preview'

window.JSZip = require('jszip')
export default {
  mounted(){
    axios({
      method: 'get',
      responseType: 'blob', // 设置响应文件格式
      url: '/docx',
    }).then(({data}) => {
      docx.renderAsync(data,this.$refs.file) // 渲染到页面预览
    })
  }
}
</script>
```

  </CodeGroupItem>
</CodeGroup>


## 预览本地文件
<CodeGroup>
  <CodeGroupItem title="html">

```html
<template>
  <div class="my-component" ref="preview">
    <input type="file" @change="preview" ref="file">
  </div>
</template>
```


  </CodeGroupItem>
  <CodeGroupItem title="vue" active>

```vue
<script>
const docx = require('docx-preview');
window.JSZip = require('jszip')
export default {
  methods:{
    preview(e){
      docx.renderAsync(this.$refs.file.files[0],this.$refs.preview) // 渲染到页面预览
    }
  }
};
</script>
```

  </CodeGroupItem>
  <CodeGroupItem title="css">

```css
.my-component{
  width: 100%;
  height: 90vh;
  border: 1px solid #000;
}
```

  </CodeGroupItem>
</CodeGroup>



## demo 地址

[gitee仓库地址](https://gitee.com/tomiaa/vue-preview-word-file-docx)

[新标签打开demo](https://tomiaa.gitee.io/vue-preview-word-file-docx/#/)

<iframe src="https://tomiaa.gitee.io/vue-preview-word-file-docx/#/" ></iframe>
