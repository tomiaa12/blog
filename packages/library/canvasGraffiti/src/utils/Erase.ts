import { ToolOptions } from "../types"
// 橡皮擦
export const Erase = {
  pointerdown({ offsetX: x, offsetY: y }) {
    this.points.push({ x, y })
  },
  pointermove(event) {
    this.ctx.clearRect(event.offsetX - 25, event.offsetY - 25, 50, 50)
  },
} as ToolOptions
