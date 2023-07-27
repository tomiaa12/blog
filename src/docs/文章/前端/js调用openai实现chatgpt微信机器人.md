# js 调用 openai 实现 chatgpt 微信机器人

## 前置条件

- 你需要有[openai](https://platform.openai.com/account/billing/overview)的账号
- 创建账号时很多国家的手机号是不允许注册的，可以在一些网站购买允许注册的手机号，可以在[这个网站](https://sms-activate.org/)，购买（需要充值 2 美元，支持支付宝）
- 充值后在左侧搜索`openai`的可注册的手机号，可以选可支持注册的国家，每个国家的手机号价格都不一样，在这里[查看 openAI 支持的国家](https://platform.openai.com/docs/supported-countries)，购买后在注册界面填写手机号，收到验证码之后就说明解码成功，如果没有收到你购买的钱可以退还。
- 有了账号之后你需要在 openAI 创建 token（这里 token 基本上过期时间只有一天，所以每天都需要创建新的 token 后粘贴到代码上重启项目，如果经常调用接口也可能会延长过期时间）
- 还需要有一台登录了微信的手机（并且这个微信是绑定过手机号，用过一段时间的，否则代码登录可能发不出消息，在代码登录之后手机的微信不能退出，就像 PC 登录了微信，手机退出时电脑也会自动退出）
- 运行项目后会调用`openai`的接口，本地调试可以调用`v2ray`的代理地址转发到`openai`的地址，服务器也是一样，在[这里项目](https://github.com/missuo/OpenAI-Checker)服务器运行下面的命令可以检测你的服务器能不能调通`openAI`的服务器
  ```sh
  bash <(curl -Ls https://cdn.jsdelivr.net/gh/missuo/OpenAI-Checker/openai.sh)
  ```
- 如果你的服务器不能 ping 通，还可以使用[vercel 反向代理](https://github.com/tomiaa12/vercel-reverse-proxy)或者[cloudflare 反向代理](https://github.com/tomiaa12/cloudflare-reverse-proxy)

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

## 私信自动回复

```ts
if (message.text()) {
  // 文字消息
  const msg = message.text()
  const res = await getMsg(msg)
  await message.say(res.data.choices[0].message.content)
}
```

<script setup lang="ts">
import CommunicationGroup from "../../../layout/CommunicationGroup/index.vue"
</script>

## demo

[demo 源码地址](https://github.com/tomiaa12/node-chatgpt-wechat/tree/main)

## 加微信群体验

<CommunicationGroup />
