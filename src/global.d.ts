import live2d from "pixi-live2d-display"
import type * as PIXI from "pixi.js"
import type { AllowedComponentProps, ComponentCustomProps, VNode, Component } from 'vue'

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
declare module "busuanzi.pure.js" {
  function fetch(): any
  export = fetch
}

declare module "qrcode" {
  const QRCode: any
  export default QRCode
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface Element extends VNode {}
    interface ElementClass extends Component {}
    interface ElementAttributesProperty {
      $props: any
    }
    interface IntrinsicAttributes extends AllowedComponentProps, ComponentCustomProps {}
  }
}