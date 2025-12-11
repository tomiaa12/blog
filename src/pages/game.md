---
class: game
layout: page
footer: false
---

<script setup>
import game from './components/game.vue'
import EditorPluginTip from '@/components/EditorPluginTip.vue'

const plugins = [
  {
    name: 'VSCode 插件',
    url: 'https://marketplace.visualstudio.com/items?itemName=tomiaa12.nes-games'
  },
  {
    name: 'Cursor 插件',
    url: 'https://open-vsx.org/extension/tomiaa12/nes-games'
  }
]
</script>

# 游戏{style="display: none"}

<ClientOnly>
  <EditorPluginTip 
    :plugins="plugins" 
    message="VSCode 和 Cursor 插件版已上线，支持在编辑器中畅玩经典 NES 游戏："
    storageKey="game-plugin-tip-dismissed"
  />
  <game/>
</ClientOnly>
