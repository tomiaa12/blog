import type { ExerciseIssue } from "./types"

export const issue1112: ExerciseIssue = {
  id: "issue-11-12",
  menuTitle: "第11–12期 · 定语从句",
  title: "第11–12期：英语的构成——定语从句",
  subtitle: "who/which/that/where/when/whose/why",
  items: [
    {
      n: 1,
      prompt: "这是我昨天买的图画。（图画=picture，买=buy[bought][vt.]）",
      answers: [
        "This is the picture I bought yesterday.",
        "This is the picture that I bought yesterday.",
        "This is the picture which I bought yesterday.",
      ],
      explanation:
        "先写主干 This is the picture，再把 I bought yesterday 变为定语从句贴在 picture 后；作宾语时关系代词可省略。",
    },
    {
      n: 2,
      prompt:
        "我们需要一个能说德语的人。（需要=need，说（语言）=speak，德语=German，人=person）",
      answers: [
        "We need a person who can speak German.",
        "We need a person that can speak German.",
      ],
      explanation:
        "从句中作主语的关系代词不可省。",
    },
    {
      n: 3,
      prompt: "他帮助了那个丢了钥匙的男孩。（丢=lose[lost]，钥匙=key）",
      answers: [
        "He helped that boy who lost the key.",
        "He helped that boy that lost the key.",
      ],
      explanation:
        "who/that 在从句作主语，不可省略。",
    },
    {
      n: 4,
      prompt:
        "她喜欢使其放松的古典音乐。（使……放松=relax，古典的=classical[adj.]）",
      answers: [
        "She likes classical music which relaxes her.",
        "She likes classical music that relaxes her.",
      ],
      explanation:
        "which/that 在从句作主语。",
    },
    {
      n: 5,
      prompt:
        "他昨晚提到的解决方案很有用。（提到=mention[vt.]，解决方案=solution，有用的=useful/helpful[adj.]）",
      answers: [
        "The solution he mentioned last night is useful.",
        "The solution that he mentioned last night is useful.",
        "The solution which he mentioned last night is useful.",
      ],
      explanation:
        "关系代词作宾语可省略。",
    },
    {
      n: 6,
      prompt: "他递给了我一张我喜欢的邮票。（递给=pass，邮票=stamp）",
      answers: [
        "He passed me a stamp that I like.",
        "He passed me a stamp which I like.",
        "He passed me a stamp I like.",
      ],
      explanation:
        "定语从句修饰 stamp，宾格位置可省略关系代词。",
    },
    {
      n: 7,
      prompt:
        "那就是小明拒绝治疗的原因。（拒绝=refuse[vi.]，治疗=treatment，原因=reason）",
      answers: [
        "That is the reason why Xiaoming refused treatment.",
        "That is the reason that Xiaoming refused treatment for.",
      ],
      explanation:
        "reason 常用 why 或 for which 引导定语从句。",
    },
    {
      n: 8,
      prompt:
        "小红建了一座包含很多旧书的图书馆。（建立=build[built]，包含=contain，旧的=old[adj.]，图书馆=library）",
      answers: [
        "Xiaohong built a library that contains many old books.",
        "Xiaohong built a library which contains many old books.",
      ],
      explanation:
        "that/which 在从句作主语不可省。",
    },
    {
      n: 9,
      prompt: "杭州是他们所住的城市。（住=live[vi.]，城市=city）",
      answers: [
        "Hangzhou is the city where they live.",
        "Hangzhou is the city in which they live.",
      ],
      explanation:
        "地点名词作先行词，用 where / in which。",
    },
    {
      n: 10,
      prompt:
        "我认识一位在体育馆工作的清洁工。（认识=know，工作=work[vi.]，体育馆=stadium，清洁工=cleaner）",
      answers: [
        "I know a cleaner who works in this stadium.",
        "I know a cleaner that works in this stadium.",
      ],
      explanation:
        "who/that 在从句作主语。",
    },
    {
      n: 11,
      prompt:
        "他住在一栋窗户朝南的大厦里。（窗户=window，朝向=face[vt.]，南面=south，大厦=mansion）",
      answers: ["He lives in a mansion whose windows face south."],
      explanation:
        "whose 表所属，whose windows。",
    },
    {
      n: 12,
      prompt: "那个正在说话的女孩是谁？（说话=talk）",
      answers: [
        "Who is the girl that is talking?",
        "Who is the girl who is talking?",
      ],
      explanation:
        "Who 问主身份，后接定语从句修饰 girl。",
    },
    {
      n: 13,
      prompt:
        "这间卧室就是他拍照的地方。（卧室=bedroom，拍照=take photos，地方=place）",
      answers: [
        "This bedroom is the place where he takes photos.",
        "This bedroom is the place in which he takes photos.",
      ],
      explanation:
        "place 作先行词，where / in which。",
    },
    {
      n: 14,
      prompt:
        "这位教授就是发明灯泡的科学家。（教授=professor，发明=invent[vt.]，灯泡=bulb，科学家=scientist）",
      answers: [
        "This professor is the scientist who invented the bulb.",
        "This professor is the scientist who invented the bulbs.",
      ],
      explanation:
        "who 在从句作主语。",
    },
    {
      n: 15,
      prompt:
        "我已经下载了一个能翻译十种语言的 APP。（下载=download，翻译=translate，语言=language）",
      answers: [
        "I have downloaded an app which can translate ten languages.",
        "I have downloaded an app that can translate ten languages.",
        "I have downloaded an APP which can translate ten languages.",
      ],
      explanation:
        "which/that 在从句作主语。",
    },
    {
      n: 16,
      prompt:
        "这个解释宇宙的理论是错的。（解释=explain[vt.]，宇宙=universe，理论=theory，错误的=wrong[adj.]）",
      answers: [
        "This theory that explains the universe is wrong.",
        "This theory which explains the universe is wrong.",
      ],
      explanation:
        "that/which 指 theory，在从句作主语。",
    },
    {
      n: 17,
      prompt:
        "那些正在教室里喊叫的孩子们非常生气。（教室=classroom，喊叫=shout[vi.]，孩子=kid，生气=angry[adj.]）",
      answers: [
        "Those kids who are shouting in the classroom are very angry.",
        "Those kids that are shouting in the classroom are very angry.",
      ],
      explanation:
        "who/that 在从句作主语。",
    },
    {
      n: 18,
      prompt: "那些并不是我所相信的概念。（相信=believe[vt.]，概念=concept）",
      answers: [
        "Those are not the concepts I believe.",
        "Those are not the concepts that I believe.",
        "Those are not the concepts which I believe.",
      ],
      explanation:
        "believe 的宾语为 concepts，关系代词可省略。",
    },
    {
      n: 19,
      prompt: "我怀念我们上学的那几个月。（怀念=miss[vt.]，日月年=month）",
      answers: [
        "I miss those months when we went to school.",
        "I miss those months in which we went to school.",
      ],
      explanation:
        "时间先行词 months 用 when / in which。",
    },
    {
      n: 20,
      prompt:
        "我们第一次见面的时刻已成为我永恒的记忆。（第一次=first[adv.]，见面=meet[met]，时刻=moment，成为=become，永恒的=eternal，记忆=memory）",
      answers: [
        "The moment we first met has become my eternal memory.",
        "The moment when we first met has become my eternal memory.",
        "The moment at which we first met has become my eternal memory.",
      ],
      explanation:
        "moment 作先行词，定语从句可用 when/at which/省略。",
    },
  ],
}
