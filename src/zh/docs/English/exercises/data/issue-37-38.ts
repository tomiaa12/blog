import type { ExerciseIssue } from "./types"

export const issue3738: ExerciseIssue = {
  id: "issue-37-38",
  menuTitle: "第37–38期 · 复合形容词",
  title: "第37–38期：自造形容词（复合形容词）",
  subtitle: "well-known / state-of-the-art / -free / user-friendly 等",
  items: [
    {
      n: 1,
      prompt:
        "她在文学界是一位知名作家。（文学界=literary world，知名的=well-known，作家=writer）",
      answers: ["She is a well-known writer in the literary world."],
      explanation: "well-known；in the literary world。",
    },
    {
      n: 2,
      prompt:
        "该公司上个月推出了一款尖端产品。（公司=company，推出=launch，尖端的=state-of-the-art，产品=product）",
      answers: [
        "The company launched a state-of-the-art product last month.",
        "This company launched a state-of-the-art product last month.",
      ],
      explanation: "state-of-the-art 作定语。",
    },
    {
      n: 3,
      prompt:
        "他有一个长期的职业发展规划。（长期的=long-term，职业=career，发展=development，规划=plan）",
      answers: ["He has a long-term career development plan."],
      explanation: "long-term 修饰 plan。",
    },
    {
      n: 4,
      prompt:
        "墙上的老式时钟增添了一种历史感。（墙=wall，老式的=old-fashioned，增添=add，历史感=a sense of history）",
      answers: [
        "The old-fashioned clock on the wall adds a sense of history.",
      ],
      explanation: "a sense of history 很自然。",
    },
    {
      n: 5,
      prompt: "她是一名兼职学生。（兼职的=part-time，学生=student）",
      answers: ["She is a part-time student."],
      explanation: "part-time 作定语。",
    },
    {
      n: 6,
      prompt: "这是一款用户友好的软件。（用户友好的=user-friendly，软件=software）",
      answers: [
        "This is user-friendly software.",
        "This is a user-friendly piece of software.",
      ],
      explanation: "software 不可数时常不加 a。",
    },
    {
      n: 7,
      prompt:
        "她穿了一件单肩连衣裙去参加派对。（穿=wear，单肩的=one-shoulder，连衣裙=dress，参加=attend，派对=party）",
      answers: ["She wore a one-shoulder dress to attend the party."],
      explanation: "one-shoulder dress。",
    },
    {
      n: 8,
      prompt:
        "这是一款自制的顶级游戏。（自制的=self-made，顶级的=top-level，游戏=game）",
      answers: ["This is a self-made top-level game."],
      explanation: "复合形容词叠用。",
    },
    {
      n: 9,
      prompt:
        "这座新建的桥梁极大地改善了当地的交通。（新建的=newly-built，桥梁=bridge，改善=improve，当地的=local，交通=traffic）",
      answers: [
        "The newly-built bridge has tremendously improved the local traffic.",
      ],
      explanation: "现在完成时 has improved。",
    },
    {
      n: 10,
      prompt:
        "这双高品质的皮鞋摸起来非常舒服。（高品质的=high-quality，皮鞋=leather shoes，摸起来=feel，舒服的=comfortable）",
      answers: [
        "The high-quality leather shoes feel very comfortable.",
      ],
      explanation: "feel 系动词 + 形容词。",
    },
    {
      n: 11,
      prompt:
        "这个手绘花瓶是一件独特的艺术品。（手绘的=hand-painted，花瓶=vase，独特的=unique，艺术品=work of art）",
      answers: ["The hand-painted vase is a unique work of art."],
      explanation: "hand-painted 作定语。",
    },
    {
      n: 12,
      prompt:
        "这款无糖甜点对于她来说是个不错的选择。（无糖的=sugar-free，甜点=dessert，选择=choice/option，对于=for）",
      answers: [
        "This sugar-free dessert is a great choice for her.",
        "This sugar-free dessert is a good option for her.",
      ],
      explanation: "sugar-free；for her。",
    },
    {
      n: 13,
      prompt:
        "这块防水手表在水中依然能正常工作。（防水的=water-resistant，依然=still，手表=watch，正常地=normally）",
      answers: [
        "The water-resistant watch can still work normally in water.",
      ],
      explanation: "water-resistant。",
    },
    {
      n: 14,
      prompt: "她是个心地善良的百万富翁。（心地善良的=kind-hearted，百万富翁=millionaire）",
      answers: ["She is a kind-hearted millionaire."],
      explanation: "kind-hearted。",
    },
    {
      n: 15,
      prompt:
        "这位思想开明的老师鼓励学生自由表达他们的观点。（思想开明的=open-minded，鼓励=encourage，自由地=freely，观点=opinion）",
      answers: [
        "The open-minded teacher encourages the students to express their opinions freely.",
      ],
      explanation: "encourage sb. to do。",
    },
    {
      n: 16,
      prompt:
        "这位心不在焉的教授经常忘记他把钥匙放在哪里了。（心不在焉的=absent-minded，教授=professor，钥匙=key）",
      answers: [
        "The absent-minded professor often forgets where he puts his keys.",
      ],
      explanation: "where 引导宾语从句，陈述语序。",
    },
    {
      n: 17,
      prompt:
        "这位意志坚强的运动员从不轻易放弃。（意志坚强的=strong-willed，运动员=athlete，从不=never，放弃=give up，轻易地=easily）",
      answers: ["The strong-willed athlete never gives up easily."],
      explanation: "never 已含否定。",
    },
    {
      n: 18,
      prompt:
        "计划的紧急变更造成了许多混乱。（紧急的=last-minute，变更=change，造成=cause，混乱=confusion）",
      answers: [
        "The last-minute change in the plan caused a lot of confusion.",
        "The last-minute change to the plan caused a lot of confusion.",
      ],
      explanation: "in/to the plan。",
    },
    {
      n: 19,
      prompt:
        "这场期待已久的音乐会昨晚终于举行了。（期待已久的=long-awaited，音乐会=concert，举行=take place，昨晚=last night）",
      answers: [
        "The long-awaited concert finally took place last night.",
      ],
      explanation: "take place 表发生、举行。",
    },
    {
      n: 20,
      prompt:
        "这艘命运悲惨的船在风暴中沉没。（命运悲惨的=ill-fated，船=ship，风暴=storm，沉没=sink）",
      answers: ["The ill-fated ship sank in the storm."],
      explanation: "ill-fated；sink 过去式 sank。",
    },
  ],
}
