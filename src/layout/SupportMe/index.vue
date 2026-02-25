<template>
  <div :class="{
    flex
  }">
    <img
      src="./img/wx.jpg"
      alt="微信"
      class="qr-img"
    />
    <img
      src="./img/zfb.png"
      alt="支付宝"
      class="qr-img"
    />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  flex?: boolean
}>()
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.flex .qr-img {
  flex: 1 1 0;
  min-width: 0;
}

.qr-img {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}
</style>