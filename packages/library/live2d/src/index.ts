import type { Application, IApplicationOptions } from "pixi.js"
import type { Live2DModel as Live2DModelType } from "pixi-live2d-display"
import { HitokotoOptions, Hitokoto } from "@tomiaa/hitokoto"

import {
  loadAsyncJs,
  randomInteger,
  createNamespacs,
  drag,
} from "@tomiaa/utils"

import live2d from "pixi-live2d-display"
import type * as PIXI from "pixi.js"

import { Live2dModelList, Live2d_3_ModelList, ModelOption } from "./modelList"

import "./index.scss"

const bem = createNamespacs("live2d")

// loading 图标
const loadingSvg = `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" ><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>`

// 切换人物
const switchPersonSvg = `<svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"  > <path d="M42 19H5.99998" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> <path d="M30 7L42 19" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> <path d="M6.79897 29H42.799" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> <path d="M6.79895 29L18.799 41" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> </svg>`

// 切换服装
const switchClothingSvg = `<svg width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"  > <path fill-rule="evenodd" clip-rule="evenodd" d="M20.7301 27.1255C22.7185 25.833 25.2815 25.833 27.2699 27.1255L42.8202 37.2331C43.556 37.7114 44 38.5295 44 39.4071C44 40.8391 42.8391 42 41.4071 42H6.59288C5.16087 42 4 40.8391 4 39.4071C4 38.5295 4.44395 37.7114 5.17979 37.2331L20.7301 27.1255Z" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> <path d="M24 25C24 25 30 16.3137 30 13C30 9.68629 27.3137 7 24 7C20.6863 7 18 9.68629 18 13" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /> </svg>`

// 配置参数
export interface Live2dOptions {
  // 容器 querySelector 选择器，默认值 #live2d
  el: any
  // js 依赖地址，默认值 "https://tomiaa12.github.io/live2d/public"
  jsBaseURL?: string
  // live2d 地址，默认使用 jsBaseURL
  live2d_2_ModelBaseURL?: string
  // live2d_3 地址，默认使用 jsBaseURL
  live2d_3_ModelBaseURL?: string
  // 是否加载 live2d_2 模型列表，默认 true
  loadLive2d_2?: boolean
  // 是否加载 live2d_3 模型列表，默认 true
  loadLive2d_3?: boolean
  // 加载模型之后是否播放登场(login)动画，默认 true
  playLoadingAnimation?: boolean
  // 显示加载模型 loading
  showLoading?: boolean
  // 显示控制栏
  showControl?: boolean
  // PIXI.Application 配置
  iApplicationOptions?: IApplicationOptions
  // 容器最大宽度 400
  maxWidth?: number
  // 容器最小宽度 200
  minWidth?: number
  // 默认宽高比 [10,9]
  aspectRatio?: [number, number]
  // 初始化之前
  beforeInit?: (data: {
    options: Live2dOptions
    modelList: ModelOption[]
  }) => void
  // 初始化完成
  afterInit?: (data: {
    options: Live2dOptions
    modelList: ModelOption[]
    currentModelOption: ModelOption
    Live2DModel: typeof Live2DModelType
    app: Application
  }) => void
  // 人物随机 true
  randomPeople?: boolean
  // 允许拖动 true
  allowDrag?: boolean
  // hitokoto 一言
  hitokoto?: boolean
  // 一言配置
  hitokotoOptions?: HitokotoOptions
}

declare global {
  interface Window {
    PIXI: typeof PIXI & {
      live2d: typeof live2d
    }
    LIVE2DCUBISMFRAMEWORK: any
    Live2DCubismCore: any
    LIVE2DCUBISMPIXI: any
  }
}

export class Live2d {
  // 配置参数默认值
  public options: Live2dOptions = {
    el: "#live2d",
    loadLive2d_2: true,
    loadLive2d_3: true,
    playLoadingAnimation: true,
    showLoading: true,
    showControl: true,
    iApplicationOptions: {},
    maxWidth: 400,
    minWidth: 200,
    aspectRatio: [10, 9],
    randomPeople: true,
    allowDrag: true,
    hitokoto: true,
  }

  // dom 容器
  el: any
  // canvas
  canvas: any

  // 模型加载模块
  Live2DModel?: typeof Live2DModelType
  // pixi.js 应用
  app?: Application
  // loading
  loading = false
  // 当前模型
  model?: InstanceType<typeof Live2DModelType> & {
    [prop: string]: any
  }
  // 模型列表
  modelList: ModelOption[] = []
  // 当前模型配置
  currentModelOption?: ModelOption
  // 模型下标
  personIndex = 0
  // 服装下标
  clothingIndex = 0
  // loading dom 元素
  elLoading: any
  // control dom 元素
  elControl: any
  // 切换人物 dom 元素
  elSwitchPerson: any
  // 切换服装 dom 元素
  elSwitchClothing: any
  // 一言 dom 元素
  elHitokoto?: any
  // 一言
  hitokoto?: Hitokoto

