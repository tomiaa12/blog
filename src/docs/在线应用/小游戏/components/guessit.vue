<template>
  <div
    class="min-h100"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <el-image
      v-if="isImg"
      ref="imgRef"
      :src="baseURL + path"
      fit="contain"
      :referrerpolicy="isHttpUrl ? 'never' : undefined"
      @load="setZoom"
      @error="error"
    >
      <template #placeholder>
        <div class="image-slot">
          <p>图片加载中...</p>
        </div>
      </template>
      <template #error>
        <div class="image-slot">
          <p>图片加载失败...</p>
          <el-button
            text
            bg
            @click="getData"
          >
            换一题
          </el-button>
        </div>
      </template>
    </el-image>
    <div class="answer-container">
      <ol
        class="msg"
        ref="msgRef"
      >
        <li class="sticky">
          当前分数: {{ score }} <span>最高分：{{ highestScore }}</span>
        </li>
        <li
          v-for="i of msg"
          :style="{
            textDecoration: i.lineThrough ? 'line-through' : '',
          }"
        >
          <span v-if="i.notTypeIt">
            {{ i.value }}
          </span>
          <Text
            v-else
            :text="i.value"
            loading
            once
            @end="i.isTypeItEnd = true"
          />
          <template v-if="i.isTypeItEnd">
            <template v-if="'answers' in i">
              <el-icon style="height: 28px">
                <el-icon-select
                  v-if="i.answers"
                  style="color: var(--el-color-success)"
                />
                <el-icon-close-bold
                  v-else
                  style="color: var(--el-color-error)"
                />
              </el-icon>

              <Text
                :style="{
                  color: `var(${
                    i.answers ? '--el-color-success' : '--el-color-error'
                  })`,
                }"
                :text="i.answers ? '🎉答对啦，+1 分' : '😜答错啦，-1 分'"
                loading
                once
              />
            </template>
            <el-button
              type="primary"
              size="small"
              v-if="i.btnText"
              @click="i.btnFun"
              text
              bg
            >
              {{ i.btnText }}
            </el-button>
          </template>
        </li>
      </ol>
      <div class="input-box">
        <el-input
          v-model="val"
          class="keyword-input"
          placeholder="输入答案"
          clearable
          size="large"
          maxlength="50"
          show-word-limit
          :disabled="disabled"
          @keydown.enter="enter"
        />
        <el-button
          type="primary"
          @click="enter"
          :disabled="disabled"
        >
          确定
        </el-button>
      </div>
    </div>
    {{ info }}
  </div>
</template>

<script setup lang="ts">
import { ref, withDefaults, nextTick, computed, watch } from "vue"
import { randomInteger } from "@tomiaa/utils"
import { orginHost } from "@/api"
import mediumZoom from "medium-zoom"
import Text from "@/components/Text.vue"

type Info = {
  path?: string | string[]
  answer?: string
  optionsAnswer?: string
  options?: string[]
}

type Msg = {
  value: string
  answers?: boolean
  isTypeItEnd?: boolean
  btnText?: string
  btnFun?: Function
  pushMsgKey?: Symbol
  notTypeIt?: boolean
  lineThrough?: boolean
}

type SaveData = {
  score: number
  key: number
  count: number
}

const props = withDefaults(
  defineProps<{
    api: Function
    type: string
    name: string
  }>(),
  {}
)

const loading = ref(false)
const info = ref<Info>()
const val = ref("")
const msg = ref<Msg[]>([])

const msgRef = ref()

const score = ref(3)
const disabled = ref(true)

let key = Date.now(),
  count = 0

const pushMsg = (data: Msg): Promise<Msg> => {
  return new Promise(resolve => {
    const pushMsgKey = Symbol("push")
    data.pushMsgKey = pushMsgKey
    msg.value.push(data)
    const temp = msg.value.find(i => i.pushMsgKey === pushMsgKey)!
    if (data.notTypeIt) return resolve(temp)
    const stop = watch(temp, () => {
      if (!temp.isTypeItEnd) return
      resolve(temp)
      stop()
      delete temp.pushMsgKey
    })
  })
}

const init = async () => {
  await pushMsg({
    value: `开始${props.name}，每题限时一分钟，低于0分游戏结束！`,
  })
  await getData()
  key = Date.now()
  score.value = 3
}

watch(
  () => msg.value.length,
  async () => {
    await nextTick()
    setTimeout(() => {
      if (msgRef.value) msgRef.value.scrollTop = msgRef.value.scrollHeight
    }, 30)
  }
)
const error = async () => {
  const temp = await pushMsg({
    value: "图片加载失败...",
    btnText: "重新获取",
    btnFun: () => {
      delete temp.btnFun
      delete temp.btnText
      getData()
    },
  })
}
const getData = async () => {
  loading.value = true
  await pushMsg({
    value: "正在获取题目...",
  })
  try {
    const { data } = await props.api(props.type)
    info.value = data
  } catch {
    const temp = await pushMsg({
      value: "获取题目失败...",
      btnText: "重新获取",
      btnFun: () => {
        delete temp.btnFun
        delete temp.btnText
        getData()
      },
    })
  } finally {
    loading.value = false
  }
}

init()

const path = computed(() => {
  const path = info.value?.path
    ? Array.isArray(info.value.path)
      ? info.value.path[randomInteger(0, info.value.path.length)]
      : info.value.path
    : ""
  return path?.replace(/^(\.\/src)|(\.\.)/, "")
})

