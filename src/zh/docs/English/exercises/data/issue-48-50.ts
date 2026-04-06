import type { ExerciseIssue } from "./types"

export const issue4850: ExerciseIssue = {
  id: "issue-48-50",
  menuTitle: "第48–50期 · 虚拟语气",
  title: "第48–50期：虚拟语气",
  subtitle: "if / wish / 倒装 Had… / But for / Without",
  items: [
    {
      n: 1,
      prompt: "如果我是你，我会接受这份工作邀请。",
      answers: ["If I were you, I would accept the job offer."],
      explanation: "If I were you；主句 would。",
    },
    {
      n: 2,
      prompt: "她要是有更多时间，她就能学一门新语言了。",
      answers: [
        "If she had more time, she could learn a new language.",
      ],
      explanation: "与现在事实相反：had / could。",
    },
    {
      n: 3,
      prompt: "如果现在不下雨，我们或许会去散步。（或许=may/might）",
      answers: [
        "If it weren't raining, we might go for a walk.",
        "If it wasn't raining, we might go for a walk.",
      ],
      explanation: "与现在相反：weren't raining（正式用 were）。",
    },
    {
      n: 4,
      prompt: "如果我们住在海滩附近就好了，那样我们就能每天去游泳。",
      answers: [
        "If we lived near the beach, we could go swimming every day.",
      ],
      explanation: "lived / could。",
    },
    {
      n: 5,
      prompt: "如果他有一辆车就好了，那样他就会开车送我们去机场。",
      answers: [
        "If he had a car, he would drive us to the airport.",
      ],
      explanation: "had / would drive。",
    },
    {
      n: 6,
      prompt: "我真希望我知道怎么弹吉他。（希望=wish，弹吉他=play the guitar）",
      answers: ["I wish I knew how to play the guitar."],
      explanation: "wish 后宾从用过去式表虚拟。",
    },
    {
      n: 7,
      prompt: "他们希望他们能买得起一辆新车。",
      answers: ["They wish they could afford a new car."],
      explanation: "wish + could。",
    },
    {
      n: 8,
      prompt: "如果她早点去看医生，她就能更快康复了。",
      answers: [
        "If she had gone to the doctor earlier, she could have recovered sooner.",
      ],
      explanation: "与过去相反：had gone / could have recovered。",
    },
    {
      n: 9,
      prompt:
        "如果昨天雨没下那么大，我们或许就去徒步旅行了。（此题用倒装结构省略 if）",
      answers: [
        "Had it not rained so heavily yesterday, we might have gone hiking.",
      ],
      explanation: "Had it not rained = If it had not rained。",
    },
    {
      n: 10,
      prompt: "如果他那时听了我的建议，他就会避免这个错误了。",
      answers: [
        "If he had taken my advice, he would have avoided the mistake.",
      ],
      explanation: "had taken / would have avoided。",
    },
    {
      n: 11,
      prompt: "我们本来可以赶上这趟火车的。",
      answers: ["We could have caught the train."],
      explanation: "could have done 表过去本可以。",
    },
    {
      n: 12,
      prompt: "她在比赛中本应该表现得更好。（更好=better）",
      answers: [
        "She could have performed better in the contest.",
        "She could have performed better in the competition.",
      ],
      explanation: "could have performed。",
    },
    {
      n: 13,
      prompt:
        "要不是因为交通堵塞，我们或许就能按时到达了。（此题用倒装结构）",
      answers: [
        "Had it not been for the traffic jam, we might have arrived on time.",
      ],
      explanation: "Had it not been for = If it hadn't been for。",
    },
    {
      n: 14,
      prompt: "如果明天真要下雪的话，我们就待在家里。",
      answers: [
        "If it were to snow tomorrow, we would stay at home.",
      ],
      explanation: "were to snow 表将来虚拟。",
    },
    {
      n: 15,
      prompt: "如果她明天真要考试不及格，那她下个月可以再考一次。（用倒装）",
      answers: [
        "Should she fail the exam, she could take it again next month.",
      ],
      explanation: "Should she fail = If she should fail。",
    },
    {
      n: 16,
      prompt: "如果我上次听了你的建议，我现在的处境就会更好。",
      answers: [
        "If I had followed your advice last time, I would be in a better situation now.",
      ],
      explanation: "错综时间：从句过去，主句现在 would be。",
    },
    {
      n: 17,
      prompt: "如果他在年轻时更加努力地工作，那他现在就会更加成功。",
      answers: [
        "If he had worked harder when he was young, he would be more successful now.",
      ],
      explanation: "when he was young 为真实过去，不需虚拟。",
    },
    {
      n: 18,
      prompt: "没有你的帮助，我不可能按时完成这个项目。",
      answers: [
        "Without your help, I couldn't have finished the project on time.",
      ],
      explanation: "Without… 暗示与过去事实相反。",
    },
    {
      n: 19,
      prompt: "他昨天生病了；否则他就能按时参加会议了。（否则=otherwise）",
      answers: [
        "He was ill yesterday; otherwise, he would have attended the meeting.",
        "He was sick yesterday; otherwise, he would have attended the meeting.",
      ],
      explanation: "前句真实；otherwise 后虚拟过去。",
    },
    {
      n: 20,
      prompt: "要不是你的鼓励，我可能早就放弃了。（要不是=But for）",
      answers: ["But for your encouragement, I might have given up."],
      explanation: "But for + 名词 → 虚拟主句 might have done。",
    },
  ],
}
