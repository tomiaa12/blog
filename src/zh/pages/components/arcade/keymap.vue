<template>
  <div class="arcade-keymap">
    <div class="bar">
      <div class="tabs">
        <button
          v-for="index in arcadeControls.playerCount"
          :key="index"
          type="button"
          class="tab"
          :class="{ on: current === index - 1 }"
          @click="current = index - 1"
        >
          P{{ index }}
        </button>
        <button
          v-if="arcadeControls.playerCount < 4"
          type="button"
          class="tab add"
          @click="handleAdd"
        >
          + P{{ arcadeControls.playerCount + 1 }}
        </button>
      </div>
      <div class="ops">
        <button
          v-if="arcadeControls.playerCount > 2"
          type="button"
          class="link"
          @click="handleRemove"
        >
          移除 P{{ arcadeControls.playerCount }}
        </button>
        <button
          type="button"
          class="link"
          @click="resetArcadeControls"
        >
          重置
        </button>
      </div>
    </div>

    <div
      v-for="group in groups"
      :key="group.id"
      class="group"
    >
      <div class="group-title">{{ group.label }}</div>
      <div class="keys">
        <button
          v-for="action in group.actions"
          :key="action.id"
          type="button"
          class="key"
          :class="{
            wait: isListening(action.id),
            clash: conflictKeys.has(arcadeControls.maps[current][action.id]),
          }"
          @click="startListen(current, action.id)"
        >
          <span>{{ action.label }}</span>
          <kbd>{{ listenText(action.id) }}</kbd>
        </button>
      </div>
    </div>

    <p
      v-if="conflicts.length"
      class="tip warn"
    >
      按键冲突：{{ conflicts.map(item => `${keyLabel(item.key)}（${item.list.join("、")}）`).join("；") }}
    </p>
    <p class="tip">
      默认双人。点按键后按下新键即可改键，Esc 取消。手柄即插即用。
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue"
import {
  ACTION_META,
  addPlayer,
  applyListenKey,
  arcadeControls,
  cancelListen,
  findKeyConflicts,
  keyLabel,
  removePlayer,
  resetArcadeControls,
  startListen,
} from "./controls"

const current = ref(0)

const groups = [
  { id: "move", label: "方向", actions: ACTION_META.filter(item => item.group === "move") },
  { id: "btn", label: "按钮", actions: ACTION_META.filter(item => item.group === "btn") },
  { id: "sys", label: "系统", actions: ACTION_META.filter(item => item.group === "sys") },
]

const conflicts = computed(() => findKeyConflicts())
const conflictKeys = computed(() => new Set(conflicts.value.map(item => item.key)))

function isListening(action: string) {
  const listen = arcadeControls.listening
  return Boolean(listen && listen.player === current.value && listen.action === action)
}

function listenText(action: (typeof ACTION_META)[number]["id"]) {
  if (isListening(action)) return "按下新键"
  return keyLabel(arcadeControls.maps[current.value][action])
}

function handleAdd() {
  addPlayer()
  current.value = arcadeControls.playerCount - 1
}

function handleRemove() {
  const last = arcadeControls.playerCount - 1
  removePlayer(last)
  if (current.value >= arcadeControls.playerCount) {
    current.value = arcadeControls.playerCount - 1
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!arcadeControls.listening) return
  e.preventDefault()
  e.stopPropagation()
  applyListenKey(e)
}

onMounted(() => {
  window.addEventListener("keydown", onKeydown, true)
})

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown, true)
  cancelListen()
})
</script>

<style scoped>
.arcade-keymap {
  width: 100%;
}
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tab,
.link {
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border-radius: 6px;
  cursor: pointer;
  line-height: 1;
}
.tab {
  padding: 6px 10px;
  font-size: 13px;
}
.tab.on {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.tab.add {
  color: var(--vp-c-text-2);
}
.ops {
  display: flex;
  gap: 6px;
}
.link {
  padding: 6px 8px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.group {
  margin-bottom: 10px;
}
.group-title {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.keys {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.key {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 58px;
  padding: 6px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: inherit;
  cursor: pointer;
}
.key span {
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.key kbd {
  display: inline-block;
  min-width: 1.6em;
  padding: 0 6px;
  border: 1px solid var(--vp-c-divider);
  border-bottom-width: 2px;
  border-radius: 6px;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 20px;
  text-align: center;
}
.key.wait,
.key.wait kbd {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.key.clash kbd {
  border-color: #e6a23c;
  color: #e6a23c;
}
.tip {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.5;
  color: var(--vp-c-text-3);
}
.tip.warn {
  color: #e6a23c;
}
</style>
