import type { ExerciseIssue } from "./types"

export const issue05: ExerciseIssue = {
  id: "issue-05",
  menuTitle: "第5期 · 特殊疑问句",
  title: "第5期：特殊疑问句",
  subtitle: "Wh- 疑问词与助动词 do/be",
  items: [
    {
      n: 1,
      prompt: "你住在哪里？（住=live）",
      answers: ["Where do you live?"],
      explanation:
        "先锁定疑问词“哪里”→ where；谓语为具体动作“住”，助动词用 do；主语 you 非单三，do 不变；余下陈述语序 you live。",
    },
    {
      n: 2,
      prompt: "他啥时候起床？（起床=get up）",
      answers: ["When does he get up?"],
      explanation:
        "疑问词 when；谓语含动作，用 do；主语 he 为单三，do→does；谓语 get 用原形 get up。",
    },
    {
      n: 3,
      prompt: "谁是他们的朋友？（朋友=friend）",
      answers: ["Who is their friend?"],
      explanation:
        "疑问词 Who 作主语时，直接按陈述语序：Who is their friend?",
    },
    {
      n: 4,
      prompt: "小明为什么学习法语？（学习=study/learn，法语=French）",
      answers: [
        "Why does Xiaoming study French?",
        "Why does Xiaoming learn French?",
      ],
      explanation:
        "Why 开头；动作谓语用 do；Xiaoming 单三→does；study/learn 用原形。",
    },
    {
      n: 5,
      prompt: "你今天感觉怎么样？（感觉=feel，今天=today）",
      answers: ["How do you feel today?"],
      explanation:
        "How 表“怎么样”；动作 feel→助动词 do；you 非单三；today 作状语放句末。",
    },
    {
      n: 6,
      prompt: "她骑哪辆自行车？（骑=ride，自行车=bike/bicycle）",
      answers: [
        "Which bike does she ride?",
        "Which bicycle does she ride?",
      ],
      explanation:
        "“哪辆”与自行车紧密相连→ Which bike；动作 ride→does；she 单三。",
    },
    {
      n: 7,
      prompt: "你最喜欢的水果是什么？（水果=fruit，最喜欢的=favorite[adj.]）",
      answers: ["What is your favorite fruit?"],
      explanation:
        "主干为“是”，无实义动作谓语→用 be；What is your favorite fruit?",
    },
    {
      n: 8,
      prompt: "我们什么时间睡觉？（时间=time，睡觉=sleep）",
      answers: [
        "What time do we sleep?",
        "When do we sleep?",
      ],
      explanation:
        "What time 与 when 在此可互换；动作 sleep→do；we 非单三。",
    },
    {
      n: 9,
      prompt: "你们现在去哪旅游？（旅游=travel，现在=now）",
      answers: ["Where do you travel now?"],
      explanation:
        "Where；travel 已含“去某地旅游”，不必再加 go；now 状语。",
    },
    {
      n: 10,
      prompt: "哪个季节是他们的最爱？（季节=season）",
      answers: ["Which season is their favorite?"],
      explanation:
        "Which season 作主语→陈述语序：Which season is their favorite?",
    },
    {
      n: 11,
      prompt: "那些是谁的土豆？（土豆=potato，复数 potatoes）",
      answers: ["Whose potatoes are those?"],
      explanation:
        "Whose potatoes 紧密相连；主语 those 复数→are。",
    },
    {
      n: 12,
      prompt:
        "它怎么来我工厂的？（来=come，工厂=factory；come 与 go 为不及物动词，后接介词 to 再接宾语）",
      answers: ["How does it come to my factory?"],
      explanation:
        "How；it 单三→does；come 原形；come to my factory。",
    },
    {
      n: 13,
      prompt: "我为啥讨厌这部电影？（电影=film/movie，讨厌=hate）",
      answers: [
        "Why do I hate this movie?",
        "Why do I hate this film?",
      ],
      explanation:
        "Why；I 非单三→do；hate 原形。",
    },
    {
      n: 14,
      prompt: "小红为啥聪明？（聪明=clever[adj.]）",
      answers: ["Why is Xiaohong clever?"],
      explanation:
        "无动作谓语、表状态→be；Xiaohong 单三→is。",
    },
    {
      n: 15,
      prompt: "小明在哪里买这个玩具？（买=buy，玩具=toy）",
      answers: ["Where does Xiaoming buy this toy?"],
      explanation:
        "Where；Xiaoming 单三→does；buy 原形。",
    },
    {
      n: 16,
      prompt: "谁摸我的蛋糕？（摸=touch，蛋糕=cake）",
      answers: ["Who touches my cake?"],
      explanation:
        "Who 作主语→Who touches my cake?（谓语随 who 单数概念用 touches）",
    },
    {
      n: 17,
      prompt: "你得到谁的礼物？（得到=get，礼物=gift）",
      answers: ["Whose gift do you get?"],
      explanation:
        "Whose gift；动作 get→do；you 非单三。",
    },
    {
      n: 18,
      prompt: "他们为啥看着我？（看着=look at）",
      answers: ["Why do they look at me?"],
      explanation:
        "look 不及物，接宾语用 look at；me 为宾格。",
    },
    {
      n: 19,
      prompt: "你怎么发现这个小偷的？（发现=find，小偷=thief）",
      answers: [
        "How do you find the thief?",
        "How did you find the thief?",
      ],
      explanation:
        "How；动作 find→do（现时时 do；若强调已发生也可用 did）。",
    },
    {
      n: 20,
      prompt: "我们现在帮谁？（帮=help）",
      answers: ["Who do we help now?"],
      explanation:
        "Who 作宾语→Who do we help now? 助动词 do + 原形 help。",
    },
  ],
}
