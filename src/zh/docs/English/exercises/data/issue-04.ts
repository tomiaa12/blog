import type { ExerciseIssue } from "./types"

export const issue04: ExerciseIssue = {
  id: "issue-04",
  menuTitle: "第4期 · 一般疑问句",
  title: "第4期：一般疑问句",
  subtitle: "Do/Does/Be 提前",
  items: [
    {
      n: 1,
      prompt: "他每天跑步吗？（每天=every day，跑步=run）",
      answers: ["Does he run every day?"],
      explanation:
        "主语 he 为第三人称单数，助动词用 does，谓语 run 用原形。\n陈述句：He runs every day. → 疑问句：Does he run every day?\nevery day 作时间状语常放句末。",
    },
    {
      n: 2,
      prompt:
        "我们早上读书吗？（读=read，（在）早上=in the morning；少数时间名词要写成介词短语放在句末）",
      answers: ["Do we read books in the morning?"],
      explanation:
        "泛指“读书”常用 read books；in the morning 为时间状语。",
    },
    {
      n: 3,
      prompt: "他们玩足球吗？（玩=play，足球=football）",
      answers: ["Do they play football?"],
      explanation:
        "football 表运动时多为不可数，前面常不加冠词。",
    },
    {
      n: 4,
      prompt: "你说英语吗？（说=speak，英语=English）",
      answers: ["Do you speak English?"],
      explanation:
        "English 表语言时为不可数专有名词，一般不加冠词。",
    },
    {
      n: 5,
      prompt:
        "这座图书馆十分漂亮吗？（图书馆=library，漂亮=pretty 或 beautiful[adj.]；注意一句一谓）",
      answers: [
        "Is this library pretty?",
        "Is this library beautiful?",
      ],
      explanation:
        "句中无实义动词作谓语时需用 be；主语 this library 为单数，用 Is 提前。\n陈述句：This library is pretty. → Is this library pretty?",
    },
    {
      n: 6,
      prompt: "小红有兄弟吗？（兄弟=brother）",
      answers: [
        "Does Xiaohong have a brother?",
        "Does Xiaohong have brothers?",
      ],
      explanation:
        "主语 Xiaohong 为第三人称单数，用 Does，have 用原形。\n未指明数量时 a brother / brothers 均可。",
    },
    {
      n: 7,
      prompt:
        "你老公住在中国吗？（老公=husband，住在=live in，中国=China）",
      answers: ["Does your husband live in China?"],
      explanation:
        "主语中心词是 husband（单三），用 does；live in China 为固定搭配。",
    },
    {
      n: 8,
      prompt: "他晚上去上学吗？（晚上=in the evening；去上学=go to school）",
      answers: ["Does he go to school in the evening?"],
      explanation:
        "go to school 表“上学”时常不加 the；时间状语 in the evening 放句末。",
    },
    {
      n: 9,
      prompt:
        "你们下午有会议吗？（下午=in the afternoon，会议=meeting）",
      answers: [
        "Do you have a meeting in the afternoon?",
        "Do you have meetings in the afternoon?",
      ],
      explanation:
        "a meeting 强调一场；meetings 表泛指多次/多场均可。",
    },
    {
      n: 10,
      prompt:
        "咱吃晚餐吗？（吃=have，晚餐=supper；此处 have 表示吃喝）",
      answers: ["Do we have supper?"],
      explanation:
        "have supper 表吃晚餐；主语咱用 we。",
    },
    {
      n: 11,
      prompt: "你看电视吗？（看=watch，电视=TV；watch 表“观看”）",
      answers: ["Do you watch TV?"],
      explanation:
        "watch TV 泛指看电视节目，常不加冠词。",
    },
    {
      n: 12,
      prompt:
        "你爸爸开车吗？（爸爸=father，开（驾驶）=drive，车=car；drive 也可单表开车动作）",
      answers: ["Does your father drive?"],
      explanation:
        "主语 your father 为单三；drive 可单独作谓语表开车。",
    },
    {
      n: 13,
      prompt:
        "他老婆喜欢冰淇淋吗？（老婆=wife，冰淇淋=ice cream；ice=冰，cream=奶油）",
      answers: ["Does his wife like ice cream?"],
      explanation:
        "ice cream 此处多作不可数；用 Does，like 用原形。",
    },
    {
      n: 14,
      prompt: "她每天做作业吗？（做=do，作业=homework）",
      answers: ["Does she do homework every day?"],
      explanation:
        "第一个 does 为助动词，后面 do homework 的 do 为实义动词“做”。",
    },
    {
      n: 15,
      prompt:
        "那些窗户是白色的吗？（窗户=window，白色的=white[adj.]）",
      answers: ["Are those windows white?"],
      explanation:
        "主系表结构，变疑问句将 be 提前：Those windows are white. → Are those windows white?",
    },
    {
      n: 16,
      prompt:
        "他父母很悲伤吗？（父母=parents（复数），悲伤=sad[adj.]）",
      answers: ["Are his parents sad?"],
      explanation:
        "parents 为复数，用 Are。",
    },
    {
      n: 17,
      prompt:
        "这个瓶子在桌子上吗？（瓶子=bottle，在桌子上=on the table；on 为介词）",
      answers: ["Is this bottle on the table?"],
      explanation:
        "主语 + 介词短语表位置时需加 be：This bottle is on the table. → Is this bottle on the table?",
    },
    {
      n: 18,
      prompt:
        "你的最爱是排球吗？（最爱=favorite（名词），排球=volleyball；表排球运动时常不可数）",
      answers: ["Is your favorite volleyball?"],
      explanation:
        "favorite / favourite 美英式拼写均可。",
    },
    {
      n: 19,
      prompt:
        "音乐是小强的最爱吗？（音乐=music（不可数），小强的=Xiaoqiang's）",
      answers: ["Is music Xiaoqiang's favorite?"],
      explanation:
        "名词所有格 Xiaoqiang's；music 不可数，前常无冠词。",
    },
    {
      n: 20,
      prompt: "我是一个老板吗？（老板=boss）",
      answers: ["Am I a boss?"],
      explanation:
        "主语 I 搭配 am，变疑问句将 Am 提前：Am I a boss?",
    },
  ],
}
