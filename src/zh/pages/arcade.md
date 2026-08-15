---
class: arcade-game
layout: page
footer: false
---

# 🕹 街机游戏

<script setup>
import ArcadeEmulator from './components/arcade.vue'
</script>

<ClientOnly>
  <ArcadeEmulator />
</ClientOnly>

<style>
.arcade-game {
  max-width: 1600px;
  margin: 0 auto;
}
.arcade-game h1 {
  padding: 20px 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}
</style>
