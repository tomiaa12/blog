import type { ExerciseIssue } from "./types"

export const issue2324: ExerciseIssue = {
  id: "issue-23-24",
  menuTitle: "第23–24期 · 系动词与表从",
  title: "第23–24期：（连）系动词 + 表语从句",
  subtitle: "prove/feel/look/sound/seem/remain + that/why…",
  items: [
    {
      n: 1,
      prompt:
        "此成员已被证明极其出色。（成员=member，证明=prove[系]，极其=extremely，出色的=excellent）",
      answers: [
        "This member has proved very excellent.",
        "This member has proven very excellent.",
      ],
      explanation:
        "prove 作系动词常用主动形式表被动意义。",
    },
    {
      n: 2,
      prompt:
        "问题是他为啥保持沉默。（问题=question，保持=remain[系]，沉默=silent）",
      answers: ["The question is why he remains silent."],
      explanation:
        "why 引导表语从句；remain + 形容词。",
    },
    {
      n: 3,
      prompt: "这条毯子摸起来很柔软。（毯子=blanket，摸起来=feel[系]，柔软的=soft）",
      answers: ["This blanket feels so soft."],
      explanation:
        "feel 系动词 + 形容词。",
    },
    {
      n: 4,
      prompt:
        "这食物看起来很有食欲。（食物=food，看起来=look[系]，引发食欲的=appetizing）",
      answers: ["The food looks very appetizing."],
      explanation:
        "look + appetizing。",
    },
    {
      n: 5,
      prompt:
        "他的建议是，我们应该寻求专业帮助。（建议=suggestion，应该=should，寻求=seek，专业的=professional，帮助=help）",
      answers: ["His suggestion is that we should seek professional help."],
      explanation:
        "that 引导表语从句不可省。",
    },
    {
      n: 6,
      prompt:
        "我的感觉是，我们好像迷路了。（感觉=feeling，好像=seem[系]，迷路的=lost）",
      answers: ["My feeling is that we seem lost."],
      explanation:
        "that 表语从句；seem lost。",
    },
    {
      n: 7,
      prompt:
        "这位学者最终证明是一个蠢人。（学者=scholar，最终证明是=turn out[系]，愚蠢的=silly/foolish，人=person）",
      answers: [
        "The scholar turns out to be a silly person.",
        "The scholar turns out foolish.",
      ],
      explanation:
        "turn out to be + 名词，或直接接形容词。",
    },
    {
      n: 8,
      prompt:
        "她的希望是，她能学会弹钢琴。（希望=hope，学会=learn，弹钢琴=play the piano）",
      answers: ["Her hope is that she can learn to play the piano."],
      explanation:
        "that 表语从句。",
    },
    {
      n: 9,
      prompt:
        "他的信念是，诚实是最好的策略。（信念=belief，诚实=honesty，最好的=best，策略=strategy）",
      answers: ["His belief is that honesty is the best policy."],
      explanation:
        "honesty is the best policy。",
    },
    {
      n: 10,
      prompt:
        "我的愿望是，我能成为一名宇航员。（愿望=wish，成为=become[系]，宇航员=astronaut）",
      answers: ["My wish is that I can become an astronaut."],
      explanation:
        "that 表语从句。",
    },
    {
      n: 11,
      prompt:
        "这条溪流在我眼里看起来很长。（溪流=stream，看起来=look[系]，长的=long，在我眼里=in my eyes）",
      answers: ["The stream looks very long in my eyes."],
      explanation:
        "look long；in my eyes 状语。",
    },
    {
      n: 12,
      prompt:
        "那首音乐听起来非常宁静且美妙。（听起来=sound[系]，宁静的=peaceful，美妙的=wonderful）",
      answers: ["That music sounds so peaceful and wonderful."],
      explanation:
        "sound + 形容词。",
    },
    {
      n: 13,
      prompt:
        "这条水沟闻起来像是一双臭袜子。（水沟=ditch，闻起来=smell[系]，好像是=like[介]，一双=a pair of，臭的=smelly，袜子=sock）",
      answers: ["This ditch smells like a pair of smelly socks."],
      explanation:
        "smell like + 名词；like 作介词。",
    },
    {
      n: 14,
      prompt:
        "那些歌曲感觉好像能治愈心灵。（歌曲=song，感觉=feel[系]，好像=like[连]，治愈=heal，心灵=soul）",
      answers: ["Those songs feel like they can heal the soul."],
      explanation:
        "like 作连词后接完整句。",
    },
    {
      n: 15,
      prompt:
        "小红被证明是个有才华的艺术家。（证明=prove[系]，有才华的=talented，艺术家=artist）",
      answers: [
        "Xiaohong proves a talented artist.",
        "Xiaohong proves to be a talented artist.",
      ],
      explanation:
        "prove 系动词接名词作表语。",
    },
    {
      n: 16,
      prompt:
        "这天气感觉像是秋天。（天气=weather，秋天=autumn）",
      answers: ["The weather feels like autumn."],
      explanation:
        "feel like + 名词。",
    },
    {
      n: 17,
      prompt:
        "这些胆小的老鼠似乎是可爱的宠物。（胆小的=cowardly，老鼠=mouse 复数 mice，似乎是=seem[系]，可爱的=lovely，宠物=pet）",
      answers: [
        "These cowardly mice seem to be lovely pets.",
        "These cowardly mice seem lovely pets.",
      ],
      explanation:
        "seem (to be) + 名词。",
    },
    {
      n: 18,
      prompt:
        "我的想法是，我们应该平衡收入与支出。（想法=idea，平衡=balance，收入=income，支出=expense）",
      answers: ["My idea is that we should balance income and expense."],
      explanation:
        "that 表语从句。",
    },
    {
      n: 19,
      prompt:
        "事实是，这个秘密已经泄露了。（事实=fact，秘密=secret，泄露=leak）",
      answers: ["The fact is that this secret has been leaked."],
      explanation:
        "完成被动 has been leaked。",
    },
    {
      n: 20,
      prompt:
        "这份新证据显得非常有说服力。（证据=evidence，显得=appear[系]，有说服力的=convincing）",
      answers: [
        "This new evidence appears very convincing.",
        "This new evidence appears to be very convincing.",
      ],
      explanation:
        "appear + 形容词或 to be。",
    },
  ],
}
