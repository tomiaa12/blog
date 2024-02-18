# {{ $params.title }}

<!-- @content -->

<template v-for="i in $params.list">

::: details {{i.title}}

<div>
  <div>
    {{i.desc}}
  </div>
  
  <br />

  <div v-for="j in i.download" >
    <a :href="j.url" type="primary">
      {{ j.name }}
    </a>
  </div>
</div>
:::

</template>
