<script setup lang="ts">
import * as PIXI from "pixi.js";
// import { OutlineFilter } from "pixi-filters";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1, // 像素比
  antialias: true, // 抗锯齿
});

document.documentElement.appendChild(app.view as any);

// 创建一个精灵
const sprite = PIXI.Sprite.from(
  "https://p7.itc.cn/images01/20210825/6dae02ab52594d13805694ab6c4921cb.jpeg"
);
sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;
sprite.anchor.set(0.5);
sprite.scale.set(0.3);
app.stage.addChild(sprite);

// 创建一个轮廓滤镜
// const outlineFilter = new PIXI.OutlineFilter(2, 0x000000);

// PIXI.Filter.

console.log(PIXI);
</script>

<template>
  <main></main>
</template>
