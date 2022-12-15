import { ToolOptions } from "../types"
// import { getPos } from "./Tool"

// 记号笔
export const Marker = {
  pointerdown({ offsetX: x, offsetY: y }: PointerEvent) {
    this.ctx.beginPath()
    this.points.push({ x, y })
  },
  pointermove({ offsetX: x, offsetY: y }: PointerEvent) {
    this.points.push({ x, y })
    if (this.points.length < 3) return
    const lastTwoPoints = this.points.slice(-2)
    const controlPoint = lastTwoPoints[0]
    const endPoint = {
      x: (lastTwoPoints[0].x + lastTwoPoints[1].x) / 2,
      y: (lastTwoPoints[0].y + lastTwoPoints[1].y) / 2,
    }
    this.ctx.beginPath()
    this.ctx.moveTo(this.beginPoint.x, this.beginPoint.y)
    this.ctx.quadraticCurveTo(
      controlPoint.x,
      controlPoint.y,
      endPoint.x,
      endPoint.y
    )
    this.ctx.stroke()
    this.ctx.closePath()
    this.beginPoint = endPoint
  },
} as ToolOptions
