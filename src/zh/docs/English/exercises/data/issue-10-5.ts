import type { ExerciseIssue } from "./types"

export const issue105: ExerciseIssue = {
  id: "issue-10-5",
  menuTitle: "第10.5期 · 否定句",
  title: "第10.5期（补档）：否定句的底层逻辑",
  subtitle: "do not / be not / 完成时否定 / 情态否定",
  items: [
    {
      n: 1,
      prompt: "我不喜欢咖啡（咖啡=coffee）",
      answers: [
        "I don't like coffee.",
        "I do not like coffee.",
        "I didn't like coffee.",
      ],
      explanation:
        "实义动词否定加助动词 do + not；时间未限定 don't/didn't 皆可。",
    },
    {
      n: 2,
      prompt: "她不吃猪肉（吃=eat[vt.]，猪肉=pork（不可数））",
      answers: [
        "She doesn't eat pork.",
        "She does not eat pork.",
        "She didn't eat pork.",
      ],
      explanation:
        "单三用 doesn't；表习惯介绍常用一般现在时。",
    },
    {
      n: 3,
      prompt: "我们没有木头（拥有=have[vt.]，木头=wood（不可数））",
      answers: [
        "We don't have wood.",
        "We do not have wood.",
        "We didn't have wood.",
      ],
      explanation:
        "此处 have 为实义动词“拥有”，非完成时助动词。",
    },
    {
      n: 4,
      prompt: "他们昨晚没在看电视。（“在”可理解为“正在”）",
      answers: ["They were not watching TV last night.", "They weren't watching TV last night."],
      explanation:
        "过去进行否定：were not / weren't + doing。",
    },
    {
      n: 5,
      prompt: "小红没戴眼镜。（戴=wear[vt.]，眼镜=glasses（复数））",
      answers: [
        "Xiaohong doesn't wear glasses.",
        "Xiaohong does not wear glasses.",
      ],
      explanation:
        "习惯状态用一般现在否定。",
    },
    {
      n: 6,
      prompt:
        "你还没吃完米饭吗？（“还没”表完成时否定；吃=eat[ate/eaten]，米饭=rice）",
      answers: ["Haven't you eaten the rice?", "Have you not eaten the rice?"],
      explanation:
        "完成时否定疑问常用缩合 Haven't 提前。",
    },
    {
      n: 7,
      prompt: "小明不会去教堂的！（教堂=church）",
      answers: [
        "Xiaoming won't go to the church!",
        "Xiaoming will not go to church!",
        "Xiaoming is not going to go to the church!",
      ],
      explanation:
        "will not→won't；go to church / go to the church 视含义。",
    },
    {
      n: 8,
      prompt: "我感觉不是很好！（感觉=feel，此题用否定）",
      answers: ["I don't feel very good!", "I do not feel very good!"],
      explanation:
        "not 须放在助动词后，不可写成 I feel not。",
    },
    {
      n: 9,
      prompt: "我们不庆祝圣诞节（庆祝=celebrate，圣诞节=Christmas）",
      answers: [
        "We don't celebrate Christmas.",
        "We didn't celebrate Christmas.",
      ],
      explanation:
        "don't / didn't 视时间。",
    },
    {
      n: 10,
      prompt: "他不会把这个秘密告诉你的！（秘密=secret，告诉=tell）",
      answers: ["He won't tell you this secret!", "He will not tell you this secret!"],
      explanation:
        "主谓宾：他不会告诉你这个秘密。",
    },
    {
      n: 11,
      prompt: "这片云朵不属于我。（云朵=cloud，属于=belong[vi.]+to）",
      answers: [
        "This cloud does not belong to me.",
        "This cloud doesn't belong to me.",
        "This cloud did not belong to me.",
      ],
      explanation:
        "belong to 无被动；doesn't / didn't 皆可。",
    },
    {
      n: 12,
      prompt:
        "他们一点信心都没有。（有信心的=confident[adj.]，一点也不=at all）",
      answers: ["They are not confident at all.", "They aren't confident at all."],
      explanation:
        "形容词作表语用 be + not；或 They don't have any confidence at all.",
    },
    {
      n: 13,
      prompt: "我不需要你的道歉！（需要=need[vt.]，道歉=apology）",
      answers: ["I don't need your apology!", "I do not need your apology!"],
      explanation:
        "当面陈述常用现在时。",
    },
    {
      n: 14,
      prompt: "小强为啥不给我袜子？（给=give[vt.]，袜子=sock）",
      answers: [
        "Why doesn't Xiaoqiang give me the sock?",
        "Why doesn't Xiaoqiang give me the socks?",
      ],
      explanation:
        "Why doesn't + 原形 give。",
    },
    {
      n: 15,
      prompt: "他昨天没通过这次考试吗？（通过=pass[vt.]，考试=exam）",
      answers: ["Didn't he pass the exam yesterday?"],
      explanation:
        "过去否定疑问：Didn't 提前。",
    },
    {
      n: 16,
      prompt: "他无法打破这个规则吗？（无法=can't，打破=break，规则=rule）",
      answers: ["Can't he break this rule?", "Can he not break this rule?"],
      explanation:
        "情态动词 can't 提前。",
    },
    {
      n: 17,
      prompt: "这些人还有什么没做完？（做完=finish）",
      answers: ["What haven't these people finished?"],
      explanation:
        "What + haven't + 主语 + finished。",
    },
    {
      n: 18,
      prompt: "昨晚7点，他们没在游泳。（游泳=swim）",
      answers: [
        "At 7 last night, they weren't swimming.",
        "At 7 last night, they were not swimming.",
      ],
      explanation:
        "过去进行否定 weren't swimming。",
    },
    {
      n: 19,
      prompt: "我现在没在海鲜市场。（海鲜=seafood，市场=market）",
      answers: ["I am not in the seafood market now."],
      explanation:
        "无动作谓语，用 be + not。",
    },
    {
      n: 20,
      prompt:
        "他们啥也不明白。（明白=understand，任何东西=anything，一点也不=at all）",
      answers: ["They don't understand anything at all."],
      explanation:
        "anything 与 at all 呼应加强否定。",
    },
  ],
}
