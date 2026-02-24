---
class: java-game
layout: page
footer: false
---

# 🕹 经典 Java 游戏

<script setup>
import J2meEmulator from './components/j2me.vue'
import J2meKeymap from './components/j2me/keymap.vue'
</script>

<J2meKeymap />

<J2meEmulator />

<style>
.java-game {
  max-width: 1600px;
  margin: 0 auto;
}
.java-game h1 {
  padding: 20px 0 0 20px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}
</style>
