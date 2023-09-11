import { Chat } from "../type"

export type Props = {
  chats: Chat[]
  modelValue: Chat | undefined
  drawer: boolean
  currentModel: string
}

export type Emits = {
  (event: "update:modelValue", value: Chat): void
  (event: "update:drawer", value: boolean): void
  (event: "saveChats"): void
}
