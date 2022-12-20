<template>
  <div class="vp-doc">
    <h2
      id="评论"
      tabindex="-1"
    >
      评论
      <a
        class="header-anchor"
        href="#评论"
        aria-hidden="true"
      >
        #
      </a>
    </h2>
    <div ref="commentRef"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from "vue"
import { Comment } from "@tomiaa/comment"
import { useRoute } from "vitepress"

const route = useRoute()
const commentRef = ref()

const client_id =
  "f4aa41f44d9bced2e46eb42ef45e3f6abdba0f012f3ffc25588f0c352571b9ac"
const client_secret = `1575e653b753d7706b2d1ed3dc2a96e04050a85ec199a77598bc5e8f2175b266`
let inst: any

watch(
  () => route.path,
  async () => {
    await nextTick()
    inst?.getList()
  },
  {
    deep: true,
  }
)
onMounted(() => {
  inst = new Comment({
    client_id,
    client_secret,
    owner: "tomiaa",
    repo: "kuangyx.cn",
    prefix: "[kuangyx.cn]",
  })
  inst.mount(commentRef.value)
})
</script>