let timer1: any, timer2: any

let curCountdown: Msg
const setZoom = async () => {
  await nextTick()
  const zoom = mediumZoom(imgRef.value.$el.children[0])
  zoom.update({ background: "var(--el-color-info-light-9)" })

  disabled.value = false

  let n = 30
  let countdown: Msg = {
    value: `⏳还剩 ${n} 秒！`,
    notTypeIt: true,
  }

  curCountdown = await pushMsg(countdown)
  timer1 = setInterval(async () => {
    curCountdown.value = `⏳还剩 ${--n} 秒！`
    if (n <= 0) {
      curCountdown.lineThrough = true
      clearInterval(timer1)
      await pushMsg({
        value: `😜时间到！没猜对。答案是「${info.value!.answer}」。`,
      })
      score.value--
      score.value && getData()
    }
  }, 1000)
  timer2 = setTimeout(async () => {
    const answer = info.value?.answer || ""
    if (!answer) return
    const i = randomInteger(0, answer.length - 1)
    await pushMsg({
      value:
        "提示：" +
        (answer.length === 1
          ? "一个字"
          : answer
              .split("")
              .map((str: string, index: number) => (i === index ? str : "◼"))
              .join("")),
    })
  }, parseInt((n * 1000) / 2 + ""))
}

const imgRef = ref()

const isHttpUrl = computed(() => /^http/.test(path.value))

const isImg = computed(
  () =>
    (/^\//.test(path.value!) || isHttpUrl.value) &&
    /(\.png|\.jpg|\.gif|\.webp)$/.test(path.value!)
)

const isAudio = computed(
  () => (/^\//.test(path.value) || isHttpUrl.value) && /\.mp3$/.test(path.value)
)

const baseURL = computed(() => (isHttpUrl.value ? "" : orginHost))

const randomList = computed(
  () => info.value?.options?.sort(() => Math.random() - 0.5) || []
)
const numberToLetter = (num: number) =>
  String.fromCharCode("A".charCodeAt(0) + num)

const historiScore = ref<{ [prop: string]: SaveData[] }>(
  JSON.parse(localStorage.getItem("games") || "")
)

const highestScore = computed(
  () =>
    historiScore.value[props.name].sort((a, b) => b.score - a.score)[0].score
)

watch(
  historiScore,
  () => {
    localStorage.setItem("games", JSON.stringify(historiScore.value))
  },
  {
    deep: true,
  }
)

watch(score, async () => {
  historiScore.value[props.name] ??= [{ key, score: score.value, count }]
  if (!historiScore.value[props.name].find(i => i.key === key))
    historiScore.value[props.name].push({ key, score: score.value, count })

  const temp = historiScore.value[props.name].find(i => i.key === key)!
  temp.count = count
  if (score.value > temp.score) {
    temp.score = score.value
  }
  if (score.value > highestScore.value) {
    await pushMsg({ value: "🎉超过了最高分，当前得分" + score.value })
  }

  if (score.value <= 0) {
    curCountdown.lineThrough = true
    await pushMsg({
      value: `😜游戏结束，累计答对${count}个。`,
      btnText: "再玩一次",
      btnFun: init,
    })
    score.value = 0
    clearInterval(timer1)
    clearInterval(timer2)
  }
})

const enter = async () => {
  const content = val.value.toLowerCase().trim()
  if (!content) return
  disabled.value = true
  const answer = info.value?.answer?.toLowerCase()
  val.value = ""
  const answers = answer === content
  if (answers) {
    count++
    await pushMsg({ value: answer, answers })
    score.value++
    curCountdown.lineThrough = true
    clearInterval(timer1)
    clearInterval(timer2)
    await getData()
  } else {
    await pushMsg({ value: content, answers })
    score.value--
    disabled.value = false
  }
}
</script>
<style lang="scss" scoped>
.min-h100 {
  min-height: var(--min-h100);
}

.el-input {
  --el-input-border-radius: 0;
  display: block;
  :deep().el-input__wrapper {
    width: 100%;
    height: 50px;
  }
}

.el-image {
  display: block;
  margin: 0 auto 20px;
  height: 350px;
}

.image-slot {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: inherit;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}

.answer-container {
  width: 80%;
  margin: auto;
  .input-box {
    position: relative;
    :deep() .el-input__wrapper {
      padding-right: 6em;
    }
    .el-button {
      position: absolute;
      right: 1em;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .msg {
    overflow: auto;
    scroll-behavior: smooth;
    height: 250px;
    width: 100%;
    text-indent: 0.4em;
    border: var(--el-border);
    border-bottom: none;
    .sticky {
      position: sticky;
      top: 0;
      background-color: var(--el-bg-color);
      font-size: 18px;
      border-bottom: solid 1px var(--el-border-color);
      padding: 10px 0;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      padding-right: 0.4em;
    }
    li {
      display: flex;
      svg {
        font-size: 28px;
      }

      .el-button {
        height: 28px;
      }
    }
    :deep() .gpt-text {
      margin-left: 0;
      margin-right: 0.3em;
      p {
        margin: 0;
      }
    }
  }
}

ol {
  margin: 0;
  padding: 0;
}
li {
  list-style: none;
  padding: 2px 0;
  margin: 0 !important;
}
</style>
