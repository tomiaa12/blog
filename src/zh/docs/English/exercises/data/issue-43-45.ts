import type { ExerciseIssue } from "./types"

export const issue4345: ExerciseIssue = {
  id: "issue-43-45",
  menuTitle: "第43–45期 · 祈使感叹强调",
  title: "第43–45期：祈使句、感叹句与强调句",
  subtitle: "Open… / How… / What… / It is … that/who",
  items: [
    {
      n: 1,
      prompt: "现在就开门！",
      answers: ["Open the door now!", "Now, open the door!"],
      explanation: "祈使句动词原形开头。",
    },
    {
      n: 2,
      prompt: "安静点！",
      answers: ["Be quiet!"],
      explanation: "Be + 形容词。",
    },
    {
      n: 3,
      prompt: "快点，否则你就会迟到了！（赶快=hurry up，否则=or，迟到=late）",
      answers: ["Hurry up, or you will be late!"],
      explanation: "祈使句 + or + 陈述句。",
    },
    {
      n: 4,
      prompt: "关掉电视！（关掉=turn off，电视=TV）",
      answers: ["Turn off the TV!"],
      explanation: "Turn off 祈使。",
    },
    {
      n: 5,
      prompt: "别在图书馆里大声喧哗。（大声喧哗=make noises，图书馆=library）",
      answers: ["Don't make noises in the library."],
      explanation: "Don't + 动词原形。",
    },
    {
      n: 6,
      prompt: "别忘了带上笔记本。（忘记=forget，带上=bring，笔记本=notebook）",
      answers: ["Don't forget to bring your notebook."],
      explanation: "forget to do 表将来要做。",
    },
    {
      n: 7,
      prompt: "是昨天我在公园遇见他的。（强调句；遇见=meet）",
      answers: ["It was yesterday that I met him in the park."],
      explanation: "It was … that … 强调时间状语。",
    },
    {
      n: 8,
      prompt: "正是他解决的这个问题。（强调句；解决=solve）",
      answers: ["It was he who solved this problem."],
      explanation: "强调人 → who。",
    },
    {
      n: 9,
      prompt: "是我在街上看到的那个小偷。（强调句；小偷=thief）",
      answers: ["It was I who saw that thief on the street."],
      explanation: "强调主语 I → who。",
    },
    {
      n: 10,
      prompt:
        "正是这位老师把课讲得很清楚。（讲=explain，课=lesson，清楚地=clearly）",
      answers: ["It is this teacher who explains the lessons clearly."],
      explanation: "强调 this teacher。",
    },
    {
      n: 11,
      prompt:
        "事故发生时，正是她报了警。（事故=accident，发生=occur/happen，报警=call the police）",
      answers: [
        "It was she who called the police when the accident occurred.",
        "It was she who called the police when the accident happened.",
      ],
      explanation: "强调 she；when 时间从句。",
    },
    {
      n: 12,
      prompt:
        "正是这美丽的风景吸引了这么多游客。（风景=scenery，吸引=attract，游客=tourist）",
      answers: ["It is the beautiful scenery that attracts so many tourists."],
      explanation: "强调物 → that；scenery 不可数，谓语 attracts。",
    },
    {
      n: 13,
      prompt: "我永远会记得的正是她的善良。（善良=kindness，永远=forever，记得=remember）",
      answers: ["It is her kindness that I will remember forever."],
      explanation: "强调 her kindness → that。",
    },
    {
      n: 14,
      prompt: "这是多么精彩的表演啊！（精彩的=wonderful，表演=performance）",
      answers: [
        "What a wonderful performance this is!",
        "What a wonderful performance!",
      ],
      explanation: "What + a/an + adj. + 可数名词。",
    },
    {
      n: 15,
      prompt: "这座城市真壮观啊！（壮观=magnificent）",
      answers: ["How magnificent this city is!"],
      explanation: "How + 形容词 + 主谓。",
    },
    {
      n: 16,
      prompt: "你舞跳得真好呀！（好=well，跳舞=dance）",
      answers: ["How well you dance!"],
      explanation: "How + 副词 well。",
    },
    {
      n: 17,
      prompt: "这电影真恐怖呀！（恐怖的=terrifying，电影=movie）",
      answers: [
        "How terrifying this movie is!",
        "How terrifying this film is!",
      ],
      explanation: "How + 形容词。",
    },
    {
      n: 18,
      prompt: "多么可爱的小猫呀！（可爱的=lovely，小猫=kitten）",
      answers: ["What a lovely kitten!"],
      explanation: "What a lovely kitten。",
    },
    {
      n: 19,
      prompt: "多么令人难以忘怀的日落啊！（令人难以忘怀的=unforgettable，日落=sunset）",
      answers: ["What an unforgettable sunset!"],
      explanation: "unforgettable 元音开头 → an。",
    },
    {
      n: 20,
      prompt:
        "听我的，你就能打开这个宝箱。（听=listen to，打开=open，宝箱=treasure chest，连词用 and）",
      answers: ["Listen to me, and you will open this treasure chest."],
      explanation: "祈使句 + and + 将来结果。",
    },
  ],
}
