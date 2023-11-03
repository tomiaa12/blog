<template>
  <div
    v-loading
    class="site_pv"
  >
    本站总访问量
    <span id="busuanzi_value_site_pv">
      <el-icon-loading class="loading-icon" />
    </span>
    次，访客数
    <span id="busuanzi_value_site_uv">
      <el-icon-loading class="loading-icon" />
    </span>
    人次
  </div>
</template>

<style>
@media (min-width: 960px) {
  .home .VPHero.has-image .main {
    max-width: 640px;
  }
}

.VPFeatures + .VPFeatures,
.site_pv ~ .site_pv {
  display: none;
}

.site_pv {
  text-align: center;
  padding: 2em;
}
</style>
