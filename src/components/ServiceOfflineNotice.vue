<template>
  <el-alert
    class="service-offline-notice"
    type="warning"
    :closable="false"
    show-icon
  >
    <template #title> 服务暂时下线 </template>
    <p>当前页面依赖的服务已暂停，相关功能暂时不可用。</p>
    <p>等服务器续期并恢复后，会第一时间重新开放。</p>
  </el-alert>
</template>

<style scoped>
.service-offline-notice {
  margin: 16px 0 24px;
}

.service-offline-notice :deep(.el-alert__title) {
  font-size: 16px;
  font-weight: 600;
}

.service-offline-notice p {
  margin: 6px 0 0;
  line-height: 1.7;
}
</style>
