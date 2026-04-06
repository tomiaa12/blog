export type ExerciseItem = {
  /** 题号 1–20 */
  n: number
  /** 中文题干（含括号提示） */
  prompt: string
  /** 可接受的英文参考答案（已规范书写；多项即同义/变体） */
  answers: string[]
  /** 答案解析（纯文本，可用换行分段） */
  explanation: string
}

export type ExerciseIssue = {
  id: string
  /** 侧栏与列表用短名 */
  menuTitle: string
  /** 页面主标题 */
  title: string
  /** 副标题/语法主题 */
  subtitle?: string
  items: ExerciseItem[]
}
