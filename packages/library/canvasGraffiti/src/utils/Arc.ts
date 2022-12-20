import { ToolOptions } from "../types"
// 线
export const Arc = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
  },
  pointermove({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.arc(
      this.beginPoint.x,
      this.beginPoint.y,
      Math.abs(x - this.beginPoint.x),
      0,
      2 * Math.PI
    )
    this.endPoint = { x, y }
    this.bufferCtx!.stroke()
  },
  pointerup() {
    if (this.endPoint) {
      this.ctx.beginPath()
      this.ctx.arc(
        this.beginPoint.x,
        this.beginPoint.y,
        Math.abs(this.endPoint.x - this.beginPoint.x),
        0,
        2 * Math.PI
      )
      this.ctx.stroke()
    }
  },
} as ToolOptions
