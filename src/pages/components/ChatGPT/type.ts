export interface Message {
  role: "system" | "user" | "assistant" | "function"
  content: string
  name?: string
  error?: boolean
}
export interface Chat {
  model: string
  time: number
  message: Message[]
  isEditing?: boolean
  title?: string
  cacheTitle?: string
}
