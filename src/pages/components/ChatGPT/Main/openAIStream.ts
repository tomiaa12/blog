import { createParser } from "eventsource-parser"

export const OpenAIStream = async (
  openAiUrl: string,
  msg: any[],
  apiKey: string,
  model: string
) => {
  // const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const res = await fetch(openAiUrl, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model,
      token: 0,
      user_id: 0,
      msg,
    }),
  })
  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error")
  }

  return new ReadableStream({
    async start(controller) {
      const reader = (res as any).body.getReader() // 获取可读流的读取器
      const onParse = (event: any) => {
        try{
          if (event.type === "event") {
            const data = event.data
            const json = JSON.parse(data)
            if(!json.choices[0]) return
            if (json.choices[0].finish_reason === "stop") {
              controller.close()
              return
            }
            const text = json.choices[0].delta.content || ''
            // const queue = encoder.encode(text)
            controller.enqueue(text)
            // controller.enqueue(queue);
          }
        }catch(e){
          console.log(e,'error')
        }
      }

      const parser = createParser(onParse)

      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        value && parser.feed(decoder.decode(value))
      }
    },
  })
}
