import type { ExerciseIssue } from "./types"

export const issue3234: ExerciseIssue = {
  id: "issue-32-34",
  menuTitle: "第32–34期 · 介短定语",
  title: "第32–34期：介词短语作定语",
  subtitle: "on / from / over / near / against / to / without / below / except / for",
  items: [
    {
      n: 1,
      prompt: "这张桌上的苹果是红色的。",
      answers: ["The apple on the table is red."],
      explanation: "on the table 后置修饰 apple。",
    },
    {
      n: 2,
      prompt:
        "我们继续这次新政策的讨论。（继续=continue，讨论=discussion，关于=on/about/over，政策=policy）",
      answers: [
        "We continue the discussion over this new policy.",
        "We continue the discussion on this new policy.",
        "We continue the discussion about this new policy.",
      ],
      explanation: "名词 discussion 作宾语，over/on/about 引出话题。",
    },
    {
      n: 3,
      prompt:
        "这座房子外面的家伙偷了我的纸巾。（家伙=guy，偷=steal，纸巾=tissue）",
      answers: ["The guy outside the house stole my tissue."],
      explanation: "outside the house 修饰 guy。",
    },
    {
      n: 4,
      prompt: "来自那家机构的消息是假的。（机构=institution，消息=news，假的=false）",
      answers: ["The news from that institution is false."],
      explanation: "from that institution 修饰 news。",
    },
    {
      n: 5,
      prompt:
        "因过度劳累引发的疾病需要一次长时间的休息。（疾病=illness，过度劳累=overwork，休息=rest，长时间的=long-time）",
      answers: ["The illness from overwork requires a long-time rest."],
      explanation: "from overwork 表来源/原因，修饰 illness。",
    },
    {
      n: 6,
      prompt:
        "今年，高于平均水平的降雨量十分常见。（降雨量=rainfall，高于=above，平均=average，水平=level，常见=common）",
      answers: [
        "This year, the rainfall above average level is very common.",
        "The rainfall above average level is very common this year.",
      ],
      explanation: "above average level 修饰 rainfall；this year 可句首或句末。",
    },
    {
      n: 7,
      prompt:
        "对这份签证的申请被拒绝了。（申请=application，签证=visa，拒绝=refuse）",
      answers: [
        "The application for this visa is refused.",
        "The application for this visa has been refused.",
      ],
      explanation: "application for this visa；被动 is refused / has been refused。",
    },
    {
      n: 8,
      prompt:
        "我不认识这位在那艘小船附近的女士。（认识=know，女士=lady，小船=boat，在附近=near）",
      answers: ["I don't know that lady near that boat."],
      explanation: "near that boat 修饰 lady。",
    },
    {
      n: 9,
      prompt:
        "反对新政策的争论得到了许多支持。（争论=argument，反对=against，得到=receive/get，支持=support）",
      answers: [
        "The argument against the new policy received a lot of support.",
        "The argument against the new policy got a lot of support.",
      ],
      explanation: "against the new policy 修饰 argument。",
    },
    {
      n: 10,
      prompt:
        "小明告诉了我去那家杂货铺的路。（告诉=tell，路=way，杂货铺=department store，朝向=to）",
      answers: ["Xiaoming told me the way to that department store."],
      explanation: "the way to … 表“去……的路”。",
    },
    {
      n: 11,
      prompt:
        "我一点都不喜欢像你这样的人。（一点都不=at all，像=like，人=people）",
      answers: ["I don't like people like you at all."],
      explanation: "people like you；at all 加强否定。",
    },
    {
      n: 12,
      prompt: "没有灯的世界是黑暗的。（灯=lamp，没有=without，世界=world，黑暗的=dark）",
      answers: ["The world without lamps is dark."],
      explanation: "without lamps 修饰 world。",
    },
    {
      n: 13,
      prompt:
        "地面下方的系统被严重破坏了。（地面=ground，下方=below，系统=system，严重地=seriously，破坏=destroy）",
      answers: [
        "The system below the ground is seriously broken.",
        "The system below the ground has been seriously destroyed.",
      ],
      explanation: "below the ground；broken/destroyed 表被破坏。",
    },
    {
      n: 14,
      prompt:
        "我无法忍受那个手上拿着锤子的男人！（忍受=stand，锤子=hammer，手=hand，拿着=with）",
      answers: [
        "I can't stand that man with a hammer in his hand!",
        "I cannot stand that man with a hammer in his hand!",
      ],
      explanation: "with a hammer in his hand 修饰 man。",
    },
    {
      n: 15,
      prompt: "床底下的红色裤子不是我的。（床=bed，下面=under，裤子=trousers）",
      answers: ["The red trousers under the bed are not mine."],
      explanation: "trousers 复数，谓语用 are；under the bed。",
    },
    {
      n: 16,
      prompt: "除了你以外的所有人都可以吃这个苹果派。（除了=except，苹果派=apple pie）",
      answers: ["Everyone except you can eat this apple pie."],
      explanation: "except you 修饰 everyone。",
    },
    {
      n: 17,
      prompt: "这台电视机的遥控器坏掉了。（遥控器=remote controller，电视机=TV）",
      answers: [
        "The remote controller for this TV is broken.",
        "The remote controller of this TV is broken.",
      ],
      explanation: "for/of this TV 表配套所属。",
    },
    {
      n: 18,
      prompt:
        "这位时尚界的专家其实是个骗子。（时尚界=fashion world，专家=specialist/expert，其实=actually，骗子=deceiver/cheater）",
      answers: [
        "This specialist in the fashion world is actually a deceiver.",
        "This expert in the fashion world is actually a cheater.",
      ],
      explanation: "in the fashion world 表领域。",
    },
    {
      n: 19,
      prompt:
        "这篇来自科学杂志的文章包含大量的文献。（科学=science，杂志=magazine，文章=article，文献=literature）",
      answers: [
        "This article from the science magazine contains a substantial amount of literature.",
      ],
      explanation: "from the science magazine 修饰 article。",
    },
    {
      n: 20,
      prompt:
        "沙子附近的蚂蚁正在搬运那些食物。（沙子=sand，蚂蚁=ant，搬运=carry，食物=food）",
      answers: [
        "The ants near the sand are carrying that food.",
        "The ants near the sand are carrying the food.",
      ],
      explanation: "food 多为不可数；near the sand 修饰 ants。",
    },
  ],
}
