import { createNamespacs } from "@tomiaa/utils"
import axios from "axios"

const http = axios.create({
  baseURL: "https://hitokoto.cn/api",
})

const bem = createNamespacs("hitokoto")

const likeSvg = `<svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" ><rect width="48" height="48" fill="currentColor" fill-opacity="0.01" ></rect><path d="M15 8C8.92487 8 4 12.9249 4 19C4 30 17 40 24 42.3262C31 40 44 30 44 19C44 12.9249 39.0751 8 33 8C29.2797 8 25.9907 9.8469 24 12.6738C22.0093 9.8469 18.7203 8 15 8Z" fill="currentColor" stroke="#ff93a0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" ></path></svg>`

export interface HitokotoOptions {
  el: any
  // 流动边框颜色
  movingBorderColor?: string
}

export class Hitokoto {
  public data: any
  options = {
    movingBorderColor: "#42b883",
  } as HitokotoOptions
  el: any
  constructor(options: HitokotoOptions) {
    Object.assign(this.options, options)

    const { el } = options
    el.style.setProperty(
      "--moving-border-color",
      this.options.movingBorderColor
    )
    if (typeof el === "string") this.el = document.querySelector(el)
    else this.el = el

    el.classList.add(bem.b())

    this.init()
    this.getData()
  }

  // 内容
  word = document.createElement("div")

  // 出处
  author = document.createElement("div")

  // 喜欢
  elLike = document.createElement("div")

  init() {
    // info
    const info = document.createElement("div")
    info.classList.add(bem.e("info"))
    info.innerHTML = `<div class="left">『</div>`
    this.word.classList.add("word")
    info.innerHTML += `<div class="right">』</div>`
    info.appendChild(this.word)
    this.el.appendChild(info)

    // author
    this.author.classList.add(bem.e("author"))
    this.el.appendChild(this.author)

    // like

    this.elLike.classList.add(bem.e("like"))
    this.elLike.onclick = this.like.bind(this)
    this.elLike.innerHTML = likeSvg
    this.el.appendChild(this.elLike)
  }

  timer = 0

  async getData() {
    window.clearTimeout(this.timer)
    this.elLike.style.color = "transparent"
    const { data } = await http.get("https://v1.hitokoto.cn?encode=json")
    this.data = data
    this.word.innerText = data.hitokoto
    this.author.innerText = `——${data.from_who}「${data.from}」`
    this.getLikeNum()
  }

  // 获取喜欢数量
  async getLikeNum() {
    const { data } = await http(
      `/common/v1/like?sentence_uuid=${this.data.uuid}`
    )
    this.elLike.dataset.num = this.data.total = data.data[0].total
  }

  // 喜欢
  async like() {
    await http(`/restful/v1/like?sentence_uuid=${this.data.uuid}`)
    this.elLike.style.color = "#f04a83"
    this.elLike.dataset.num = ++this.data.total + ""
  }
}
