import type { ExerciseIssue } from "./types"

export const issue20: ExerciseIssue = {
  id: "issue-20",
  menuTitle: "第20期 · 主语从句",
  title: "第20期：主语从句、形式主语 it",
  subtitle: "What/Whether/That…；It is … to do / that…",
  items: [
    {
      n: 1,
      prompt: "我听说的事情是假的。（听说=hear，假的=false）",
      answers: ["What I heard is false."],
      explanation:
        "What 引导主从=“所…的事情”。",
    },
    {
      n: 2,
      prompt: "它是否会呼吸仍然是个问题。（呼吸=breathe，仍然=still，问题=question）",
      answers: [
        "Whether it can breathe is still a question.",
        "It is still a question whether it can breathe.",
      ],
      explanation:
        "Whether 表是否；可用形式主语 it。",
    },
    {
      n: 3,
      prompt:
        "是否要拒绝这个提议取决于你。（拒绝=refuse，提议=proposal，取决于=depend on）",
      answers: [
        "It depends on you whether to refuse this proposal.",
        "Whether to refuse this proposal depends on you.",
      ],
      explanation:
        "疑问词+to do 作主语；depend on you。",
    },
    {
      n: 4,
      prompt:
        "他在池塘边所说的话让我很高兴。（使……高兴=delight，池塘=pool，在……边=beside/by）",
      answers: [
        "What he said by the pool delights me.",
        "What he said beside the pool delights me.",
      ],
      explanation:
        "What he said 作主语。",
    },
    {
      n: 5,
      prompt:
        "小明如何保持健康的生活方式仍然是未知的。（保持=maintain/keep，健康的=healthy，生活方式=lifestyle，未知的=unknown）",
      answers: [
        "It is still unknown how Xiaoming maintains his healthy lifestyle.",
        "How Xiaoming maintains his healthy lifestyle is still unknown.",
      ],
      explanation:
        "how 引导主从；形式主语 it 常见。",
    },
    {
      n: 6,
      prompt:
        "这位神秘男子的身份已成为聚焦点。（神秘的=mysterious，男子=man，成为=become，聚焦点=focal point）",
      answers: ["Who this mysterious man is has become a focal point."],
      explanation:
        "身份→who 引导主从，陈述语序。",
    },
    {
      n: 7,
      prompt:
        "这艘船被修理的地点已成为调查中的一个关键细节。（修理=repair，船=ship，调查=investigation，关键的=key，细节=detail）",
      answers: [
        "Where this ship was repaired had become a key detail in this investigation.",
        "Where this ship was repaired has become a key detail in this investigation.",
      ],
      explanation:
        "where 引导主从。",
    },
    {
      n: 8,
      prompt: "他为什么被开除仍然是个谜。（开除=fire，谜=mystery）",
      answers: [
        "It remains a mystery why he was fired.",
        "Why he was fired remains a mystery.",
      ],
      explanation:
        "why 引导主从。",
    },
    {
      n: 9,
      prompt:
        "“他不喜欢这个计划”是很明显的。（计划=plan/scheme，明显的=obvious）",
      answers: [
        "It is obvious that he doesn't like this scheme.",
        "That he doesn't like this scheme is obvious.",
      ],
      explanation:
        "that 引导主从表陈述，that 不可省（主语从句）。",
    },
    {
      n: 10,
      prompt:
        "在训练中保持热情很重要。（保持=maintain，热情=enthusiasm，训练=training，重要的=important）",
      answers: [
        "It is important to maintain the enthusiasm in the training.",
        "To maintain the enthusiasm in the training is important.",
      ],
      explanation:
        "不定式作主语，常用 it 作形式主语。",
    },
    {
      n: 11,
      prompt:
        "小明在教堂里做的事情把我吓到了。（教堂=church，吓=scare）",
      answers: ["What Xiaoming did in the church scared me."],
      explanation:
        "What…did 作主语。",
    },
    {
      n: 12,
      prompt:
        "我们是否应该提升预算仍需讨论。（应该=should，提升=increase，预算=budget，需要=require，讨论=discussion）",
      answers: [
        "It still requires discussion whether we should increase the budget.",
        "Whether we should increase the budget still requires discussion.",
      ],
      explanation:
        "whether 主从；require discussion。",
    },
    {
      n: 13,
      prompt:
        "是否投资这个行业还不确定。（投资=invest in，行业=industry，不确定的=uncertain）",
      answers: [
        "It is uncertain whether to invest in this industry.",
        "Whether to invest in this industry is uncertain.",
      ],
      explanation:
        "whether to do 作主语。",
    },
    {
      n: 14,
      prompt:
        "我们追求的是全面的发展。（追求=pursue，全面的=all-round/comprehensive，发展=development）",
      answers: [
        "What we pursue is all-round development.",
        "What we pursue is comprehensive development.",
      ],
      explanation:
        "What we pursue 作主语。",
    },
    {
      n: 15,
      prompt:
        "何时继续这项检查需要进一步探讨。（继续=continue，检查=inspection，需要=need，探讨=exploration，进一步的=further）",
      answers: ["When to continue this inspection needs further exploration."],
      explanation:
        "When to do 作主语。",
    },
    {
      n: 16,
      prompt:
        "培养创新能力是一项艰巨的挑战。（培养=cultivate，创新=innovation，能力=ability，艰巨的=tough，挑战=challenge）",
      answers: [
        "It is a tough challenge to cultivate innovation ability.",
        "To cultivate innovation ability is a tough challenge.",
      ],
      explanation:
        "it 作形式主语 + to cultivate…",
    },
    {
      n: 17,
      prompt:
        "我们希望的是拥有更多的国际贸易。（希望=hope，更多的=more，国际的=international，贸易=trade）",
      answers: ["What we hope is having more international trade."],
      explanation:
        "表语用 doing 表持续状态。",
    },
    {
      n: 18,
      prompt:
        "这些材料的归属已经被确认。（材料=material，确认=confirm）",
      answers: ["Whose materials these are has been confirmed."],
      explanation:
        "Whose…陈述语序；主从表单三 has been confirmed。",
    },
    {
      n: 19,
      prompt:
        "降低成本并非我们的期望。（降低=decrease，成本=cost，期望=expectation）",
      answers: [
        "It is not our expectation to decrease the cost.",
        "To decrease the cost is not our expectation.",
      ],
      explanation:
        "不定式作主语。",
    },
    {
      n: 20,
      prompt:
        "他在哪儿收集这些硬币并不是我所关心的事情。（收集=collect，硬币=coin，关心=care about）",
      answers: [
        "Where he collected these coins is not what I care about.",
        "Where he collected these coins is not my concern.",
      ],
      explanation:
        "where 主从 + what 表语从句。",
    },
  ],
}
