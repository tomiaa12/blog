import type { ExerciseIssue } from "./types"

export const issue06: ExerciseIssue = {
  id: "issue-06",
  menuTitle: "第6期 · 一般过去时",
  title: "第6期：一般过去时",
  subtitle: "过去式与 Did 疑问句",
  items: [
    {
      n: 1,
      prompt: "你昨天去公园了吗？（去=go[went]，公园=park）",
      answers: ["Did you go to the park yesterday?"],
      explanation:
        "陈述：You went to the park yesterday. 疑问用 Did，went 还原为 go。",
    },
    {
      n: 2,
      prompt:
        "他昨天七点参观了博物馆。（参观=visit，博物馆=museum，昨天七点=at seven yesterday）",
      answers: [
        "He visited the museum at seven yesterday.",
        "At seven yesterday, he visited the museum.",
      ],
      explanation:
        "过去时谓语用过去式 visited；时间状语常放句末，也可放句首加逗号。",
    },
    {
      n: 3,
      prompt:
        "小红四天前给警察打了电话。（给……打电话=call，警察=police，四天前=four days ago）",
      answers: [
        "Xiaohong called the police four days ago.",
        "Four days ago, Xiaohong called the police.",
      ],
      explanation:
        "call the police；four days ago 作状语。",
    },
    {
      n: 4,
      prompt: "我们曾经做过家务。（家务=housework）",
      answers: ["We did housework."],
      explanation:
        "“曾经”表过去；housework 不可数泛指，前常无冠词。",
    },
    {
      n: 5,
      prompt: "他之前啥时候见过小明？（见到=see[saw]）",
      answers: ["When did he see Xiaoming?"],
      explanation:
        "过去疑问用 Did；see 用原形。",
    },
    {
      n: 6,
      prompt: "这帽子曾经很新（帽子=cap，新=new[adj.]）",
      answers: ["This cap was new."],
      explanation:
        "状态用 be 的过去式 was。",
    },
    {
      n: 7,
      prompt:
        "他们昨晚在哪里吃的晚饭？（昨晚=last night，晚饭=supper）",
      answers: [
        "Where did they have supper last night?",
        "Where did they eat supper last night?",
      ],
      explanation:
        "Did + 原形 have/eat；last night 放句末。",
    },
    {
      n: 8,
      prompt:
        "她在超市里买过很多零食。（超市=supermarket，买=buy[bought]，很多=many[adj.]，零食=snack）",
      answers: [
        "She bought many snacks in the supermarket.",
        "In the supermarket, she bought many snacks.",
      ],
      explanation:
        "地点状语常放句末；有多个状语时时间常最后。",
    },
    {
      n: 9,
      prompt:
        "这只大象去年离开这家动物园（大象=elephant，去年=last year，离开=leave[left]，动物园=zoo）",
      answers: [
        "This elephant left the zoo last year.",
        "Last year, this elephant left the zoo.",
      ],
      explanation:
        "leave 过去式 left；last year 可前置。",
    },
    {
      n: 10,
      prompt:
        "他昨天下午制作了一张卡片（昨天下午=yesterday afternoon，制作=make[made]，卡片=card）",
      answers: [
        "He made a card yesterday afternoon.",
        "Yesterday afternoon, he made a card.",
      ],
      explanation:
        "make 过去式 made。",
    },
    {
      n: 11,
      prompt: "我写过三封信（写=write[wrote]，信=letter）",
      answers: ["I wrote three letters."],
      explanation:
        "英语常不用量词“封”，three letters 即可。",
    },
    {
      n: 12,
      prompt:
        "去年夏天，这只老鹰飞向农田。（去年夏天=last summer，老鹰=eagle，飞=fly[flew][vi.]，农田=farm）",
      answers: [
        "Last summer, this eagle flew to the farm.",
        "This eagle flew to the farm last summer.",
      ],
      explanation:
        "fly 不及物，接地点用 flew to the farm。",
    },
    {
      n: 13,
      prompt: "小红穿过哪件短裙？（穿=wear[wore]，短裙=skirt）",
      answers: ["Which skirt did Xiaohong wear?"],
      explanation:
        "Which skirt；过去疑问 Did；wear 原形。",
    },
    {
      n: 14,
      prompt: "她曾经学过十种语言（学习=learn[learnt/learned]，语言=language）",
      answers: [
        "She learned ten languages.",
        "She learnt ten languages.",
      ],
      explanation:
        "learnt/learned 均可；“种”不必译出。",
    },
    {
      n: 15,
      prompt:
        "我们一起去过海滩（去=go[went]，海滩=beach，一起=together[副词，常放句末]）",
      answers: ["We went to the beach together."],
      explanation:
        "go 过去式 went；together 放句末。",
    },
    {
      n: 16,
      prompt:
        "这位年老的女士曾遇见过一只猴子（年老的=old[adj.]，女士=lady，遇见=meet[met]，猴子=monkey）",
      answers: ["This old lady met a monkey."],
      explanation:
        "meet 过去式 met。",
    },
    {
      n: 17,
      prompt:
        "那些机器人昨天喝可乐了吗？（机器人=robot，喝=drink[drank]，可乐=coke）",
      answers: ["Did those robots drink coke yesterday?"],
      explanation:
        "陈述：Those robots drank coke yesterday. → Did … drink …",
    },
    {
      n: 18,
      prompt:
        "彩虹今天早上出现过吗？（彩虹=rainbow，今天早上=this morning，出现=appear）",
      answers: ["Did the rainbow appear this morning?"],
      explanation:
        "Did + appear 原形。",
    },
    {
      n: 19,
      prompt:
        "动物们今天下午在大厅里讨论了许多问题（动物=animal，今天下午=this afternoon，大厅=hall，讨论=discuss，许多=a lot of[adj.]，问题=question）",
      answers: [
        "The animals discussed a lot of questions in the hall this afternoon.",
        "This afternoon, the animals discussed a lot of questions in the hall.",
      ],
      explanation:
        "多状语时时间常放最后，地点倒数第二；亦可时间前置加逗号。",
    },
    {
      n: 20,
      prompt:
        "美味的牛肉曾在这栋楼房内（美味的=delicious[adj.]，牛肉=beef（不可数），楼房=building）",
      answers: ["The delicious beef was in this building."],
      explanation:
        "无动作谓语，用 be 过去式 was；beef 不可数。",
    },
  ],
}
