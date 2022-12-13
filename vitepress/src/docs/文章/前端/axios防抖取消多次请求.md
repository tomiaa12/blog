# axios 防抖取消多次请求及封装

## 使用

<CodeGroup>
  <CodeGroupItem title="html">

```html
<template>
  <input type="text" v-model="keyword" @input="search" />
</template>
```

  </CodeGroupItem>
  
  <CodeGroupItem title="js" active>

```vue
<script setup>
import { ref } from "vue";
import axios from "axios";

const keyword = ref("");
let temp;
const search = () => {
  temp?.("取消请求"); // 取消上一次请求
  axios({
    method: "post",
    url: "/api",
    data: { wd: keyword.value },
    cancelToken: new axios.CancelToken((cancel) => {
      // 接受一个 cancel 取消当前请求的方法
      temp = cancel;
    }),
  })
    .then((res) => {
      // 成功
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log(err.message); // 被取消时的参数
      } else {
        console.log(err); // 请求错误
      }
    });
};
</script>
```

</CodeGroupItem>
</CodeGroup>

## vue 中使用封装库

[点我查看](./cancel_axios_request取消axios请求.md)
