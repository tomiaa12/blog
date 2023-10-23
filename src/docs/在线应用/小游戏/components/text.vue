<template>
  <div
    class="min-h100"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div
      class="text"
      :class="[position && 'position']"
      :style="{
        fontSize: size,
      }"
    >
      <slot
        name="content-before"
        :data="word"
      />
      <div class="content">
        <slot :data="word">
          <div
            class="word"
            :style="{
              textAlign,
            }"
            v-html="format ? format(word) : word"
          ></div>
        </slot>
      </div>
      <slot
        name="content-after"
        :data="word"
      />
      <div
        class="btn"
        v-if="showBtn"
      >
        <el-button
          type="primary"
          size="large"
          @click="getData"
          round
          :loading="loading"
        >
          {{ btnText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults } from "vue"

const props = withDefaults(
  defineProps<{
    api: Function
    textAlign?: "left" | "center" | "right" | "justify" | "start" | "end"
    showBtn?: boolean
    position?: boolean
    size?: string
    format?: Function
    btnText?: string
  }>(),
  {
    showBtn: true,
    position: true,
    size: "30px",
    btnText: '换一句'
  }
)

const loading = ref(false)
const word = ref("")

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
.min-h100 {
  position: relative;
  min-height: calc(
    var(--vh) - var(--vp-nav-height) - var(--page-pv-height) - 32px
  );
}
.text {
  line-height: 1.5;
  width: 100%;
  &.position {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  :deep() p {
    line-height: inherit;
  }
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
  transform: scale(1.4);
}
</style>
