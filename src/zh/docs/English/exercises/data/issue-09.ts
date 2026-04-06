import type { ExerciseIssue } from "./types"

export const issue09: ExerciseIssue = {
  id: "issue-09",
  menuTitle: "第9期 · 进行与近将来",
  title: "第9期：过去/现在进行时",
  subtitle: "be + doing；短暂动词表将来",
  items: [
    {
      n: 1,
      prompt: "她们昨天在购物。（购物=shop[vi.]）",
      answers: ["They were shopping yesterday."],
      explanation:
        "昨天 + 在进行→过去进行时 were shopping。",
    },
    {
      n: 2,
      prompt:
        "他们那个时候在做饭。（那个时候=then / at that time，做饭=cook[vi.]）",
      answers: [
        "They were cooking at that time.",
        "They were cooking then.",
      ],
      explanation:
        "过去时间点→were cooking。",
    },
    {
      n: 3,
      prompt:
        "你在看一部电视连续剧吗？（观看=watch[vt.]，电视连续剧=TV series，series 单复数同型）",
      answers: ["Are you watching a TV series?"],
      explanation:
        "进行时提前 be；a TV series。",
    },
    {
      n: 4,
      prompt: "我正在给花浇水。（给……浇水=water[vt.]，花=flower）",
      answers: [
        "I am watering the flowers.",
        "I was watering the flowers.",
      ],
      explanation:
        "“正在”为进行；未标明现在/过去时，am/was 皆可。",
    },
    {
      n: 5,
      prompt: "这些人在聊天吗？（聊天=chat[chatting]）",
      answers: [
        "Are these people chatting?",
        "Were these people chatting?",
      ],
      explanation:
        "进行时提前 be；时间未指明时 are/were 皆可。",
    },
    {
      n: 6,
      prompt: "他现在正在听音乐（听=listen to，音乐=music）",
      answers: ["He is listening to music."],
      explanation:
        "listen to；music 不可数泛指不加冠词。",
    },
    {
      n: 7,
      prompt:
        "昨天下午，Tom 打算离开这块土地（离开=leave，土地=land）",
      answers: [
        "Yesterday afternoon, Tom was leaving this land.",
        "Tom was going to leave this land yesterday afternoon.",
      ],
      explanation:
        "短暂动词进行时可表过去将来；也可用 was going to。",
    },
    {
      n: 8,
      prompt:
        "小红三天前正面临一场灾难（三天前=three days ago，面临=face[facing][vt.]，灾难=disaster）",
      answers: [
        "Three days ago, Xiaohong was facing a disaster.",
        "Xiaohong was facing a disaster three days ago.",
      ],
      explanation:
        "ago 表过去，进行用 was facing。",
    },
    {
      n: 9,
      prompt:
        "这些男孩们为啥在读这本小说？（男孩=boy，读=read，小说=novel）",
      answers: ["Why are these boys reading this novel?"],
      explanation:
        "Why + be + doing。",
    },
    {
      n: 10,
      prompt: "它正在准备早餐（准备=prepare[vt.]，早餐=breakfast）",
      answers: ["It is preparing breakfast."],
      explanation:
        "prepare 去 e 加 ing；breakfast 多作不可数。",
    },
    {
      n: 11,
      prompt: "这些山羊就快死了。（山羊=goat，死=die[dying][vi.]）",
      answers: [
        "The goats are dying.",
        "The goats are going to die.",
      ],
      explanation:
        "die 的进行时常表即将发生。",
    },
    {
      n: 12,
      prompt:
        "她下周就要回到她的国家。（下周=next week，回=return[vi.]，国家=country）",
      answers: [
        "She is going to return to her country next week.",
        "She will return to her country next week.",
        "She is returning to her country next week.",
      ],
      explanation:
        "be going to / will / 短暂动词进行均可表将来。",
    },
    {
      n: 13,
      prompt: "她昨晚正在哪里写报告？（写=write[writing]，报告=report）",
      answers: ["Where was she writing the report last night?"],
      explanation:
        "过去进行：was + writing。",
    },
    {
      n: 14,
      prompt: "那个演员现在正在表演吗？（演员=actor，现在=now，表演=perform[vi.]）",
      answers: ["Is that actor performing now?"],
      explanation:
        "now 常放句末。",
    },
    {
      n: 15,
      prompt:
        "十名同学正在操场上跑步（同学=classmate，操场=playground，跑步=run）",
      answers: ["Ten classmates are running on the playground."],
      explanation:
        "run 不及物，on the playground。",
    },
    {
      n: 16,
      prompt:
        "九个工人正在建造一座牢房。（工人=worker，建造=build[vt.]，牢房=jail）",
      answers: ["Nine workers are building a jail."],
      explanation:
        "现在进行时 are building。",
    },
    {
      n: 17,
      prompt:
        "我今晚将会关窗。（今晚=tonight，关上=close[vt.]，窗户=window）",
      answers: [
        "I am closing the windows tonight.",
        "I will close the windows tonight.",
        "I am going to close the windows tonight.",
      ],
      explanation:
        "短暂动词进行可表将要；will / be going to 亦可。",
    },
    {
      n: 18,
      prompt:
        "这部电影将在十分钟内开始。（在十分钟内=in ten minutes，开始=begin/start[vi.]）",
      answers: [
        "This movie is starting in ten minutes.",
        "This movie will start in ten minutes.",
        "This movie is going to start in ten minutes.",
      ],
      explanation:
        "in ten minutes 表将来；进行/ will / going to 均可。",
    },
    {
      n: 19,
      prompt: "这块钟正在响吗？（钟=clock，响=ring[vi.]）",
      answers: [
        "Is this clock ringing?",
        "Was this clock ringing?",
      ],
      explanation:
        "时间未指明时 Is/Was 皆可。",
    },
    {
      n: 20,
      prompt:
        "四个月前，这些孩子正在学习新技能吗？（孩子=child[复数 children]，学习=learn，新的=new[adj.]，技能=skill）",
      answers: ["Were these children learning new skills four months ago?"],
      explanation:
        "four months ago + 过去进行；时间状语疑问句中常放句末。",
    },
  ],
}
