<script setup lang="ts">
import * as PIXI from "pixi.js";

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x1099bb,
  resolution: window.devicePixelRatio || 1, // 像素比
  antialias: true, // 抗锯齿
});

document.documentElement.appendChild(app.view as any);

// 添加资源 名称 地址
PIXI.Assets.add(
  "tom",
  "https://p7.itc.cn/images01/20210825/6dae02ab52594d13805694ab6c4921cb.jpeg"
);
PIXI.Assets.add(
  "jian",
  "https://img.zcool.cn/community/01349256546b796ac7251c948550fd.jpg@1280w_1l_2o_100sh.jpg"
);

// 异步加载资源
const texturePromise = PIXI.Assets.load(["tom", "jian"]);

texturePromise.then((texture) => {
  // 创建精灵
  const sprite = new PIXI.Sprite(texture.tom);

  // 锚点
  sprite.anchor.set(0.5);

  sprite.x = app.screen.width / 2;
  sprite.y = app.screen.height / 2;

  sprite.scale.set(0.2);

  app.stage.addChild(sprite);

  // 添加旋转动画
  app.ticker.add((detail) => {
    // console.log(detail);
    sprite.rotation += 0.01 * detail;
  });
  // 添加事件前设置为 true, 开启交互
  sprite.interactive = true;
  // 精灵添加点击事件
  sprite.on("click", (e) => {
    console.log(e, "sprite click!");
  });
});
</script>

<template>
  <main></main>
</template>
