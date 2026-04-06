import type { ExerciseIssue } from "./types"

export const issue13: ExerciseIssue = {
  id: "issue-13",
  menuTitle: "第13期 · 非限定从",
  title: "第13期：非限定性定语从句（非限定从）",
  subtitle: "逗号 + who/which/where/whose；不用 that",
  items: [
    {
      n: 1,
      prompt:
        "我姐姐是一名医生，每天加班工作。（医生=doctor，工作=work[vi.]，加班=overtime[adv.]）",
      answers: ["My sister, who is a doctor, works overtime every day."],
      explanation:
        "非限定从不用 that，引导词一般不省略；逗号隔开插入说明。",
    },
    {
      n: 2,
      prompt: "这本书，我上周买的，非常有趣。（有趣=interesting[adj.]，上周=last week）",
      answers: [
        "This book, which I bought last week, is very interesting.",
      ],
      explanation:
        "主干 This book is very interesting；which 指 book。",
    },
    {
      n: 3,
      prompt:
        "我们的猫有着棕色的毛，总是捣乱。（棕色的=brown[adj.]，毛=hair，总是=always，捣乱=make trouble）",
      answers: ["Our cat, which has brown hair, always makes trouble."],
      explanation:
        "which 指 cat；非限定从说明毛色。",
    },
    {
      n: 4,
      prompt: "那座城堡，其屋顶是红色的，是我的。（城堡=castle，屋顶=roof）",
      answers: ["That castle, whose roof is red, is mine."],
      explanation:
        "whose 表所属。",
    },
    {
      n: 5,
      prompt:
        "我的邻居在院子里画画，是一位画家。（邻居=neighbor，院子=yard，画画=paint[vi.]，画家=painter）",
      answers: [
        "My neighbor, who is a painter, is painting in the yard.",
        "My neighbor is painting in the yard, who is a painter.",
      ],
      explanation:
        "更自然语序为 who is a painter 紧贴 neighbor；材料中另有一种逗号后置写法，一并判对。",
    },
    {
      n: 6,
      prompt:
        "小明是我外甥，在考试中得了第一名。（外甥=nephew，考试=exam，第一名=first place）",
      answers: [
        "Xiaoming is my nephew, who got the first place in the exam.",
        "Xiaoming, who got the first place in the exam, is my nephew.",
      ],
      explanation:
        "两种主干选择均可，注意逗号与非限定从位置。",
    },
    {
      n: 7,
      prompt:
        "这个公园，我们以前经常在那儿聊天，现在已经改变了很多。（公园=park，聊天=chat，改变=change，很多=a lot）",
      answers: [
        "This park, where we often chatted, has changed a lot.",
        "This park, in which we often chatted, has changed a lot.",
      ],
      explanation:
        "where / in which 指 park。",
    },
    {
      n: 8,
      prompt:
        "这台机器，其价格很高，运行很快。（机器=machine，价格=price，高的=high，运行=run，快=fast）",
      answers: ["This machine, whose price is high, runs fast."],
      explanation:
        "whose price。",
    },
    {
      n: 9,
      prompt:
        "我的表弟是一位音乐家，他创作了很多歌曲。（表弟=cousin，音乐家=musician，创作=create，歌曲=song）",
      answers: [
        "My cousin is a musician, who created many songs.",
        "My cousin, who created many songs, is a musician.",
      ],
      explanation:
        "who 指 cousin。",
    },
    {
      n: 10,
      prompt:
        "正如大家所看到的，那个短视频很刺激。（大家=everyone，看到=see，短的=short，视频=video，刺激的=thrilling）",
      answers: [
        "As everyone sees, that short video is thrilling.",
        "As everyone can see, that short video is thrilling.",
      ],
      explanation:
        "As 引导非限定从，可放句首。",
    },
    {
      n: 11,
      prompt:
        "我的家乡有一段很长的历史，我在家乡住九年了。（家乡=hometown，历史=history）",
      answers: [
        "My hometown has a long history, where I have lived for nine years.",
        "My hometown has a long history, in which I have lived for nine years.",
      ],
      explanation:
        "where 指 hometown。",
    },
    {
      n: 12,
      prompt:
        "我阿姨喜欢画画，有一个艺术工作室。（阿姨=aunt，画画=painting，艺术=art，工作室=studio）",
      answers: [
        "My aunt, who likes painting, has an art studio.",
        "My aunt has an art studio, who likes painting.",
      ],
      explanation:
        "who likes painting 修饰 aunt。",
    },
    {
      n: 13,
      prompt:
        "那只猫（我在街上捡到的）非常友好。（街道=street，捡到=pick up，友好的=friendly[adj.]）",
      answers: [
        "That cat, which I picked up on the street, is very friendly.",
      ],
      explanation:
        "括号仅为提示，译句不必保留括号。",
    },
    {
      n: 14,
      prompt:
        "他的工作（要求频繁的出差）非常刺激。（工作=job，要求=require，频繁的=frequent，出差=travel，刺激的=exciting）",
      answers: [
        "His job, which requires frequent travel, is so exciting.",
        "His job, which requires frequent travelling, is so exciting.",
      ],
      explanation:
        "frequent travel / travelling。",
    },
    {
      n: 15,
      prompt:
        "那家餐厅（供应意大利菜）总是很拥挤。（餐厅=restaurant，供应=serve，意大利的=Italian，菜=dish，拥挤的=crowded）",
      answers: [
        "That restaurant, which serves Italian dishes, is always crowded.",
      ],
      explanation:
        "which serves Italian dishes。",
    },
    {
      n: 16,
      prompt:
        "我的笔记本电脑（我经常使用的）需要升级。（笔记本电脑=laptop，使用=use，升级=upgrade）",
      answers: [
        "My laptop, which I often use, needs an upgrade.",
        "My laptop, which I often use, needs upgrade.",
      ],
      explanation:
        "needs an upgrade 更常见；材料原用 needs upgrade 亦判对。",
    },
    {
      n: 17,
      prompt:
        "那首歌（我从收音机那儿听到的）正在我脑海里盘旋。（收音机=radio，听到=hear，脑海=mind，盘旋=linger）",
      answers: [
        "The song, which I heard from the radio, is lingering in my mind.",
      ],
      explanation:
        "which I heard from the radio。",
    },
    {
      n: 18,
      prompt:
        "这家酒店（早上9点开放）非常安静。（酒店=hotel，开放=open[vi.]，安静的=quiet）",
      answers: [
        "The hotel, which opens at 9 in the morning, is so quiet.",
        "The hotel, which opens at nine in the morning, is so quiet.",
      ],
      explanation:
        "which opens at 9 in the morning。",
    },
    {
      n: 19,
      prompt:
        "这个运动员（赢得了金牌）成了一位英雄。（运动员=athlete，赢得=win[won]，金的=gold，奖牌=medal，成为=become，英雄=hero）",
      answers: [
        "The athlete, who won the gold medal, became a hero.",
        "The athlete, who won a gold medal, became a hero.",
      ],
      explanation:
        "who won the gold medal。",
    },
    {
      n: 20,
      prompt:
        "我叔叔（喜欢徒步）去年去攀登珠穆朗玛峰。（叔叔=uncle，徒步=hiking，攀登=climb，珠穆朗玛峰=Mount Everest）",
      answers: [
        "My uncle, who likes hiking, climbed Mount Everest last year.",
      ],
      explanation:
        "who likes hiking 插入说明。",
    },
  ],
}
