import { useClipboard, useBreakpoints } from "@vueuse/core"

/** 
 * 防抖函数
 * @param {Function} fun 要执行的方法
 * @param {Number?} wait 间隔时间
 * @param {Boolean?} immediate 立即执行一次
 * @return {Function} 防抖函数
    Function.status  true: 开启防抖（default）; false: 关闭防抖
*/
export function handleDebounce(
  this: any,
  fun: any,
  wait = 0,
  immediate = false,
  ...rest: any
) {
  let timer: any, prevTimestamp: number, ctx: any, args: any
  const run = (delay: number) => {
    timer = setTimeout(() => {
      const now = Date.now()
      const interval = now - prevTimestamp
      if (interval < delay) {
        prevTimestamp = now
        run(wait - interval)
        return
      }
      fun.apply(ctx, args)
      timer = null
    }, delay)
  }

  if (immediate) fun.apply(this, ...rest)

  function temp(this: any, ...rest: any) {
    if (!temp.status) return fun.apply(this, ...rest)
    prevTimestamp = Date.now()

    if (timer) return
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    ctx = this
    args = rest
    run(wait)
  }
  temp.status = true
  return temp
}

/**
 * 节流函数
 * @param Function fun 要执行的方法
 * @param {Number?} wait 间隔时间
 * @param {Boolean?} immediate 立即执行一次
 * @return {Function} 节流函数
    Function.status  true: 开启节流（default）; false: 关闭节流
*/
export function handleThrottle(
  fun: any,
  wait = 0,
  immediate = false,
  ...rest: any
) {
  let prev = Date.now()
  if (immediate) temp()
  function temp(this: any) {
    const now = Date.now()
    let result
    if (now - prev >= wait || immediate || !temp.status) {
      result = fun.apply(this, ...rest)
      prev = now
      if (immediate) immediate = false
    }
    return result
  }
  temp.status = true
  return temp
}

/**
 * 复制文字
 * @param text 要复制的内容
 */
export const handleClipboard = (text: string) => useClipboard().copy(text)

/**
 * 浏览器屏幕断点
 * xs: 小于768px;
 * sm: 大于768px;
 * md: 大于992px;
 * lg: 大于1200px;
 * xl: 大于1920px;
 * xxl: 大于2560px;
 */
export const handleBreakpoints = () => {
  const breakpoints = useBreakpoints({
    xs: 0,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1920,
    xxl: 2560,
  })
  const xs = breakpoints.between("xs", "sm")
  const sm = breakpoints.between("sm", "md")
  const md = breakpoints.between("md", "lg")
  const lg = breakpoints.between("lg", "xl")
  const xl = breakpoints.between("xl", "xxl")

  return { xs, sm, md, lg, xl }
}

/**
 * 按顺序执行Promise
 * 输入: 与 Promise.all 一样传入, 不同的是 Promise 执行的顺序是按传入 Promise 数组的顺序依次执行
 * 输出: any[] 与传入 promise 数组一样的顺序
 */
export const runPromiseSeq = (promises: Promise<any>[]): Promise<any> =>
  promises.reduce(
    (p, c) => p.then(rp => c.then(rc => [...rp, rc])),
    Promise.resolve([])
  )

/**
 * base64转Unit8数组
 */
export const base64ToUint8 = (str: string): Uint8Array =>
  Uint8Array.from(atob(str), c => c.charCodeAt(0))

/**
 * Unit8数组转base64
 */
export const uint8ToBase64 = (arr: Uint8Array): string =>
  btoa(
    Array(arr.length)
      .fill("")
      .map((_, i) => String.fromCharCode(arr[i]))
      .join("")
  )

/* 深克隆 */
export const deepClone = (obj: any) => {
  const temp: any = Array.isArray(obj) ? [] : {}
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (obj[key] && typeof obj[key] === "object") {
          temp[key] = deepClone(obj[key])
        } else {
          temp[key] = obj[key]
        }
      }
    }
  }
  return temp
}

