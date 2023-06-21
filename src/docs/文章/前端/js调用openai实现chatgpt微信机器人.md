# js 调用 openai 实现 chatgpt 微信机器人

## 前置条件

- 你需要有[openai](https://platform.openai.com/account/billing/overview)的账号
- 创建账号时很多国家的手机号是不允许注册的，可以再一些网站购买允许注册的手机号，可以再[这个网站](https://sms-activate.org/)，购买（需要充值 2 美元）
- 有了账号之后你需要在 openAI 创建 token（这里 token 基本上过期时间只有一天，所以每天都需要创建新的 token 后粘贴到代码上重启项目）
- 还需要有一台登录了微信的手机（并且这个微信是绑定过手机号，用过一段时间的，否则代码登录可能发不出消息，在代码登录之后手机的微信不能退出，就像 PC 登录了微信，手机退出时电脑也会自动退出）

## 安装依赖

```sh
npm i wechaty
npm i axios
```

## 登录微信

输出的链接浏览器打开，微信扫码登录即可。

```ts
import { WechatyBuilder } from "wechaty"

const apiKey = "你的openAI key"

// 调用 ChatGPT4 模型
const model = "gpt-3.5-turbo"

let username = ""
const wechaty = WechatyBuilder.build()
wechaty
  .on("scan", (qrcode, status) =>
    console.log(
      `二维码${status}: https://wechaty.js.org/qrcode/${encodeURIComponent(
        qrcode
      )}`
    )
  )
  .on("login", user =>
    console.log(`用户名 ${(username = user.name() || "")} 登录成功`)
  )
```

## 群聊自动@回复

以下实现群@当前登录的用户是，@回复对方

```ts
.on("message", async (message) => {
    // 如果是群聊消息
    if (message.room()) {
      // const type = message.type();
      const msg = message.text().replace(`@${username}`, "");
      const room = await message.room();
      const isMentioned = await message.mentionSelf();
      const contact = message.talker();
      const topic = await room.topic();
      // const includes = [""]

      if (isMentioned) {
        try {
          const res = await axios({
            method: "post",
            url: "https://api.openai.com/v1/chat/completions",
            headers: {
              Authorization: "Bearer " + apiKey,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              model,
              messages: [{ role: "user", content: msg }],
            }),
            timeout: 0,
          });
          console.log(
            `群号: ${topic}, 用户名: ${contact.name()}, 消息: ${msg},回答: ${
              res.data.choices[0].message.content
            }`
          );
          room.say(`@${contact.name()} ${res.data.choices[0].message.content}`);
        } catch (e) {
          console.log("报错: ", e.message);
          room.say(`@${contact.name()} 报错了...`);
        }
      }
    }
  });

// 事件监听完成后开始启动
wechaty.start();
```

<script setup lang="ts">
import CommunicationGroup from "../../../layout/CommunicationGroup.vue"
</script>

## demo

[demo 源码地址](https://github.com/tomiaa12/node-chatgpt-wechat/tree/main)

## 加微信群体验

<CommunicationGroup />
