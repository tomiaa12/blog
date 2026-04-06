import type { ExerciseIssue } from "./types"

export const issue01: ExerciseIssue = {
  id: "issue-01",
  menuTitle: "第1期 · 你、我、他",
  title: "第1期：你、我、他",
  subtitle: "人称与一般现在时第三人称单数",
  items: [
    {
      n: 1,
      prompt: "我们爱你（爱=love）",
      answers: ["We love you."],
      explanation:
        "我们爱你 = We love you.\n主语我们 We = 第一人称复数，非第三人称单数，故谓语 love 不需要加 s。",
    },
    {
      n: 2,
      prompt: "我喜欢她。（喜欢=like）",
      answers: ["I like her."],
      explanation:
        "我喜欢她 = I like her.\n主语我 = 第一人称单数，非第三人称单数，故谓语 like 不需要加 s。",
    },
    {
      n: 3,
      prompt: "他们帮助我们。（帮助=help）",
      answers: ["They help us."],
      explanation:
        "他们帮助我们 = They help us.\n主语他们 They = 第三人称复数，非第三人称单数，故谓语 help 不需要加 s。",
    },
    {
      n: 4,
      prompt: "她喂狗。（喂=feed，狗=dog）",
      answers: [
        "She feeds the dog.",
        "She feeds the dogs.",
        "She feeds a dog.",
        "She feeds dogs.",
      ],
      explanation:
        "她喂狗 = She feeds the dog.\n主语她 She = 第三人称单数，谓语 feed 需加 s。狗为独立名词，前面常加限定词 the 表特指。\n原文未指明一只还是多只，dog 或 dogs 均可。",
    },
    {
      n: 5,
      prompt: "你们理解我们。（理解=understand）",
      answers: ["You understand us."],
      explanation:
        "你们理解我们 = You understand us.\n主语你们 You = 第二人称复数，非第三人称单数，故谓语 understand 不需要加 s。",
    },
    {
      n: 6,
      prompt: "他们讨厌这个计划（讨厌=hate，计划=plan）",
      answers: ["They hate this plan.", "They hate the plan."],
      explanation:
        "他们讨厌这个计划 = They hate this plan.\n主语他们 They = 第三人称复数，谓语 hate 不需要加 s。计划 plan 前可用 this 或 the 等限定词。",
    },
    {
      n: 7,
      prompt: "这只猫喜欢我（猫=cat，喜欢=like）",
      answers: ["This cat likes me.", "The cat likes me."],
      explanation:
        "这只猫喜欢我 = This cat likes me.\n主语这只猫 = 第三人称单数，谓语 like 需加 s。this、the 均可。",
    },
    {
      n: 8,
      prompt: "Mike 买一辆车（买=buy，一辆车=a car）",
      answers: ["Mike buys a car."],
      explanation:
        "Mike 买一辆车 = Mike buys a car.\n主语 Mike = 第三人称单数，谓语 buy 需加 s。",
    },
    {
      n: 9,
      prompt: "他喜欢苹果（喜欢=like，苹果=apple）",
      answers: ["He likes apples.", "He likes apple."],
      explanation:
        "他喜欢苹果 = He likes apples.\n主语他 He = 第三人称单数，谓语 like 需加 s。\n无特指哪一个苹果时，常用复数 apples 表类别。",
    },
    {
      n: 10,
      prompt: "我们玩游戏（玩=play，游戏=game）",
      answers: ["We play games.", "We play a game."],
      explanation:
        "我们玩游戏 = We play games.\n主语我们 We = 第一人称复数，谓语 play 不需加 s。\n泛指时常用 games。",
    },
    {
      n: 11,
      prompt: "你们唱一首歌（唱=sing，一首歌=a song）",
      answers: ["You sing a song."],
      explanation:
        "你们唱一首歌 = You sing a song.\n主语你们 You = 第二人称复数，谓语 sing 不需加 s。",
    },
    {
      n: 12,
      prompt: "我们跑步（跑步=run）",
      answers: ["We run."],
      explanation:
        "我们跑步 = We run.\n主语我们 We = 第一人称复数，谓语 run 不需加 s。",
    },
    {
      n: 13,
      prompt: "这条狗咬你们（狗=dog，咬=bite）",
      answers: ["This dog bites you.", "The dog bites you."],
      explanation:
        "这条狗咬你们 = This dog bites you.\n主语为第三人称单数，谓语 bite 需加 s。The、This 均可。",
    },
    {
      n: 14,
      prompt: "这些鸟吃虫子（鸟=bird，吃=eat，虫子=bug）",
      answers: [
        "The birds eat the bug.",
        "These birds eat the bug.",
        "The birds eat the bugs.",
        "These birds eat the bugs.",
      ],
      explanation:
        "这些鸟吃虫子 = The birds eat the bug.\n主语鸟为复数，谓语 eat 不加 s。The birds、These birds 均可。\n虫子单复数未指明时 bug、bugs 均可。",
    },
    {
      n: 15,
      prompt: "我们喜欢披萨（披萨=pizza）",
      answers: ["We like pizzas.", "We like pizza."],
      explanation:
        "我们喜欢披萨 = We like pizzas.\n主语我们 We 为复数概念，谓语 like 不加 s。\n泛指时常用 pizzas。",
    },
    {
      n: 16,
      prompt: "我给他许多笔（给=give，笔=pen）",
      answers: ["I give him the pens.", "I give him many pens."],
      explanation:
        "我给他许多笔 = I give him the pens.\n主语 I，谓语 give 不加 s。“许多笔”表复数，pen 加 s。",
    },
    {
      n: 17,
      prompt: "你打他们（打=hit）",
      answers: ["You hit them."],
      explanation:
        "你打他们 = You hit them.\n主语你 You = 第二人称单数，非第三人称单数，谓语 hit 不加 s。",
    },
    {
      n: 18,
      prompt: "你们喂鸭子（喂=feed，鸭子=duck）",
      answers: [
        "You feed the duck.",
        "You feed the ducks.",
        "You feed a duck.",
        "You feed ducks.",
      ],
      explanation:
        "你们喂鸭子 = You feed the duck.\n主语你们 You 为复数，谓语 feed 不加 s。duck、ducks 均可。",
    },
    {
      n: 19,
      prompt: "我们看见了一道彩虹（看见=see，一道彩虹=a rainbow）",
      answers: ["We see a rainbow.", "We see the rainbow."],
      explanation:
        "我们看见了一道彩虹 = We see a rainbow.\n主语我们 We，谓语 see 不加 s。",
    },
    {
      n: 20,
      prompt: "我想念他们（想念=miss）",
      answers: ["I miss them."],
      explanation:
        "我想念他们 = I miss them.\n主语我 I = 第一人称单数，谓语 miss 不加 s。",
    },
  ],
}
