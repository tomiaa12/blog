<template>
  <div class="yiyan">
    <div class="content">
      <div class="left">『</div>
      <div class="word">
        大本钟下送快递——上面摆，下面寄举手长劳劳,二情同依依.
      </div>
      <div class="right">』</div>
    </div>
    <div class="author">—— 黄伟文「喜帖街」</div>
    <div class="btn">
      <el-button type="primary" size="large" @click=""  round>换一句</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
.yiyan {
  position: absolute;
  top: 30%;
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
  .word {
    text-align: center;
  }
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
  .author{
    padding-top: 20px;
    text-align: right;
    font-size: 20px;
  }

  .btn{
    display: flex;
    justify-content: center;
  }
}

.el-button{
  margin-top: 80px;
}
</style>
