<template>
  <div>
    <input
      v-model="keyword"
      type="text"
      placeholder="输入文字测试"
      @input="handlerInput"
    />
    <p>
      handlerInput.status 节流状态：{{ status }}
      <button @click="setStatus(true)">开启节流</button>
      <button @click="setStatus(false)">关闭节流</button>
      延迟时间：
      <input
        v-model="wait"
        type="number"
        @input="setWait"
      />
      ms
    </p>
    <ul>
      <li
        v-for="(i, index) of arr"
        :key="index"
      >
        {{ i }}
      </li>
    </ul>
  </div>
</template>

<script>
import { debounce } from "./debounce"
export default {
  data() {
    return {
      wait: 500,
      status: true,
      arr: [],
      keyword: "",
    }
  },
  created() {
    this.setWait(this.wait)
  },
  methods: {
    setWait() {
      this.handlerInput = debounce(() => {
        this.arr.unshift(this.keyword)
      }, this.wait)
    },
    setStatus(status) {
      this.handlerInput.status = status
      this.status = status
    },
  },
}
</script>
<style lang="scss" scoped>
ul {
  width: 100%;
  height: 200px;
  background-color: var(--c-details-bg);
  overflow: auto;
  border-radius: 5px;
  font-size: 18px;
}
</style>
