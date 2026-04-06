import type { ExerciseIssue } from "./types"

export const issue2526: ExerciseIssue = {
  id: "issue-25-26",
  menuTitle: "第25–26期 · 状语从句",
  title: "第25–26期：状语从句（含组合连词）",
  subtitle: "when/if/although/because/before/unless…",
  items: [
    {
      n: 1,
      prompt:
        "当我回家时，我妈已经做好饭了。（回家=go home，母亲=mother，做饭=cook dinner）",
      answers: [
        "When I got home, my mother had cooked dinner.",
        "My mother had cooked dinner when I got home.",
        "When I got home, my mother has cooked dinner.",
      ],
      explanation:
        "got home 为过去点时，主句常用过去完成 had cooked；材料中的 has 与 got 不一致，仍收录以便对照。",
    },
    {
      n: 2,
      prompt:
        "虽然正在下雨，他依然在公园跑步。（下雨=it rains，跑步=run，公园=park）",
      answers: [
        "Although it is raining, he still runs in the park.",
        "Although it rains, he still runs in the park.",
        "He still runs in the park although it rains.",
      ],
      explanation:
        "it 指天气；从句可后置。",
    },
    {
      n: 3,
      prompt: "她一边唱歌，一边跳舞。（唱歌=sing，跳舞=dance）",
      answers: [
        "She dances as she sings.",
        "She sings as she dances.",
      ],
      explanation:
        "as 表同时进行；也可用 while + doing。",
    },
    {
      n: 4,
      prompt:
        "如果我们明天有空，我们就去图书馆。（有空的=free，图书馆=library）",
      answers: [
        "If we are free tomorrow, we will go to the library.",
        "We will go to the library if we are free tomorrow.",
      ],
      explanation:
        "主将从现。",
    },
    {
      n: 5,
      prompt: "除非你道歉，否则我不会原谅你。（道歉=apologize，原谅=forgive）",
      answers: [
        "Unless you apologize, I won't forgive you.",
        "I won't forgive you unless you apologize.",
      ],
      explanation:
        "unless=if not。",
    },
    {
      n: 6,
      prompt: "一旦你做出决定，请通知我。（做出决定=make a decision，请=please，通知=inform）",
      answers: [
        "Please inform me once you make a decision.",
        "Once you make a decision, please inform me.",
      ],
      explanation:
        "once 引导时间状从；可放主句后少逗号。",
    },
    {
      n: 7,
      prompt:
        "尽管天气寒冷，我依然脱下我的衣服。（天气=weather，寒冷的=cold，脱下=take off，衣服=clothes）",
      answers: [
        "I still take off my clothes even if the weather is cold.",
        "Even if the weather is cold, I still take off my clothes.",
      ],
      explanation:
        "even if 表让步。",
    },
    {
      n: 8,
      prompt: "当我在做饭时，电话响了。（做饭=cook，电话=phone，响=ring）",
      answers: [
        "While I was cooking, the phone rang.",
        "When I was cooking, the phone rang.",
      ],
      explanation:
        "while 常接延续性动作。",
    },
    {
      n: 9,
      prompt: "他没去上学，因为他生病了。（生病的=ill）",
      answers: [
        "Because he was ill, he didn't go to school.",
        "He didn't go to school because he was ill.",
      ],
      explanation:
        "because 表原因；从句可后置。",
    },
    {
      n: 10,
      prompt:
        "在我预订机票之前，你不能离开机场。（预订=book，机票=flight ticket，离开=leave，机场=airport）",
      answers: [
        "Before I book a flight ticket, you cannot leave the airport.",
        "You cannot leave the airport before I book a flight ticket.",
      ],
      explanation:
        "before 引导时间状从。",
    },
    {
      n: 11,
      prompt:
        "如果你想成功，就必须付出努力。（成功=succeed，必须=must，付出努力=put in efforts）",
      answers: [
        "If you want to succeed, you must put in efforts.",
        "You must put in efforts if you want to succeed.",
      ],
      explanation:
        "want to succeed；put in efforts。",
    },
    {
      n: 12,
      prompt:
        "除非你亲自尝试，否则无法理解它的真正乐趣。（尝试=try，亲自=personally，理解=understand，乐趣=fun）",
      answers: [
        "You can't understand its true fun unless you try personally.",
        "Unless you try personally, you can't understand its true fun.",
      ],
      explanation:
        "unless。",
    },
    {
      n: 13,
      prompt:
        "当我在草原散步时，我看到一只小狗在追一只蝴蝶。（草地=meadow，散步=walk，小狗=puppy，追逐=chase，蝴蝶=butterfly）",
      answers: [
        "When I walk on the meadow, I see a puppy chasing a butterfly.",
      ],
      explanation:
        "see…doing 表正在追。",
    },
    {
      n: 14,
      prompt:
        "虽然他已经很累了，但他依然打得我很重。（累的=tired，打=hit，重重地=hard）",
      answers: ["He hit me so hard though he was very tired."],
      explanation:
        "though/although 让步。",
    },
    {
      n: 15,
      prompt:
        "在她思考三分钟后，她确认门已经锁好，且窗户已经关好。（思考=think，确认=confirm，锁=lock，关=close）",
      answers: [
        "After she thought for three minutes, she confirmed that the door was locked and the windows were closed.",
      ],
      explanation:
        "after + 过去时；confirm 后 that 宾从。",
    },
    {
      n: 16,
      prompt:
        "由于他鼓励我，我终于克服了恐惧。（鼓励=encourage，终于=finally，克服=overcome，恐惧=fear）",
      answers: [
        "I finally overcame my fear as he encouraged me.",
        "I finally overcame my fear because he encouraged me.",
      ],
      explanation:
        "as 语气较弱；because 更强。",
    },
    {
      n: 17,
      prompt:
        "自从我养了猫，我就发现生活变得很有趣。（养=keep/raise，发现=find，生活=life，变得=become，有趣的=interesting）",
      answers: [
        "Since I kept a cat, I have found that my life has become so interesting.",
      ],
      explanation:
        "since 自从，主句常用现在完成。",
    },
    {
      n: 18,
      prompt:
        "既然你已经意识到重要性，那就应该做好它。（意识到=realize，应该=should，重要性=significance，好地=well）",
      answers: [
        "Now that you realize the significance, you should do it well.",
        "Since you realize the significance, you should do it well.",
      ],
      explanation:
        "now that / since 表“既然”。",
    },
    {
      n: 19,
      prompt:
        "虽然他很成功，但他仍然保持谦虚。（成功的=successful，保持=remain[系]，谦虚的=humble）",
      answers: ["He still remained humble though he was successful."],
      explanation:
        "though + 从句。",
    },
    {
      n: 20,
      prompt:
        "终场的哨子一吹响，筋疲力尽的球员们就瘫倒在地了。（终场的=final，哨子=whistle，吹响=blow，筋疲力尽的=exhausted，球员=player，瘫倒=collapse，地面=ground）",
      answers: [
        "As soon as the final whistle blew, the exhausted players collapsed to the ground.",
        "As soon as the final whistle was blown, the exhausted players collapsed to the ground.",
      ],
      explanation:
        "as soon as；blow 可用主动或被动表哨响。",
    },
  ],
}
