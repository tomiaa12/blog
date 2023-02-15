<template>
  <div class="scroll-border">
    <h2>不规则图像</h2>
    <div class="row">
      <div
        class="box"
        :style="{ 'background-image': src }"
      >
        <div
          class="border-img"
          :style="{ 'background-image': src1 }"
          :alt="src"
        ></div>
      </div>
      <div
        class="box"
        :style="{ 'background-image': src }"
      >
        <div
          class="border-img fff"
          :style="{ 'background-image': src1 }"
          :alt="src1"
        ></div>
      </div>
    </div>
    <h2>边框实现</h2>
    <h3>圆形切割</h3>
    <div class="row">
      <div class="box box-bd"></div>
      <div class="box box-bd fff"></div>
    </div>
    <h3>方形切割</h3>
    <div class="row">
      <div class="box box-wh"></div>
      <div class="box box-wh fff"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
const src = `url(./img/css实现不规则透明盒子滚动边框/0.png)`
const src1 = `url(./img/css实现不规则透明盒子滚动边框/1.png)`
</script>
<style lang="scss" scoped>
.scroll-border {
  background: linear-gradient(90deg, #355c7d, #6c5b7b, #c06c84);
  padding: 1em;
}
h2,
h3 {
  color: white;
}
.row {
  display: flex;
  .box {
    position: relative;
    width: 50%;
    height: 20rem;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .border-img {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      animation: clippath 10s infinite linear;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    & + .box {
      margin-left: 0.5em;
    }
  }

  .box-bd,
  .box-wh {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    &::after,
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: inherit;
    }
    &::after {
      border: 1px solid #fff;
      animation: clippath 10s infinite linear;
    }
  }

  .box-wh {
    &::after {
      animation: clip 10s infinite linear;
    }
    &::before {
      border: 1px solid #fff;
      animation: clip1 10s infinite linear;
    }
    &.fff::before {
      background-color: inherit;
    }
  }
}

.fff {
  background-color: rgba(255, 255, 255, 0.5);
  &::after {
    background-color: inherit;
  }
}

@keyframes clippath {
  0%,
  to {
    clip-path: circle(100px at 0 0);
  }
  25% {
    clip-path: circle(100px at 0 100%);
  }
  50% {
    clip-path: circle(100px at 100% 100%);
  }
  75% {
    clip-path: circle(100px at 100% 0);
  }
}

@keyframes clip {
  0%,
  to {
    clip-path: inset(0 0 99% 0);
  }
  25% {
    clip-path: inset(0 99% 0 0);
  }
  50% {
    clip-path: inset(99% 0 0 0);
  }
  75% {
    clip-path: inset(0 0 0 99%);
  }
}

@keyframes clip1 {
  0%,
  to {
    clip-path: inset(99% 0 0 0);
  }
  25% {
    clip-path: inset(0 0 0 99%);
  }
  50% {
    clip-path: inset(0 0 99% 0);
  }
  75% {
    clip-path: inset(0 99% 0 0);
  }
}
</style>
