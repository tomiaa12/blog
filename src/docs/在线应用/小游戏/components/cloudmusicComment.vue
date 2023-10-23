<template>
  <Text :api="cloudmusicComment" :format="format"/>
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { cloudmusicComment } from "@/api"

const format = (txt: string) => {
 const temp = txt.split("——")
 temp[1] = `<p style="text-align: right;">——${temp[1]}</p>`
 return  temp.join('')
}

</script>
