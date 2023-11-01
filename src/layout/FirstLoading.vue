<template>
  <section
    id="firstLoading"
    class="first-loading"
  >
    <div class="sk-folding-cube">
      <div class="sk-cube sk-cube-1"></div>
      <div class="sk-cube sk-cube-2"></div>
      <div class="sk-cube sk-cube-4"></div>
      <div class="sk-cube sk-cube-3"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue"

onMounted(() => {
  const el = document.getElementById("firstLoading") as any
  if (el) {
    el.setAttribute("transition-style", "out:custom:circle-swoop")
    // 动画完毕后删除
    "onanimationend" in el
      ? el.addEventListener("animationend", el.remove)
      : // 兼容chrome 79以下
        setTimeout(
          el?.remove,
          parseFloat(getComputedStyle(el).animationDuration) * 1000
        )
  }
})
</script>
<style lang="scss" scoped>
section.first-loading {
  z-index: 20000;
  background-color: #5672cd;
  position: fixed;
  top: 0;
  left: 0;
  height: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
section.first-loading .sk-folding-cube {
  width: 6em;
  height: 6em;
  position: relative;
  top: -6em;
  margin: auto;
  transform: rotateZ(45deg);
}
section.first-loading .sk-folding-cube .sk-cube {
  float: left;
  width: 50%;
  height: 50%;
  position: relative;
  transform: scale(1.1);
}
section.first-loading .sk-folding-cube .sk-cube:before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #d9ecff;
  -webkit-animation: sk-folding-cube-angle 2.8s infinite linear both;
  animation: sk-folding-cube-angle 2.8s infinite linear both;
  transform-origin: 100% 100%;
}
section.first-loading .sk-folding-cube .sk-cube-2 {
  transform: scale(1.1) rotateZ(90deg);
}
section.first-loading .sk-folding-cube .sk-cube-3 {
  transform: scale(1.1) rotateZ(180deg);
}
section.first-loading .sk-folding-cube .sk-cube-4 {
  transform: scale(1.1) rotateZ(270deg);
}
section.first-loading .sk-folding-cube .sk-cube-2:before {
  -webkit-animation-delay: 0.35s;
  animation-delay: 0.35s;
}
section.first-loading .sk-folding-cube .sk-cube-3:before {
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
}
section.first-loading .sk-folding-cube .sk-cube-4:before {
  -webkit-animation-delay: 1.05s;
  animation-delay: 1.05s;
}
@keyframes out-circle-swoop {
  from {
    clip-path: circle(150% at bottom right);
  }
  to {
    clip-path: circle(0% at top right);
  }
}
[transition-style="out:custom:circle-swoop"] {
  animation-duration: 2.5s;
  animation-name: out-circle-swoop;
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0.3, 1, 0.25, 1);
}
@-webkit-keyframes sk-folding-cube-angle {
  0%,
  10% {
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
@keyframes sk-folding-cube-angle {
  0%,
  10% {
    transform: perspective(140px) rotateX(-180deg);
    opacity: 0;
  }
  25%,
  75% {
    transform: perspective(140px) rotateX(0deg);
    opacity: 1;
  }
  90%,
  100% {
    transform: perspective(140px) rotateY(180deg);
    opacity: 0;
  }
}
</style>
