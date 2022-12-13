<template>
  <el-popover
    placement="bottom"
    :width="300"
    trigger="click"
  >
    <el-tabs>
      <el-tab-pane
        v-for="item in list"
        :label="item.title"
      >
        <el-scrollbar max-height="300px">
          <div
            v-for="(item1, index) of item.content"
            class="container"
            @click="onClickItem({ item: item1, index })"
          >
            <slot
              :item="item1"
              :index="index"
            >
              <div
                v-if="item1.avatar"
                class="avatar"
              >
                <el-avatar :src="item1.avatar" />
              </div>
              <div class="content">
                <p
                  v-if="item1.title || item1.tag"
                  class="title"
                >
                  <span v-if="item1.title">{{ item1.title }}</span>
                  <el-tag
                    v-if="item1.tag"
                    :type="item1.tagType"
                    size="small"
                    >{{ item1.tag }}</el-tag
                  >
                </p>
                <time v-if="item1.time">{{ item1.time }}</time>
                <p
                  v-if="item1.desc"
                  class="desc"
                >
                  {{ item1.desc }}
                </p>
              </div>
            </slot>
          </div>
        </el-scrollbar>
        <div class="actions">
          <div
            v-for="(item2, index) of actions"
            @click="onClickAction({ item: item2, index })"
          >
            <slot
              name="action"
              :item="item2"
              :index="index"
            >
              <el-icon v-if="item2.icon">
                <component :is="item2.icon" />
              </el-icon>
              <div
                v-if="item2.text"
                class="item2"
              >
                {{ item2.text }}
              </div>
            </slot>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <template #reference>
      <el-badge
        :value="value"
        :max="max"
        :is-dot="isDot"
      >
        <el-icon>
          <slot name="icon">
            <component :is="icon"></component>
          </slot>
        </el-icon>
      </el-badge>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { notificationProps, NotificationEmits } from "./notification"
defineOptions({
  name: "KNotification",
})

defineProps(notificationProps)
const emits = defineEmits(["clickItem", "clickAction"])

// 点击列表
const onClickItem: NotificationEmits["clickItem"] = ({ item, index }) => {
  emits("clickItem", { item, index })
}

// 点击控制项
const onClickAction: NotificationEmits["clickAction"] = ({ item, index }) => {
  emits("clickAction", { item, index })
}
</script>

<style lang="scss" scoped>
.el-badge {
  cursor: pointer;
}
// tab 栏切换
.el-tabs {
  margin: -12px;
  :deep(.el-tabs__nav) {
    width: 100%;
    display: flex;
    .el-tabs__item {
      flex: 1;
      text-align: center;
    }
  }
}
// 列表
.container {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: var(--el-transition-all);
  &:hover {
    background-color: var(--el-color-info-light-8);
    border-radius: var(--el-border-radius-base);
  }
  .content {
    flex: 3;
    p {
      margin: 0;
    }
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    time,
    .desc {
      color: var(--el-color-info-light-3);
    }
  }
  .avatar {
    flex: 1;
    height: 100%;
  }
}

// 控制
.actions {
  display: flex;
  height: 35px;
  border-top: 1px solid var(--el-border-color);
  padding: 0 1em;
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex: 1;
    transition: var(--el-transition-all);
    &:hover {
      color: var(--el-color-primary);
    }
    + div {
      border-left: 1px solid var(--el-border-color);
    }
    .el-icon {
      margin: 0 0.4em;
    }
  }
}
</style>
