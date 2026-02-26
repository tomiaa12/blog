<template>
  <Text
    :api="cloudmusicComment"
    @get-data="isEnd = false"
  >
    <template #default="{ data }">
      <template v-if="data">
        <div class="left">『</div>
        <div class="word">
          <TextIt
            :key="data"
            :text="data.split('——')[0]"
            once
            @end="isEnd = true"
          />
        </div>
        <div class="right">』</div>
      </template>
    </template>

    <template #content-after="{ data }">
      <TextIt
        v-if="isEnd"
        class="author"
        :text="data[0].split('——')[1]"
        once
      ></TextIt>
    </template>
  </Text>
</template>

<script setup lang="ts">
import Text from "./text.vue"
import { cloudmusicComment } from "@/api"
import TextIt from "@/components/Text.vue"
import { ref } from "vue"

const isEnd = ref(false)
</script>
<style lang="scss" scoped>
.left,
.right {
  position: absolute;
}
.left {
  left: 0;
  top: -10px;
}
.right {
  right: 0;
  bottom: -10px;
}
.word {
  text-align: center;
}
.author {
  padding-top: 20px;
  justify-content: flex-end;
  font-size: 20px;
}
</style>