/**
 * 修改键名
 * data 要修改的对象或数组
 * renames 原来的键修改新的键，如 { old: 'newKey'}。对象下 old键名会以 newKey 命名
 * {deep,keepOrigin} deep 是否深度修改，默认深度修改，false 只修改第一级。keepOrigin 是否修改后保留原始键，默认不保留
 * 输入：renameKey({a: 1},{a: 'b'})
 * 输出：{ b: 1 }
 *
 * 输入：renameKey({a: 1,c: {a: 2}},{a: 'b'}, { deep: false})
 * 输出：{ b:1, c: { a:2 } }
 *
 * 输入：renameKey({a: 1},{a: 'b'}, {keepOrigin: true,})
 * 输出：{a: 1,b:1}
 */
export const renameKey = (
  data: object | any[],
  renames: { [prop: string]: string },
  { deep, keepOrigin } = { deep: true, keepOrigin: false }
) => {
  const temp = deepClone(data)
  const rename = (data: any) => {
    if (!Array.isArray(data)) {
      for (const [k, v] of Object.entries(renames)) {
        data[k] && (data[v] = data[k])
        if (!keepOrigin) delete data[k]
      }
    }
    if (!deep) return
    for (const i in data) {
      if (typeof data[i] === "object") rename(data[i])
    }
  }
  rename(temp)
  return temp
}

/*
 * 获取变量的数据类型
 * 输入: getDataType(new FormData()) 输出 'FormData'
 */
export const getDataType = (target: any) =>
  Object.prototype.toString.call(target).slice(8, -1)

/**
 * 异步加载 script 标签
 */
export const loadAsyncJs = (src: string | string[], base = "") => {
  const run = (src: string) =>
    new Promise((res, rej) => {
      let el: any = document.querySelector(`script[src="${base + src}"]`)
      if (el && el.hasAttribute("data-loaded")) {
        return res(el)
      }
      el = document.createElement("script")
      el.src = base + src
      document.body.appendChild(el)
      el.onload = el.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState == "loaded" ||
          this.readyState == "complete"
        ) {
          el.setAttribute("data-loaded", "true")
          res(el)
        }
        this.onload = this.onreadystatechange = null
      }

      el.addEventListener("error", (event: Event) => rej(event))
      el.addEventListener("abort", (event: Event) => rej(event))
    })
  if (Array.isArray(src)) return Promise.all(src.map(run))

  return run(src)
}

/**
 * 元素拖动
 * el: 要拖动的元素
 * adsorb: 是否吸附到宽口边缘，默认 true
 * adsorbNum: 吸附数值，默认 15，0 相当于限制到窗口内无吸附效果
 */

export interface DragOptions {
  el: any
  adsorb?: boolean
  adsorbNum?: number
}
export const drag = ({ el, adsorb = true, adsorbNum = 15 }: DragOptions) => {
  el.addEventListener("mousedown", function (this: any, event: any) {
    const x = event.offsetX,
      y = event.offsetY

    const elMousemove = function (this: any, event: any) {
      let left = event.clientX - x,
        top = event.clientY - y

      if (adsorb) {
        if (left <= adsorbNum) left = 0
        if (
          left >=
          document.documentElement.clientWidth - this.offsetWidth - adsorbNum
        )
          left = document.documentElement.clientWidth - this.offsetWidth

        if (top <= adsorbNum) top = 0
        if (
          top >=
          document.documentElement.clientHeight - this.offsetHeight - adsorbNum
        )
          top = document.documentElement.clientHeight - this.offsetHeight
      }

      this.style.right = "unset"
      this.style.bottom = "unset"
      this.style.left = left + "px"
      this.style.top = top + "px"
      return false
    }

    this.addEventListener("mousemove", elMousemove)

    const mouseup = () => {
      el.removeEventListener("mousemove", elMousemove)
      document.removeEventListener("mouseup", mouseup)
      return false
    }
    document.addEventListener("mouseup", mouseup)
    return false
  })
}
