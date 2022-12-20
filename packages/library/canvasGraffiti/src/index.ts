import * as utils from "./utils"
import { ToolOptions } from "./types"
export * from "./types"

/**
 * 配置
 */
export interface Options {
  // canvas
  el: string | HTMLCanvasElement

  // 当前绘图工具
  currentTool?: ToolType

  // 创建离屏渲染画布样式
  createBufferCanvasStyle?: { [prop: string]: any }

  // 允许书写的方式
  allowType?: AllowType[]

  // 允许鼠标书写时，可以绘图的键 0：左键，1：中键，2：右键
  allowButton?: (0 | 1 | 2)[]
}

// 事件名
export type EventTypes = "pointerdown" | "pointermove" | "pointerup"
// 工具名
export type ToolType =
  | "Marker"
  | "Line"
  | "Rect"
  | "FillRect"
  | "Arc"
  | "FillRect"
  | "Erase"
// 允许绘图的方式
// eslint-disable-next-line @typescript-eslint/ban-types
export type AllowType = "mouse" | "touch" | "pen" | (string & {})

export class CanvasGraffiti implements ToolOptions {
  options = {
    currentTool: "Marker",
    createBufferCanvasStyle: {},
    allowType: ["pen", "mouse", "touch"],
    allowButton: [0],
  } as Options

  // canvas 容器
  el: HTMLCanvasElement

  // 起点
  beginPoint: { x: number; y: number } = { x: 0, y: 0 }

  // 终点
  endPoint: { x: number; y: number } | undefined

  // 移动轨迹
  points: { x: number; y: number }[] = []

  // 工具名
  currentTool: ToolType = "Marker"

  // 离屏渲染画布
  bufferCanvas: HTMLCanvasElement | undefined

  // 允许绘图方式
  allowType!: AllowType[]

  // 鼠标允许绘图方式
  allowButton!: (0 | 1 | 2 | number)[]

  // color
  get color() {
    return this.ctx.fillStyle
  }
  set color(value) {
    this.ctx.strokeStyle = value
    this.ctx.fillStyle = value
  }

  // 线宽
  get lineWidth() {
    return this.ctx.lineWidth
  }
  set lineWidth(value: number) {
    this.ctx.lineWidth = value
  }

  // 当前工具
  get tool() {
    return utils[this.currentTool]
  }
  set tool(value: any) {
    this.currentTool = value
  }

  static toolList = [
    {
      label: "记号笔",
      value: "Marker",
    },
    {
      label: "直线",
      value: "Line",
    },
    {
      label: "空心矩形",
      value: "Rect",
    },
    {
      label: "实心矩形",
      value: "FillRect",
    },
    {
      label: "空心圆",
      value: "Arc",
    },
    {
      label: "实心圆",
      value: "FillArc",
    },
  ] as const

  static allowTypes = [
    {
      label: "鼠标",
      value: "mouse",
    },
    {
      label: "手写",
      value: "touch",
    },
    {
      label: "笔写",
      value: "pen",
    },
  ]

  constructor(options: Options) {
    Object.assign(this.options, options)

    if (typeof this.options.el === "string")
      this.el = document.querySelector(this.options.el) as HTMLCanvasElement
    else this.el = this.options.el

    this.currentTool = this.options.currentTool!
    this.allowType = this.options.allowType!
    this.allowButton = this.options.allowButton!

    this.init()
  }

  // 上下文
  get ctx() {
    return this.el.getContext("2d")!
  }

  // 离屏渲染画布上下文
  get bufferCtx() {
    return this.bufferCanvas?.getContext("2d")
  }

  /**
   * 初始化
   */
  init() {
    // 绑定 this
    this.pointerdown = this.pointerdown.bind(this)
    this.pointermove = this.pointermove.bind(this)
    this.pointerup = this.pointerup.bind(this)

    // 绑定事件
    this.bindCanvasEventListener()
  }

  // 绑定事件
  bindCanvasEventListener() {
    this.el.addEventListener("pointerdown", this.pointerdown)
  }

  // 解绑事件
  removeEventListener(
    types: EventTypes[] = ["pointerdown", "pointermove", "pointerup"]
  ) {
    types.forEach(i => {
      this.el.removeEventListener(i, this[i])
      document.removeEventListener(i, this[i])
    })
  }

  // 按下
  pointerdown(event: PointerEvent) {
    if (!this.allowType.includes(event.pointerType)) return

    if (
      event.pointerType === "mouse" &&
      !this.allowButton.includes(event.button)
    )
      return
    /*
     * pointermove 事件，不设置该属性 pointermove 移动端只会触发几次！！！-
     */
    this.el.style.touchAction = "none"

    this.beginPoint = { x: event.offsetX, y: event.offsetY }

    event.preventDefault()

    // 创建离屏渲染画布
    if (this.tool.buffer) {
      this.createBufferCanvas()
    }

    if (this.tool) this.tool?.pointerdown?.call(this, event)

    this.el.addEventListener("pointermove", this.pointermove)
    document.addEventListener("pointerup", this.pointerup)
  }

  // 移动
  pointermove(event: PointerEvent) {
    event.preventDefault()
    if (!this.allowType.includes(event.pointerType)) return

    this.tool?.pointermove?.call(this, event)
  }

  // 抬起
  pointerup(event: PointerEvent) {
    this.el.style.touchAction = "auto"

    if (!this.allowType.includes(event.pointerType)) return

    if (
      ~~this.beginPoint.x === ~~event.offsetX &&
      ~~this.beginPoint.y === ~~event.offsetY
    ) {
      this.ctx.beginPath()
      this.ctx.arc(event.offsetX, event.offsetY, 1, 0, 2 * Math.PI, false)
      this.ctx.stroke()
      this.ctx.fill()
    }

    event.preventDefault()

    this.tool?.pointerup?.call(this, event)
    this.removeEventListener(["pointermove", "pointerup"])

    this.beginPoint = { x: 0, y: 0 }
    this.endPoint = undefined
    this.points = []
    this.bufferCanvas?.remove()
  }

  // 清除画布
  clear() {
    this.ctx.clearRect(0, 0, this.el.width, this.el.height)
  }

  // 创建离屏渲染画布
  createBufferCanvas() {
    const tempCanvas = this.el.cloneNode() as HTMLCanvasElement
    tempCanvas.style.zIndex += 100
    tempCanvas.style.pointerEvents = "none"
    tempCanvas.style.position = "absolute"
    tempCanvas.style.left = this.el.offsetLeft + "px"
    tempCanvas.style.top = this.el.offsetTop + "px"

    const style = this.options.createBufferCanvasStyle
    if (style) {
      for (const k in style) {
        tempCanvas.setAttribute(k, style[k])
      }
    }
    this.el.parentElement!.appendChild(tempCanvas)
    this.bufferCanvas = tempCanvas
    this.bufferCtx!.fillStyle = this.color
    this.bufferCtx!.strokeStyle = this.color
    this.bufferCtx!.lineWidth = this.lineWidth
  }

  // 销毁
  destroy(isRemoveCanvas?: boolean) {
    this.removeEventListener()
    if (isRemoveCanvas) this.el.remove()
  }

  // 获取 canvas.toDataURL
  toDataURL(type = "image/png", encoderOptions = 0.92) {
    return this.el.toDataURL(type, encoderOptions)
  }

  // 获取 canvas 的图片文件
  toPicFile(filename = "0.png"): Promise<File> {
    return new Promise(res => {
      this.el.toBlob(blob => {
        blob && res(new File([blob], filename))
      })
    })
  }
}

export default CanvasGraffiti
