<template>
  <div class="j2me-config">
    <div class="config-section">
      <div class="section-header">
        <h3 class="section-title">启动配置</h3>
      </div>
      <div class="config-row">
        <el-select
          v-model="canvasSizeIndex"
          size="default"
          @change="saveConfigToSession"
          style="max-width: 250px;"
        >
          <el-option
            v-for="(o, i) in canvasSizeOptions"
            :key="o.value"
            :label="o.label"
            :value="i"
          />
        </el-select>

        <el-select
          v-model="gamepadSizeIndex"
          size="default"
          @change="saveConfigToSession"
          style="max-width: 250px;"
        >
          <el-option
            v-for="(o, i) in gamepadSizeOptions"
            :key="o.value"
            :label="o.label"
            :value="i"
          />
        </el-select>

        <el-select
          v-model="gameresizeIndex"
          size="default"
          @change="saveConfigToSession"
          style="max-width: 250px;"
        >
          <el-option
            v-for="(o, i) in gameresizeOptions"
            :key="o.value"
            :label="o.label"
            :value="i"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import {
  canvasSizeIndex,
  canvasSizeOptions,
  gamepadSizeIndex,
  gamepadSizeOptions,
  gameresizeIndex,
  gameresizeOptions,
  loadConfigFromSession,
  saveConfigToSession,
} from "./hooks/useConfig"

onMounted(() => {
  loadConfigFromSession()
})
</script>

<style lang="scss" scoped>
.j2me-config {
  margin-bottom: 24px;

  .config-section {
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--vp-c-divider, #e4e7ed);
    }

    .section-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--vp-c-text-1, #303133);
    }

    .config-row {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
  }
}

@media screen and (max-width: 640px) {
  .j2me-config {
    .config-section {
      .section-title {
        font-size: 16px;
      }

      .config-row {
        flex-direction: column;
      }
    }
  }
}
</style>


