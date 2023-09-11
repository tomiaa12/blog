import { Ref, nextTick, ref, watch } from "vue"
import { List, Message } from "../type"
import { Emits } from "./props"

type Params = {
  name: string
  list: List[]
  id: number
  message: Message[]
  msg: Ref<Message>
  emits: Emits
  total?: number
  caseSensitive?: boolean
  isPrompt?: boolean
}

type Context = {
  index: number
  step: number
  score: number
}

// 运行中的群或私聊
export const runing: { [prop: string]: boolean } = {}
// 上下文
const contextAll: { [prop: string]: { [prop: string]: Context } } = {}

const randomInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

export const guessit = async ({
  name, // 游戏名称，唯一值
  list, // 文件 + 答案
  total = 5, // 每次出题数量
  id, // 房间/用户 id
  msg, // 第一句添加的msg
  caseSensitive = true, // 大小写区分
  isPrompt = true, // 开启提示
  message, // 消息列表
  emits,
}: Params) => {
  // 是否运行中
  if (runing[id]) return

  // 初始化
  const context = (contextAll[name] ??= {})
  runing[id] = true
  const temp: Context = (context[id] = {
    index: -1,
    step: 0, // 当前步骤
    score: 0, // 答对个数
  })

  const oldIndex: number[] = []
  const random = (): number => {
    const temp = randomInteger(0, list.length - 1)
    if (oldIndex.includes(temp)) return random()

    oldIndex.push(temp)
    return temp
  }

  let timer1: number, timer2: number

  const sendFileBox = async () => {
    temp.step++

    const send = async() => {
      if (temp.step > total) {
        message.push({
          content: `游戏结束，猜对${temp.score}个`,
          role: "assistant",
        })
        stop()
        emits("saveChats")
        delete context[id]
        delete runing[id]
        return
      }
      temp.index = random()

      const data = list[temp.index]
      
      const t = ref<Message>({
        role: "assistant",
        content: `第${temp.step}题 ${data.topic || ""}↓↓↓`,
        loading: true,
      })
      message.push(t.value)
      await nextTick()
      delete t.value.loading 

      emits("saveChats")

      const path = Array.isArray(data.path)
        ? data.path[randomInteger(0, data.path.length)]
        : data.path

      try {
        if (path) {
          message.push({
            role: "assistant",
            content: path,
          })
        } else {
          message.push({
            role: "assistant",
            content: data.desc,
          })
        }
        emits("saveChats")
      } catch {
        send()
        return
      }

      timer1 = window.setTimeout(() => {
        const i = randomInteger(0, data.answer.length - 1)
        isPrompt &&
          message.push({
            role: "assistant",
            content: `⏳还剩 30 秒！提示：${data.answer
              .split("")
              .map((str: string, index: number) => (i === index ? str : "◼"))
              .join("")}`,
          })
        emits("saveChats")
        timer2 = window.setTimeout(async () => {
          message.push({
            role: "assistant",
            content: `😜时间到！没猜对。答案是「${data.answer}」。`,
          })
          emits("saveChats")
          sendFileBox()
        }, 30000)
      }, 30000)
    }

    await send()
  }

  msg.value.content = `开始${name}！一共${total}题！每题限时一分钟。`
  emits("saveChats")

  await sendFileBox()

  const stop = watch(
    () => message.length,
    async () => {
      const last = message[message.length - 1]
      if (last.role !== "user") return

      let answer = list[temp.index].answer
      let content = last.content

      if (!caseSensitive) {
        content = content.toLowerCase().trim()
        answer = answer.toLowerCase()
      }
      if (content === answer) {
        clearTimeout(timer1)
        clearTimeout(timer2)
        message.push({
          role: 'assistant',
          content: `🎉恭喜猜对了！答案是「${
            list[temp.index].answer
          }」。`,
        })
        temp.score ++
        await sendFileBox()
      }
    }
  )
}
