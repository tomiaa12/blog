import { ToolOptions } from "../types"
import { Rect } from "./"
// 线
export const FillRect = {
  ...Rect,
  pointermove(event) {
    Rect.pointermove?.call(this, event)
    this.bufferCtx?.fill()
  },
  pointerup(event) {
    Rect.pointerup?.call(this, event)
    this.ctx?.fill()
  },
} as ToolOptions
