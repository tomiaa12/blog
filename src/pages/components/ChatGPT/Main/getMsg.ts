import { Ref } from "vue"
import axios from "axios"
import { OpenAIStream } from "./openAIStream"
import { guessit } from "./guessit"
import { List, Message } from "../type"
import { Emits, Props } from "./props"
import {
  cloudmusicComment,
  draw,
  getGuessit,
  hitokoto,
  morningPaper,
  poison,
  rainbow,
  sentence,
  tiangou,
  translate,
} from "@/api"
import { baseUrl } from "@/utils"

type Fun = { [props: string]: () => Promise<any> }

type Params = {
  msg: Ref<Message>
  props: Props
  emits: Emits
  message: Message[]
  inputVal: string
}
// export const orginHost =  "https://api.kuangyx.cn"
export const orginHost = import.meta.env.DEV
  ? "http://localhost:3000"
  : "https://api.kuangyx.cn"

const guessitCache: { [prop: string]: List[] } = {}
const getList = async (type: string) => {
  if (guessitCache[type]) return guessitCache[type]

  const { data } = await getGuessit(type)
  data.forEach((i: List) => {
    if (!i.path) return
    const reg = /^(\.\.\/|\.\/src\/)/
    if (Array.isArray(i.path)) {
      i.path = i.path.map(i => i.replace(reg, "/"))
      return
    }
    i.path = i.path.replace(reg, "/")
  })
  guessitCache[type] = data
  return data
}

const Functions = [
  "一句",
  "一言",
  "彩虹屁",
  "毒鸡汤",
  "JS问题测验",
  "舔狗日记",
  "网易云热评",
  "猜奥特曼",
  "猜电影",
  "猜LOL/猜英雄联盟",
  "二次元浓度测试",
  "画图 + 空格 + 内容",
  "翻译 + 空格 + 文字",
]

export default async ({ msg, props, emits, message, inputVal }: Params) => {
  const guessitLOL = async () => {
    const list = await getList("lol")
    await guessit({
      name: "看图、听音猜LOL英雄",
      list,
      id: props.modelValue!.time,
      message: props.modelValue!.message,
      msg,
      emits,
    })
  }
  const switchFun: Fun = {
    async 网易云热评() {
      const { data } = await cloudmusicComment()
      msg.value.content = data
    },
    async 一句() {
      const { data } = await sentence()
      msg.value.content = data
    },
    async 早报() {
      const { data } = await morningPaper()
      msg.value.content = data
    },
    async 彩虹屁() {
      const { data } = await rainbow()
      msg.value.content = data
    },
    async 毒鸡汤() {
      const { data } = await poison()
      msg.value.content = data
    },
    async 舔狗日记() {
      const { data } = await tiangou()
      msg.value.content = data
    },
    async 一言() {
      const { data } = await hitokoto()
      msg.value.content = data
    },
    async 猜奥特曼() {
      const list = await getList("ultraman")
      await guessit({
        name: "看图猜奥特曼",
        list,
        id: props.modelValue!.time,
        message: props.modelValue!.message,
        msg,
        emits,
      })
    },
    猜英雄联盟: guessitLOL,
    猜LOL: guessitLOL,
    猜lol: guessitLOL,
    async JS问题测验() {
      const list = await getList("jsQuestion")
      await guessit({
        name: "JS问题测验",
        list,
        id: props.modelValue!.time,
        message: props.modelValue!.message,
        msg,
        emits,
        isPrompt: false,
        caseSensitive: false,
      })
    },
    async 猜电影() {
      const list = await getList("movie")
      await guessit({
        name: "看图猜电影",
        list,
        id: props.modelValue!.time,
        message: props.modelValue!.message,
        msg,
        emits,
      })
    },
    async 二次元浓度测试() {
      const list = await getList("twoDimension")
      await guessit({
        name: "二次元浓度测试",
        list,
        id: props.modelValue!.time,
        message: props.modelValue!.message,
        msg,
        emits,
        isPrompt: false,
        caseSensitive: false,
      })
    },
    async default() {
      /* 数据流 */
      const stream = await OpenAIStream(
        `${baseUrl}/gpt`,
        message.map(i => ({ content: i.content, role: i.role })),
        "",
        props.modelValue!.model
      )

      const reader = stream.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          emits("saveChats")
          break
        }
        msg.value.content += value
      }

      /* 数据流 --- end */
    },
  }

  const baseStrTrigger: Fun = {
    async 画图() {
      const query = inputVal.replace(/^画图/, "")
      const { data } = await draw(query)
      msg.value.content = data
    },
    async 猜() {
      const temp = Object.keys(switchFun)
      if (!temp.includes(inputVal)) {
        msg.value.content = `没有找到${inputVal}，你可以@我+下列关键词：\n${Functions.join(
          "\n"
        )}`
      }
    },
    async 翻译() {
      const query = inputVal.replace(/^翻译/, "")
      const { data } = await translate(query)
      msg.value.content = data.data
    },
  }

  const triggerFun =
    baseStrTrigger[
      Object.keys(baseStrTrigger).find(i =>
        new RegExp(`^${i}`).test(inputVal)
      ) as any
    ]

  return (switchFun[inputVal] || triggerFun || switchFun.default)()
}
