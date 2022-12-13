import live2d from "pixi-live2d-display"
import type * as PIXI from "pixi.js"

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

declare module "axios" {
  export interface AxiosRequestConfig {
    callbackParamName?: string
  }
}
