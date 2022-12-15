import { ToolOptions } from "../types"

// 线
export const Line = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }: PointerEvent) {
    this.bufferCtx!.moveTo(x, y)
  },
  pointermove({ offsetX: x, offsetY: y }: PointerEvent) {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.bufferCtx!.lineTo(x, y)
    this.endPoint = { x, y }
    this.bufferCtx!.stroke()
  },
  pointerup() {
    if (this.endPoint) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
      this.ctx.lineTo(this.endPoint.x, this.endPoint.y)
      this.ctx.stroke()
    }
  },
} as ToolOptions
