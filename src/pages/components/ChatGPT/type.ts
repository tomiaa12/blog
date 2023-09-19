export interface Message {
  role: "system" | "user" | "assistant" | "function"
  content: string
  error?: boolean
  loading?: boolean
  isEnd?: boolean
  isChatGPT?: boolean
}
export interface Chat {
  model: string
  time: number
  message: Message[]
  isEditing?: boolean
  title?: string
  cacheTitle?: string
}

export interface List {
  path: string | string[]
  options: string[]
  optionsAnswer: string
  answer: string
  topic: string
  desc: string
}
