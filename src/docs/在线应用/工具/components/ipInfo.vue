<template>
  <el-input
    v-model="txt"
    placeholder="请输入"
    size="large"
    clearable
  >
    <template #append>
      <el-button
        type="primary"
        :disabled="!txt"
        @click="enter"
      >
        搜 索
      </el-button>
    </template>
  </el-input>
  <div v-if="info.status === 'Error'">出错了</div>
  <el-descriptions
    v-else-if="info.status === 'SUCCESS'"
    :title="info.location.other.info"
  >
    <el-descriptions-item label="省：">
      {{ info.location.data.province }}
    </el-descriptions-item>
    <el-descriptions-item label="市：">
      {{ info.location.data.city }}
    </el-descriptions-item>
    <el-descriptions-item label="区：">
      {{ info.location.data.district }}
    </el-descriptions-item>
    <el-descriptions-item label="IP：">
      {{ info.location.info.text }}
    </el-descriptions-item>
    <el-descriptions-item label="类型：">
      {{ info.location.info.type }}
    </el-descriptions-item>
    <el-descriptions-item label="中国大陆：">
      {{ info.location.info.cnip ? "是" : "否" }}
    </el-descriptions-item>
    <el-descriptions-item label="邮编：">
      {{ info.location.info.postal }}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { ipInfo } from "@/api"

const txt = ref("")
const info = ref<any>({})
const enter = async () => {
  const { data } = await ipInfo(txt.value)
  info.value = data
}
</script>
<style lang="scss" scoped>
.el-descriptions {
  margin-top: 1em;
}

.el-input {
  max-width: 450px;
  margin-top: 1em;
}
</style>
