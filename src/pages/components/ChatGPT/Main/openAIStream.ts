import { createParser } from "eventsource-parser";

export const OpenAIStream = async (openAiUrl: string, msg: any[], apiKey: string, model: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

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
  });
  if (res.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  return new ReadableStream({
    async start(controller) {
      const reader = (res as any).body.getReader(); // 获取可读流的读取器

      const onParse = (event: any) => {
        if (event.type === "event") {
          const data = event.data;

          try {
            const json = JSON.parse(data);
            if (json.choices[0].finish_reason === "stop") {
              controller.close();
              return;
            }
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(text);
            // controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        parser.feed(decoder.decode(value));
      }
    },
  });
};



/* ------ test ---- */
// const prompt = [
//   {
//     role: "system",
//     content: `用中文回答,回答的精简一些,当前时间${Date.now()}`
//   },
//   {
//     role: 'user',
//     content: '在'
//   }
// ]
// const openAiUrl = 'https://www.ai-yuxin.space/fastapi/api/chat/chatgpt_free'
// const apiKey = "";
// const model = "gpt-4-0613";

// const stream = await OpenAIStream(openAiUrl, prompt, apiKey, model)
// const reader = stream.getReader();
// console.log('start')
// while (true) {
//   const { done, value } = await reader.read();
//   if (done) break;
//   console.log(value)
//   content += value
// }