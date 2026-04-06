import type { ExerciseIssue } from "./types"

export const issue4142: ExerciseIssue = {
  id: "issue-41-42",
  menuTitle: "第41–42期 · 倒装",
  title: "第41–42期：倒装句（状语提前）",
  subtitle: "Here comes / There goes / 完全倒装 / 部分倒装",
  items: [
    {
      n: 1,
      prompt: "这里来了一辆公交车。",
      answers: ["Here comes a bus."],
      explanation: "Here + 谓语 + 主语（完全倒装）。",
    },
    {
      n: 2,
      prompt: "末班车开走了。（末班车=last train，走=go，用 there 开头）",
      answers: ["There goes the last train."],
      explanation: "There goes + 主语。",
    },
    {
      n: 3,
      prompt: "现在轮到你了。（现在=now，轮次=turn）",
      answers: ["Now comes your turn."],
      explanation: "Now comes your turn. 完全倒装。",
    },
    {
      n: 4,
      prompt:
        "接着就出现了谁应该带头的问题。（接着=then，出现=arise，问题=question，带头=take the lead）",
      answers: [
        "Then arose the question of who should take the lead.",
      ],
      explanation: "Then arose + 主语；of who… 修饰 question。",
    },
    {
      n: 5,
      prompt:
        "房子前面矗立着一棵老橡树。（在……前面=in front of，矗立=stand，橡树=oak tree）",
      answers: [
        "In front of the house stood an old oak tree.",
        "There stood an old oak tree in front of the house.",
      ],
      explanation: "地点状语提前引起倒装。",
    },
    {
      n: 6,
      prompt: "这里是你的收据。（收据=receipt）",
      answers: ["Here is your receipt."],
      explanation: "Here is + 主语。",
    },
    {
      n: 7,
      prompt: "桌子上有一封粉色的信。（粉色的=pink，信=letter）",
      answers: ["There is a pink letter on the table."],
      explanation: "there be 句型。",
    },
    {
      n: 8,
      prompt: "房间的角落里坐着一个小女孩。（角落=corner）",
      answers: ["In the corner of the room sat a little girl."],
      explanation: "介词短语提前，完全倒装。",
    },
    {
      n: 9,
      prompt: "树下站着一匹漂亮的马。（树=tree，马=horse）",
      answers: ["Under the tree stood a beautiful horse."],
      explanation: "Under the tree + stood + 主语。",
    },
    {
      n: 10,
      prompt:
        "大厅的后面站着一位著名的演讲者。（在……后面=at the back of，大厅=hall，演讲者=lecturer）",
      answers: ["At the back of the hall stood a famous lecturer."],
      explanation: "地点状语提前。",
    },
    {
      n: 11,
      prompt: "沿着河边有一条狭窄的小路。（沿着=along，河边=riverside，狭窄的=narrow，小路=path）",
      answers: [
        "Along the riverside is a narrow path.",
        "Along the river side is a narrow path.",
      ],
      explanation: "Along… 提前；riverside 常连写。",
    },
    {
      n: 12,
      prompt: "两座建筑物之间有一个小花园。（建筑物=building，花园=garden）",
      answers: ["Between the two buildings is a small garden."],
      explanation: "Between… 提前。",
    },
    {
      n: 13,
      prompt: "在云层上方飞着一架飞机。（云=cloud，上方=above，飞=fly，飞机=plane）",
      answers: [
        "Above the clouds flew a plane.",
        "Above the clouds flew an aeroplane.",
      ],
      explanation: "Above the clouds + flew + 主语。",
    },
    {
      n: 14,
      prompt:
        "他对危险一无所知。（危险=danger，一无所知=know little about；需将 little 提前引起倒装）",
      answers: ["Little did he know about the danger."],
      explanation: "否定意义副词 Little 提前 → 部分倒装 did he know。",
    },
    {
      n: 15,
      prompt: "直到午夜他才完成工作。（直到……才=not until，午夜=midnight）",
      answers: ["Not until midnight did he finish his work."],
      explanation: "Not until 提前 → did he finish。",
    },
    {
      n: 16,
      prompt: "我们决不应该轻易放弃。（决不=in no way，放弃=give up，轻易地=easily）",
      answers: ["In no way should we give up easily."],
      explanation: "In no way 提前 → should we…",
    },
    {
      n: 17,
      prompt:
        "我决不会说谎。（决不=under no circumstances，说谎=tell a lie / lie）",
      answers: [
        "Under no circumstances will I tell a lie.",
        "Under no circumstances will I lie.",
      ],
      explanation: "Under no circumstances 提前 → will I…",
    },
    {
      n: 18,
      prompt:
        "我刚到就开始下雨了。（用 Hardly had… when…；到达=arrive，下雨=it rains）",
      answers: [
        "Hardly had I arrived when it started to rain.",
        "Hardly had I arrived when it began to rain.",
      ],
      explanation: "Hardly had + 主语 + done when…",
    },
    {
      n: 19,
      prompt:
        "只有通过努力工作，我们才能实现我们的目标。（只有=only，通过=by，实现=achieve，目标=goal）",
      answers: [
        "Only by working hard can we achieve our goals.",
        "Only by working hard can we achieve our goal.",
      ],
      explanation: "Only by… 提前 → can we…",
    },
    {
      n: 20,
      prompt: "那儿已经有 10 位参赛者了。（用完成时，参赛者=contestant）",
      answers: ["There have been 10 contestants."],
      explanation: "There have been + 主语（现在完成）。",
    },
  ],
}
