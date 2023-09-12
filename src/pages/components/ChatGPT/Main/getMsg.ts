import { Ref } from "vue"
import axios from "axios"
import { OpenAIStream } from "./openAIStream"
import { guessit } from "./guessit"
import { List, Message } from "../type"
import { Emits, Props } from "./props"

type Fun = { [props: string]: () => Promise<any> }

type Params = {
  msg: Ref<Message>
  props: Props
  emits: Emits
  message: Message[]
  inputVal: string
}
export const orginHost =  "https://api.kuangyx.cn"
// export const orginHost = import.meta.env.DEV ? "http://localhost:3000" : "https://api.kuangyx.cn"

const baseUrl = orginHost + "/api"

const guessitCache: { [prop: string]: List[] } = {}
const getList = async (type: string) => {
  if (guessitCache[type]) return guessitCache[type]

  const { data } = await axios.post(`${baseUrl}/getGuessit`, { type })
  data.forEach((i: List) => {
    if(!i.path) return
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
      const { data } = await axios.get(`${baseUrl}/cloudmusicComment`)
      msg.value.content = data
    },
    async 一句() {
      const { data } = await axios.get(`${baseUrl}/hitokoto`)
      msg.value.content = data
    },
    async 早报() {
      const { data } = await axios.get(`${baseUrl}/morningPaper`)
      msg.value.content = data
    },
    async 彩虹屁() {
      const { data } = await axios.get(`${baseUrl}/rainbow`)
      msg.value.content = data
    },
    async 毒鸡汤() {
      const { data } = await axios.get(`${baseUrl}/poison`)
      msg.value.content = data
    },
    async 舔狗日记() {
      const { data } = await axios.get(`${baseUrl}/tiangou`)
      msg.value.content = data
    },
    async 一言() {
      const { data } = await axios.get(`${baseUrl}/hitokoto`)
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
    // async 画图() {
    //   text = ""
    //   const query = msg.replace(/^画图/, "")
    //   const { data } = await translate(query, "en")
    //   // 刷新 token
    //   const getToken = async () => {
    //     console.log("画图getoken")
    //     const { data } = await axios.post(
    //       "https://www.ai-yuxin.space/fastapi/api/user/login",
    //       {
    //         account: "tomiaa",
    //         password: "5d86ed1730a40de164175de5c01b85dc",
    //       }
    //     )
    //     drawToken = data.token
    //     drawUserId = data.user_id
    //   }
    //   const draw = async () => {
    //     const d = await axios.post(
    //       "https://www.ai-yuxin.space/fastapi/api/painting/stable_diffusion",
    //       {
    //         user_id: drawUserId,
    //         token: drawToken,
    //         prompt: data,
    //         negative_prompt: "",
    //         width: 512,
    //         height: 512,
    //         number: 1,
    //         cfg: 7,
    //         mode: "toonyou_beta6",
    //         method: "Euler a",
    //         steps: 25,
    //         seed: -1,
    //         facial_restoration: false,
    //         image: "0",
    //         denoising_strength: 0,
    //       }
    //     )
    //     const url = `https://www.ai-yuxin.space/${d.data[0]}`
    //     const imageFileBox = FileBox.fromUrl(url)
    //     await message.say(imageFileBox)
    //   }
    //   try {
    //     if (!drawToken) await getToken()
    //     await draw()
    //   } catch {
    //     await getToken()
    //     await draw()
    //   }
    // },
    // async 猜() {
    //   const temp = Object.keys(switchFun)
    //   if (!temp.includes(msg)) {
    //     text = `没有找到${msg}，你可以@我+下列关键词：\n${Functions.join("\n")}`
    //   }
    // },
    // async 翻译() {
    //   text = ""
    //   const query = msg.replace(/^画图/, "")
    //   const { data } = await translate(query, "zh")
    //   text = data
    // },
  }

  const triggerFun =
    baseStrTrigger[
      Object.keys(baseStrTrigger).find(i =>
        new RegExp(`^${i}`).test(inputVal)
      ) as any
    ]

  return (switchFun[inputVal] || triggerFun || switchFun.default)()
}