  constructor(options: Live2dOptions) {
    // 合并默认值
    Object.assign(this.options, options)

    const { el } = this.options

    if (typeof el === "string") this.el = document.querySelector(el)
    else this.el = el

    this.el.classList.add(bem.b())

    this.init()
  }

  get getJsBaseURL() {
    return (
      this.options.jsBaseURL ||
      // "https://cdn.jsdelivr.net/gh/tomiaa12/kyx/packages/library/src/live2d/public"
      "https://tomiaa12.github.io/live2d/public"
    )
  }

  get getLive2d_2_ModelBaseURL() {
    return this.options.live2d_2_ModelBaseURL || this.getJsBaseURL
  }

  get getLive2d_3_ModelBaseURL() {
    return this.options.live2d_2_ModelBaseURL || this.getJsBaseURL
  }

  // 初始化
  async init() {
    // 初始化之前
    await this.options.beforeInit?.({
      options: this.options,
      modelList: this.modelList,
    })

    this.options.allowDrag && drag({ el: this.el })

    // 加载依赖
    await this.loadJS()
    // 创建渲染器
    this.createPIXI()

    // 创建模型列表
    await this.loadModelList()

    // 加载图标
    this.addLoadingSvg()

    // 控制栏
    this.addControls()

    // 设置当前模型
    this.setPersonIndex()

    // 加载模型
    await this.loadModel()

    window.addEventListener("resize", this.onresize.bind(this))

    this.createHitokoto()

    // 初始化完成
    this.options.afterInit?.({
      options: this.options,
      modelList: this.modelList,
      currentModelOption: this.currentModelOption!,
      Live2DModel: this.Live2DModel!,
      app: this.app!,
    })
  }

  // 加载依赖
  async loadJS() {
    await Promise.all([
      // pixi@6 核心渲染库
      loadAsyncJs(this.getJsBaseURL + "/js/pixi.min.js"),
      // live2d 依赖
      loadAsyncJs(this.getJsBaseURL + "/js/live2d.min.js"),
      // Cubism 3 和 Cubism 4 模型 依赖
      loadAsyncJs(this.getJsBaseURL + "/js/live2dcubismcore.min.js"),
    ])

    // pixi-live2d-display index.js+live2d.min.js+live2dcubismcore.min.js 以支持所有版本的模型
    await loadAsyncJs(this.getJsBaseURL + "/js/index.min.js")

    // pixi-live2d-display 导入后所有成员都会被导入到 PIXI.live2d 下
    this.Live2DModel = window.PIXI.live2d.Live2DModel
  }

