import axios, { AxiosRequestConfig } from "axios"
import { createNamespacs } from "@tomiaa/utils"
import "./index.scss"

const bem = createNamespacs("comment")
const instance = axios.create({
  baseURL: "https://gitee.com/",
})
const http = async (config: AxiosRequestConfig) => {
  const { data } = await instance(config)
  return data
}
export interface Options {
  client_id: string // 客户端id
  client_secret: string // 客户端session
  owner: string // 用户名 组织名
  repo: string // 仓库地址
  prefix?: string
}

export interface UserInfo {
  access_token: string
  created_at: number
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

export interface List {
  body: string
  created_at: string
  id: number
  in_reply_to_id: number
  source: any
  target: {
    issue: {
      id: number
      number: string
      title: string
    }
    pull_request: any
  }
  updated_at: string
  user: {
    id: number
    login: string
    name: string
    avatar_url: string
    url: string
    html_url: string
    remark: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
  }
}

export class Comment {
  // 用户信息
  userInfo: UserInfo | null = null
  // 主 dom 元素
  el: Element | null = null
  // 输入框
  textarea: HTMLTextAreaElement = document.createElement("textarea")
  // 登录发布按钮
  button: HTMLButtonElement = document.createElement("button")
  // 评论区域
  ul: HTMLUListElement = document.createElement("ul")
  // 所有评论
  list: List[] = []
  // Issue number
  number = ""

  constructor(public options: Options) {}

  async init() {
    this.textarea = document.createElement("textarea")
    this.ul = document.createElement("ul")
    this.button = document.createElement("button")
    this.list = []
    this.number = ""

    const code = location.search.match(/code=[^&]+/)?.[0]?.split("=")?.[1]
    code && (await this.getToken(code))
    const userInfo: UserInfo | null = JSON.parse(
      localStorage.getItem("comment") as any
    )

    if (!userInfo) {
      !code && (await this.getList())
      return
    }
    if (
      +new Date(userInfo.expires_in + userInfo.created_at) * 1000 >
      Date.now()
    ) {
      // 已登录
      this.userInfo = userInfo
      await this.getList()
    } else {
      // 登录过期，刷新token只有一天时间
      ;+new Date(userInfo.expires_in + userInfo.created_at) * 1000 + 86400000 >
        Date.now() && (await this.refreshToken())
    }
  }

  login() {
    location.href = `https://gitee.com/oauth/authorize?client_id=${this.options.client_id}&redirect_uri=${location.origin}&response_type=code`
  }

  async getToken(code: string) {
    const data = await http({
      method: "post",
      url: "/oauth/token",
      params: {
        grant_type: "authorization_code",
        code,
        client_id: this.options.client_id,
        redirect_uri: location.origin,
      },
      data: {
        client_secret: this.options.client_secret,
      },
    })
    history.pushState({}, "", location.href.replace(location.search, ""))
    localStorage.setItem("comment", JSON.stringify(data))
    this.userInfo = data

    this.button.innerHTML = this.userInfo ? "发表评论" : "使用 Gitee 登录"
    this.button.disabled = !!this.userInfo
    await this.getList()
  }

  async refreshToken() {
    const refresh_token = this.userInfo?.refresh_token
    localStorage.removeItem("comment")

    await http({
      url: "/oauth/token",
      params: {
        grant_type: "refresh_token",
        refresh_token,
      },
    })
  }

  // 挂载
  async mount(dom: string | Element) {
    this.el = typeof dom === "string" ? document.querySelector(dom) : dom
    if (!this.el) return
    this.init()
    // 文本框
    this.textarea.placeholder = "使用 gitee 登录发布评论"
    this.el.classList.add(bem.b())
    this.el.innerHTML = ""
    this.textarea.classList.add(bem.e("textarea"))
    this.textarea.oninput = () => {
      if (this.userInfo) this.button.disabled = !this.textarea.value
    }
    this.el.appendChild(this.textarea)
    // 登录发表按钮
    const div = document.createElement("div")
    div.className = bem.e("login")
    this.button.innerHTML = this.userInfo ? "发表评论" : "使用 Gitee 登录"
    // this.button.disabled = !this.userInfo || !this.textarea.value
    this.button.onclick = () => {
      this.userInfo ? this.publish.call(this) : this.login.call(this)
    }
    div.appendChild(this.button)
    this.el.append(div)
  }

  // 获取列表
  async getList() {
    // 获取issues
    const data = await http({
      url: "/api/v5/search/issues",
      params: {
        access_token: this.userInfo?.access_token,
        q: `${this.options.prefix}${document.title}`,
        per_page: 1,
        repo: this.options.owner + "/" + this.options.repo,
      },
    })
    if (!(data[0]?.title === `${this.options.prefix}${document.title}`)) {
      // 创建issues
      const res = await http({
        method: "post",
        url: `/api/v5/repos/${this.options.owner}/issues`,
        data: {
          access_token: this.userInfo?.access_token,
          repo: this.options.repo,
          title: `${this.options.prefix}${document.title}`,
          body: location.href,
        },
      })
      this.number = res.number
    } else {
      this.number = data[0].number
    }
    // 获取评论
    this.list = await http({
      url: `/api/v5/repos/${this.options.owner}/${this.options.repo}/issues/${this.number}/comments`,
      params: {
        access_token: this.userInfo?.access_token,
      },
    })
    if (!this.el) return
    this.ul.classList.add(bem.e("ul"))
    this.el.appendChild(this.ul)
    this.ul.innerHTML = ""
    this.renderList(this.list.splice(0, 6))
    document.addEventListener("scroll", this.onScroll.bind(this))
  }

  // 渲染评论
  renderList(list: List[]) {
    let comment = ""
    list.forEach(item => {
      comment += `
      <li>
        <div class="user">
          <a href="${item.user.html_url}" target="_blank">
            <img
              src="${item.user.avatar_url}"
              alt=""
            />
            <p class="name">${item.user.name}</p>
          </a>
        </div>
        <div class="body">
          <div class="info">${item.body}</div>
          <time>${this.formatTime(item.updated_at)}</time>
        </div>
      </li>
      `
    })
    this.ul.innerHTML += comment
  }

  // 滚动加载
  onScroll() {
    const doc = document.documentElement
    if (doc.scrollHeight - doc.scrollTop - doc.clientHeight < 20) {
      if (this.list?.length) {
        this.renderList(this.list.splice(0, 6))
      } else {
        document.removeEventListener("scroll", this.onScroll)
      }
    }
  }

  // 格式化时间
  formatTime(date: string) {
    const d = new Date(date)
    const double = (num: number) => String(num).padStart(2, "0")
    return `${double(d.getFullYear())}-${double(d.getMonth() + 1)}-${double(
      d.getDate()
    )} ${double(d.getHours())}:${double(d.getMinutes())}:${double(
      d.getSeconds()
    )}`
  }

  // 发布评论
  async publish() {
    if (!this.textarea.value) return
    const res = await http({
      method: "post",
      url: `/api/v5/repos/${this.options.owner}/${this.options.repo}/issues/${this.number}/comments`,
      data: {
        access_token: this.userInfo?.access_token,
        body: this.textarea.value,
      },
    })
    this.textarea.value = ""
    this.renderList([res])
  }
}

export default Comment
