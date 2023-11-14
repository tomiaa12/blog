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
        :key="word"
      />
      <div class="content">
        <slot :data="item" :key="item" v-for="(item, i) of word">
          <Text
            v-if="!i || isTypeItEnd[i - 1]"
            class="word"
            :style="{
              justifyContent,
            }"
            :text="item"
            once
            @end="isTypeItEnd[i] = true"
          />
        </slot>
      </div>
      <slot
        name="content-after"
        :data="word"
        :key="word"
      />
      <div
        class="btn"
        v-if="showBtn && word"
      >
        <el-button
          type="primary"
          size="large"
          @click="getData"
          round
          :loading="loading"
          :disabled="!slots.default && !isTypeItEnd[word.length - 1]"
        >
          {{ btnText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults,computed, useSlots } from "vue"
import Text from "@/components/Text.vue"

const props = withDefaults(
  defineProps<{
    api: Function
    justifyContent?: "left" | "center" | "right" | "flex-start" | "flex-end"
    showBtn?: boolean
    position?: boolean
    size?: string
    format?: Function
    btnText?: string
  }>(),
  {
    showBtn: true,
    position: true,
    size: "1.5rem",
    btnText: "换一句",
  }
)
const emits = defineEmits(['getData'])
const slots = useSlots()


const loading = ref(false)
const word = computed(() => {
  const temp = props.format ? props.format(txt.value) : txt.value
  return Array.isArray(temp) ? temp : [temp]
}
)
const isTypeItEnd = ref<boolean[]>([])

const txt = ref('')
const getData = async () => {
  emits('getData')
  loading.value = true
  try {
    const { data } = await props.api()
    txt.value = data
  } finally {
    loading.value = false
  }
}

getData()
</script>
<style lang="scss" scoped>
.min-h100 {
  min-height: var(--min-h100);
  display: flex;
  align-items: center;
}
.text {
  line-height: 1.5;
  width: 100%;
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

.word{
  margin-bottom: 15px;
}
</style>
