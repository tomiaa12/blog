import type { ExerciseIssue } from "./types"

export const issue19: ExerciseIssue = {
  id: "issue-19",
  menuTitle: "第19期 · 宾语从句",
  title: "第19期：宾语从句",
  subtitle: "that / whether(if) / wh- + 陈述语序",
  items: [
    {
      n: 1,
      prompt: "我想知道他什么时候回来。（想知道=want to know，回=back，来=come）",
      answers: [
        "I want to know when he will come back.",
        "I want to know when he comes back.",
      ],
      explanation:
        "when 引导宾从；可用主将从现 when he comes back。",
    },
    {
      n: 2,
      prompt: "他相信我们能赢得比赛。（相信=believe，赢得=win，比赛=match/competition）",
      answers: [
        "He believes we can win this match.",
        "He believes we can win this competition.",
      ],
      explanation:
        "陈述宾从 that 可省：He believes (that) we can win…",
    },
    {
      n: 3,
      prompt: "她说她那时候正在做面条。（说=say，那时候=then，做=make，面条=noodles）",
      answers: ["She said she was making noodles then."],
      explanation:
        "主过从过：was making；then 放句末。",
    },
    {
      n: 4,
      prompt:
        "我想知道科学是否能改变宇宙。（想知道=wonder，科学=science，改变=change，宇宙=universe）",
      answers: [
        "I wonder whether science can change the universe.",
        "I wonder if science can change the universe.",
      ],
      explanation:
        "whether/if 表是否。",
    },
    {
      n: 5,
      prompt:
        "她问我为什么不准时参加面试。（问=ask，准时=on time，参加=attend，面试=interview）",
      answers: ["She asked me why I didn't attend the interview on time."],
      explanation:
        "why 引导宾从；叙述过去用 didn't。",
    },
    {
      n: 6,
      prompt:
        "她告诉我她后天要飞往伦敦。（飞=fly，伦敦=London，后天=the day after tomorrow）",
      answers: [
        "She tells me she will fly to London the day after tomorrow.",
        "She told me she would fly to London the day after tomorrow.",
      ],
      explanation:
        "宾从时态与主句一致；tell 现/过均可。",
    },
    {
      n: 7,
      prompt: "她解释说她没时间。（解释=explain，时间=time）",
      answers: [
        "She explains that she doesn't have time.",
        "She explained that she didn't have time.",
      ],
      explanation:
        "have 表“有”为实义动词，否定用 don't/doesn't。",
    },
    {
      n: 8,
      prompt: "没人意识到他已经死了。（意识到=realize，死=die）",
      answers: [
        "Nobody realized that he had died.",
        "Nobody realizes that he has died.",
      ],
      explanation:
        "主过从过完成 had died；主现从现完 has died。",
    },
    {
      n: 9,
      prompt: "我听说他生病了。（听说=hear，生病=ill）",
      answers: [
        "I heard he was ill.",
        "I heard that he was ill.",
      ],
      explanation:
        "that 可省；听说用过去时常见。",
    },
    {
      n: 10,
      prompt:
        "他认为努力工作会带来成功。（认为=think，努力=hard，工作=work，带来=bring/lead to，成功=success）",
      answers: [
        "He thinks hard work will lead to success.",
        "He thought hard work would lead to success.",
        "He thinks working hard will lead to success.",
      ],
      explanation:
        "宾从 that 可省；will/would 随主句。",
    },
    {
      n: 11,
      prompt: "我怀疑他是否在说实话。（怀疑=doubt，说实话=tell the truth）",
      answers: [
        "I doubt if he is telling the truth.",
        "I doubt whether he is telling the truth.",
      ],
      explanation:
        "if/whether 表是否；进行时更有画面感。",
    },
    {
      n: 12,
      prompt:
        "他们确认小明会按时到达。（确认=confirm，按时=on time，到达=arrive）",
      answers: [
        "They confirmed that Xiaoming would arrive on time.",
        "They confirmed that Xiaoming would be present on time.",
      ],
      explanation:
        "主句过去时，从句常用 would。",
    },
    {
      n: 13,
      prompt: "她说她正在考虑辞职。（考虑=consider，辞职=resigning）",
      answers: ["She said she was considering resigning."],
      explanation:
        "said + 过去进行 was considering。",
    },
    {
      n: 14,
      prompt:
        "小明想知道他是否会接受邀请。（接受=accept，邀请=invitation）",
      answers: [
        "Xiaoming wonders whether he will accept the invitation.",
        "Xiaoming wonders if he will accept the invitation.",
      ],
      explanation:
        "invitation 名词作宾语。",
    },
    {
      n: 15,
      prompt:
        "我不相信他要去国外留学。（相信=believe，学习=study，在国外=abroad）",
      answers: [
        "I don't believe that he will study abroad.",
        "I don't believe he will study abroad.",
      ],
      explanation:
        "study abroad；that 可省。",
    },
    {
      n: 16,
      prompt:
        "所有人都声称小红会克服这个困难。（声称=claim，克服=overcome，困难=difficulty/problem/issue）",
      answers: [
        "Everyone claims Xiaoming will overcome the difficulty.",
        "Everyone claims that Xiaoming will overcome the difficulty.",
      ],
      explanation:
        "everyone 单三→claims；that 可省。",
    },
    {
      n: 17,
      prompt:
        "他提议小强应该选择这个专业。（提议=propose，应该=should，选择=choose，专业=major）",
      answers: ["He proposes that Xiaoqiang should choose this major."],
      explanation:
        "propose that + should + 原形。",
    },
    {
      n: 18,
      prompt:
        "他们问我们喜欢哪些户外活动。（户外的=outdoor，活动=activity）",
      answers: ["They asked us which outdoor activities we like."],
      explanation:
        "which outdoor activities 与宾语连写，后接陈述语序。",
    },
    {
      n: 19,
      prompt:
        "我想知道我如何获取更多的工资。（获取=obtain，更多的=more，工资=salary）",
      answers: [
        "I want to know how I obtain more salary.",
        "I want to know how to obtain more salary.",
      ],
      explanation:
        "疑问词+to do 可作宾语简略式。",
    },
    {
      n: 20,
      prompt:
        "他们确认经理会提供必要的资源去建立研究机构。（确认=confirm，经理=manager，提供=provide，必要的=necessary，资源=resources，建立=establish，研究=research，机构=institution/organization）",
      answers: [
        "They confirmed that the manager will provide necessary resources to establish the research institution.",
        "They confirmed that the manager would provide necessary resources to establish the research institution.",
      ],
      explanation:
        "to establish 表目的；时态随 confirmed。",
    },
  ],
}
