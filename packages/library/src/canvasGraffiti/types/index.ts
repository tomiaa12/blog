import type { CanvasGraffiti } from "../"
// 工具类配置
export interface ToolOptions {
  // 是否创建离屏渲染画布
  buffer?: boolean

  /* 事件 */
  // 按下
  pointerdown?: (this: CanvasGraffiti, event: PointerEvent) => void
  // 移动
  pointermove?: (this: CanvasGraffiti, event: PointerEvent) => void
  // 抬起
  pointerup?: (this: CanvasGraffiti, event: PointerEvent) => void
}
