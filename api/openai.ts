import type { VercelRequest, VercelResponse } from "@vercel/node"
import axios from "axios"

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: "Bearer YOUR_OPENAI_API_KEY",
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    )

    res.setHeader("Content-Type", "application/json")
    response.data.pipe(res)
  } catch (error) {
    res.status(500).json({ error: "Proxying error" })
  }
  response.send(`Hello ${name}!`)
}
