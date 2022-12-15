import { ToolOptions } from "../types"
// 线
export const Rect = {
  buffer: true,
  pointerdown({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.moveTo(x, y)
  },
  pointermove({ offsetX: x, offsetY: y }) {
    this.bufferCtx!.clearRect(0, 0, this.el.width, this.el.height)
    this.bufferCtx!.beginPath()
    this.bufferCtx!.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.bufferCtx!.rect(
      this.beginPoint.x,
      this.beginPoint.y,
      x - this.beginPoint.x,
      y - this.beginPoint.y
    )
    this.endPoint = { x, y }
    this.bufferCtx!.stroke()
  },
  pointerup() {
    if (this.endPoint) {
      this.ctx.beginPath()
      this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
      this.ctx.rect(
        this.beginPoint.x,
        this.beginPoint.y,
        this.endPoint.x - this.beginPoint.x,
        this.endPoint.y - this.beginPoint.y
      )
      this.ctx.stroke()
    }
  },
} as ToolOptions