  // 创建渲染器
  createPIXI() {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas")
      this.el.appendChild(this.canvas)
      this.canvas.addEventListener("click", this.animation.bind(this))
    }
    this.app = new window.PIXI.Application({
      view: this.canvas,
      width: 400,
      height: 300,
      backgroundAlpha: 0, // 透明度
      ...this.options.iApplicationOptions,
    })
  }

  // 创建模型列表
  async loadModelList() {
    if (!this.options.loadLive2d_2 && !this.options.loadLive2d_3) {
      console.error("loadLive2d_2与loadLive2d_3至少加载一种!")
      return Promise.reject()
    }

    this.options.loadLive2d_3 &&
      (this.modelList = [...this.modelList, ...Live2d_3_ModelList])

    this.options.loadLive2d_2 &&
      (this.modelList = [...this.modelList, ...Live2dModelList])
  }

  // 添加 loadingSvg
  addLoadingSvg() {
    if (!this.options.showLoading) return
    this.elLoading = document.createElement("i")
    this.elLoading.innerHTML = loadingSvg
    this.elLoading.classList.add(bem.e("loading"))
    this.el.appendChild(this.elLoading)
  }

  // 添加控制栏
  addControls() {
    if (!this.options.showControl) return
    this.elControl = document.createElement("div")
    this.elControl.classList.add(bem.e("control"))

    // 切换人物
    this.elSwitchPerson = document.createElement("i")
    this.elSwitchPerson.innerHTML = switchPersonSvg
    this.elSwitchPerson.setAttribute("data-tip", "切换人物")
    this.elSwitchPerson.addEventListener("click", this.switchPerson.bind(this))
    this.elControl.appendChild(this.elSwitchPerson)

    // 切换服装
    this.elSwitchClothing = document.createElement("i")
    this.elSwitchClothing.innerHTML = switchClothingSvg
    this.elSwitchClothing.setAttribute("data-tip", "更换服装")
    this.elSwitchClothing.addEventListener(
      "click",
      this.switchClothing.bind(this)
    )
    this.elControl.appendChild(this.elSwitchClothing)
    this.el.appendChild(this.elControl)
  }

  // 加载模型
  async loadModel() {
    this.loading = true
    this.el.style.pointerEvents = "none"
    this.elLoading && (this.elLoading.style.display = "block")
    this.elControl && (this.elControl.style.display = "none")
    if (this.elHitokoto) {
      this.elHitokoto.style.display = "none"
      this.hitokoto?.getData()
    }
    this.model?.destroy?.()

    const baseURL =
      this.currentModelOption!.version === 3
        ? this.getLive2d_3_ModelBaseURL
        : this.getLive2d_2_ModelBaseURL
    try {
      this.model = await this.Live2DModel!.from(
        baseURL + this.currentModelOption!.list[this.clothingIndex]
      )
    } catch {
      this.elLoading && (this.elLoading.style.display = "none")
    }
    this.loading = false
    this.el.style.pointerEvents = "auto"
    this.elLoading && (this.elLoading.style.display = "none")
    this.elControl && (this.elControl.style.display = "block")
    this.elHitokoto && (this.elHitokoto.style.display = "block")
    this.app!.stage.addChild(this.model!)
    this.onresize()
    this.options.playLoadingAnimation && this.animation("login")
  }

  setPersonIndex() {
    if (this.options.randomPeople)
      this.personIndex = randomInteger(0, this.modelList.length - 1)
    else {
      if (++this.personIndex >= this.modelList.length) this.personIndex = 0
    }
    this.currentModelOption = this.modelList[this.personIndex]

    this.elSwitchClothing.style.display =
      this.currentModelOption!.list.length > 1 ? "block" : "none"
  }

  // 设置宽高比
  onresize() {
    const model = this.model
    if (!model) return
    const currentModelOption = this.currentModelOption!
    const app = this.app!

    let width = window.innerWidth * 0.3
    if (width > this.options.maxWidth!) width = this.options.maxWidth!
    if (width < this.options.minWidth!) width = this.options.minWidth!

    const height =
      (width /
        (currentModelOption?.aspectRatio?.[0] ||
          this.options.aspectRatio![0])) *
      (currentModelOption?.aspectRatio?.[1] || this.options.aspectRatio![1])

    app!.view.style.width = width + "px"
    app!.view.style.height = height + "px"
    app!.renderer.resize(width, height)

    const scale =
      model.width > model.height ? width / model.width : height / model.height
    model.width *= scale
    model.height *= scale

    let customScaleX, customScaleY

    if (typeof currentModelOption?.scale === "number") {
      customScaleX = customScaleY = currentModelOption?.scale
    } else {
      customScaleX = currentModelOption?.scale?.x
      customScaleY = currentModelOption?.scale?.y
    }

    model.width *= currentModelOption?.stretch?.width || 1
    model.height *= currentModelOption?.stretch?.height || 1

    model.scale = new window.PIXI.Point(
      model.scale.x * (customScaleX || 1),
      model.scale.y * (customScaleY || 1)
    )

    model.position = new window.PIXI.Point(
      width - model.width + (currentModelOption?.position?.x || 0),
      height - model.height + (currentModelOption?.position?.y || 0)
    )
  }

  // 动画
  animation(e?: MouseEvent | string) {
    const model = this.model!
    if (typeof e === "string") {
      model.motion(e)
      return
    }

    const [area] = model.hitTest(e?.offsetX || 0, e?.offsetY || 0)
    const motions = Object.keys(
      model.internalModel.motionManager.definitions
    ).filter(name => name !== "login")

    if (area) {
      model.motion(motions.filter(i => i.includes(area))[0])
    } else {
      model.motion(motions[randomInteger(0, motions.length - 1)])
    }
  }

  // 切换人物
  switchPerson() {
    event?.stopPropagation()
    this.clothingIndex = 0
    this.setPersonIndex()

    this.loadModel()
  }

  // 更换服装
  switchClothing() {
    event?.stopPropagation()
    if (++this.clothingIndex >= this.currentModelOption!.list.length)
      this.clothingIndex = 0
    this.loadModel()
  }

  // 创建一言
  createHitokoto() {
    if (!this.options.hitokoto) return
    this.elHitokoto = document.createElement("div")
    this.el.appendChild(this.elHitokoto)
    this.elHitokoto.addEventListener("mousedown", (e: Event) => {
      e.stopPropagation()
    })
    this.hitokoto = new Hitokoto({
      el: this.elHitokoto,
      ...this.options.hitokotoOptions,
    })
  }

  // 销毁
  destroy() {
    window.removeEventListener("resize", this.onresize)
    this.el.innerHTML = ""
  }
}

export default Live2d
