<template>
  <div class="text">
    <slot name="content-before" :data="word"/>
    <div class="content">
      <slot :data="word">
        <div class="word">
          {{ word }}
        </div>
      </slot>
    </div>
    <slot name="content-after" :data="word"/>
    <div class="btn">
      <el-button
        type="primary"
        size="large"
        @click="getData"
        round
        :loading="loading"
      >
        换一句
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  api: Function
}>()

const loading = ref(false)
const word = ref('')

const getData = async () => {
  loading.value = true
  try {
    const { data } = await props.api()
    word.value = data
  } finally {
    loading.value = false
  }
}

getData()
</script>
<style lang="scss" scoped>
.text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  line-height: 1.5;
  width: 100%;
  .content {
    position: relative;
    padding: 10px 50px;
    width: 100%;
  }

  .btn {
    display: flex;
    justify-content: center;
  }
}

.el-button {
  margin-top: 80px;
}
</style>
