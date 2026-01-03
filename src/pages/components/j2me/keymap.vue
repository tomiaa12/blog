<template>
  <div class="j2me-keymap">
    <el-table
      :data="rows"
      size="small"
      border
      table-layout="auto"
    >
      <el-table-column prop="action" label="功能" min-width="140" />

      <el-table-column label="PC 键盘按键" min-width="280">
        <template #default="{ row }">
          <template v-if="row.keysType === 'arrows'">
            <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd>
          </template>
          <template v-else-if="row.keysType === 'arrowsWasd'">
            <kbd>↑</kbd> / <kbd>↓</kbd> / <kbd>←</kbd> / <kbd>→</kbd> 或 <kbd>W</kbd> / <kbd>S</kbd> / <kbd>A</kbd> / <kbd>D</kbd>
          </template>
          <template v-else-if="row.keysType === 'multi'">
            <span v-for="(k, i) in row.keys" :key="i">
              <kbd>{{ k }}</kbd>
              <span v-if="i < row.keys.length - 1"> 或 </span>
            </span>
          </template>
          <template v-else-if="row.keysType === 'kbd'">
            <kbd>{{ row.keys }}</kbd>
          </template>
          <template v-else-if="row.keysType === 'range'">
            <kbd>{{ row.keysFrom }}</kbd>-<kbd>{{ row.keysTo }}</kbd>
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="desc" label="说明" min-width="320">
        <template #default="{ row }">
          <template v-if="row.descType === 'html'">
            <strong>长按 &gt; 1 秒</strong>：打开文件选择（导入到 <code>/Phone</code>）
          </template>
          <template v-else>
            {{ row.desc }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
type KeymapRow =
  | {
      action: string
      keysType: "arrows"
      descType?: "text"
      desc: string
    }
  | {
      action: string
      keysType: "arrowsWasd"
      descType?: "text"
      desc: string
    }
  | {
      action: string
      keysType: "multi"
      keys: string[]
      descType?: "text"
      desc: string
    }
  | {
      action: string
      keysType: "kbd"
      keys: string
      descType?: "text" | "html"
      desc: string
    }
  | {
      action: string
      keysType: "range"
      keysFrom: string
      keysTo: string
      descType?: "text"
      desc: string
    }

const rows: KeymapRow[] = [
  { action: "上 / 下 / 左 / 右", keysType: "arrowsWasd", desc: "方向控制" },
  { action: "确认（OK）", keysType: "multi", keys: ["Enter", "空格"], desc: "相当于确认键" },
  { action: "左软键（选择）", keysType: "kbd", keys: "Q", desc: "相当于选择" },
  { action: "右软键（返回）", keysType: "kbd", keys: "E", desc: "相当于返回" },
  { action: "数字键", keysType: "range", keysFrom: "0", keysTo: "9", desc: "主键盘数字行或小键盘" },
  { action: "星号", keysType: "kbd", keys: "*", descType: "html", desc: "" },
  { action: "井号", keysType: "kbd", keys: "#", desc: "常用于游戏内功能键" },
]
</script>

<style scoped>
.j2me-keymap {
  padding: 20px;
}
.j2me-keymap kbd {
  display: inline-block;
  padding: 0 6px;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 20px;
}
</style>


