<template>
  <div>
    <div
      class="throttle"
      @mousemove="handlerMove"
    >
      {{ num }}
    </div>
    <p>
      handlerMove.status 节流状态：{{ status }}
      <button @click="setStatus(true)">开启节流</button>
      <button @click="setStatus(false)">关闭节流</button>
      间隔时间：
      <input
        type="number"
        v-model="wait"
        @input="setWait"
      />
      ms
    </p>
  </div>
</template>

<script>
import { throttle } from "./throttle"
export default {
  data() {
    return {
      num: 0,
      wait: 1000,
      status: true,
    }
  },
  created() {
    this.setWait(this.wait)
  },
  methods: {
    setWait() {
      this.handlerMove = throttle(() => {
        // console.log(this, event);
        this.num++
      }, this.wait)
    },
    setStatus(status) {
      this.handlerMove.status = status
      this.status = status
    },
  },
}
</script>
<style lang="scss" scoped>
.throttle {
  width: 100%;
  height: 200px;
  background-color: var(--c-details-bg);
  overflow: auto;
  border-radius: 5px;
  font-size: 50px;
  text-align: center;
  line-height: 200px;
}
</style>
