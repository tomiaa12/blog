import type { ExerciseIssue } from "./types"

export const issue17: ExerciseIssue = {
  id: "issue-17",
  menuTitle: "第17期 · 非谓语词性",
  title: "第17期：非谓语词性",
  subtitle: "动名词/不定式作主语、宾语、表语",
  items: [
    {
      n: 1,
      prompt:
        "学习一门外语需要耐心。（外语=foreign language，需要=require[vt.]，耐心=patience）",
      answers: [
        "Learning a foreign language requires patience.",
        "To learn a foreign language requires patience.",
      ],
      explanation:
        "主语为名词性成分：Learning / To learn 均可；谓语用单三 requires。",
    },
    {
      n: 2,
      prompt:
        "我们的首要目标是去完成任务。（首要的=primary[adj.]，目标=goal/purpose，完成=complete/finish[vt.]，任务=task）",
      answers: [
        "Our primary goal is to finish the task.",
        "Our primary goal is to complete the task.",
      ],
      explanation:
        "“去完成”表目的→表语用 to finish / to complete。",
    },
    {
      n: 3,
      prompt: "他避免了犯错。（避免=avoid[vt.]，犯错误=make mistakes）",
      answers: ["He avoided making mistakes."],
      explanation:
        "avoid 后常接 doing。",
    },
    {
      n: 4,
      prompt:
        "面对挑战需要勇气。（面对=face[vt.]，挑战=challenge，需要=require/need，勇气=courage）",
      answers: [
        "Facing challenges requires courage.",
        "To face challenges requires courage.",
      ],
      explanation:
        "主语 Facing / To face 均可；谓语 requires。",
    },
    {
      n: 5,
      prompt:
        "他的工作是设计广告。（工作=job，设计=design[vt.]，广告=advertisement，可简写 ad，复数 ads）",
      answers: [
        "His job is designing ads.",
        "His job is to design ads.",
      ],
      explanation:
        "表语 designing / to design 作名词性成分均可。",
    },
    {
      n: 6,
      prompt:
        "她的建议是去抓住这个机会。（建议=advice[不可数]，抓住=seize，机会=opportunity）",
      answers: ["Her advice is to seize the opportunity."],
      explanation:
        "“去抓住”表目的→to seize。",
    },
    {
      n: 7,
      prompt:
        "要一直保持乐观是不容易的。（一直=always，保持=stay，乐观的=optimistic[adj.]，容易=easy[adj.]）",
      answers: [
        "To always stay optimistic is not easy.",
        "It is not easy to always stay optimistic.",
      ],
      explanation:
        "“要一直保持”→不定式作主语；可用 It 作形式主语。",
    },
    {
      n: 8,
      prompt: "小明建议早点睡觉。（建议=suggest[vt.]，早点=earlier，睡觉=sleep[vi.]）",
      answers: ["Xiaoming suggests sleeping earlier."],
      explanation:
        "suggest 后接 doing：suggests sleeping。",
    },
    {
      n: 9,
      prompt:
        "偶尔遭受失败并不会毁掉一个人。（偶尔=at times，遭受=suffer[vi.]，毁掉=destroy/ruin[vt.]）",
      answers: ["Suffering from failure at times does not destroy a person."],
      explanation:
        "主语用 doing 表泛指经历；suffer from；谓语 does not destroy。",
    },
    {
      n: 10,
      prompt: "每天锻炼至关重要。（锻炼=exercise[vi.]，至关重要的=crucial[adj.]）",
      answers: [
        "Exercising every day is crucial.",
        "To exercise every day is crucial.",
      ],
      explanation:
        "主语 Exercising / To exercise 均可。",
    },
    {
      n: 11,
      prompt:
        "学习数学需要逻辑思维。（数学=maths/mathematics，逻辑的=logical[adj.]，思维=thinking）",
      answers: [
        "Studying mathematics requires logical thinking.",
        "To study mathematics requires logical thinking.",
        "Studying maths requires logical thinking.",
      ],
      explanation:
        "与第1题同类：动名词/不定式作主语。",
    },
    {
      n: 12,
      prompt:
        "他的责任是研究和开发创新产品。（责任=duty，研究=research[vt.]，开发=develop[vt.]，创新的=innovative[adj.]，产品=product）",
      answers: [
        "His duty is researching and developing innovative products.",
        "His duty is to research and develop innovative products.",
      ],
      explanation:
        "product 常用复数 products；to research and (to) develop 可省略第二个 to。",
    },
    {
      n: 13,
      prompt:
        "小红的梦想是去改变整个世界。（梦想=dream，改变=change[vt.]，整个的=entire/whole[adj.]，世界=world）",
      answers: [
        "Xiaohong's dream is to change the entire world.",
        "Xiaohong's dream is to change the whole world.",
      ],
      explanation:
        "表“要去改变”→to change。",
    },
    {
      n: 14,
      prompt:
        "大家都同意去不断尝试新方法。（大家=everyone，同意=agree[vt.]，不断地=constantly，尝试=try[vt.]，方法=method）",
      answers: [
        "Everyone agrees to constantly try new methods.",
        "Everyone agrees to keep trying new methods.",
      ],
      explanation:
        "agree to do；备选 keep trying 表持续尝试。",
    },
    {
      n: 15,
      prompt:
        "我不喜欢在海边看日出。（在海边=by the seaside，观看=watch[vt.]，日出=sunrise）",
      answers: [
        "I don't like watching sunrise by the seaside.",
        "I don't like to watch sunrise by the seaside.",
        "I do not like watching sunrise by the seaside.",
      ],
      explanation:
        "like 后 doing / to do 均可。",
    },
    {
      n: 16,
      prompt:
        "批评别人与质疑自己是不可取的。（批评=criticize[vt.]，别人=others，质疑=question[vt.]，某人自己=oneself，不可取的=inadvisable[adj.]）",
      answers: [
        "Criticizing others and questioning oneself are inadvisable.",
        "To criticize others and question oneself are inadvisable.",
        "To criticize others and to question oneself are inadvisable.",
      ],
      explanation:
        "两动名词并列作主语→谓语用 are；不定式并列亦可，第二个 to 可省。",
    },
    {
      n: 17,
      prompt:
        "履行承诺是我的责任。（履行=fulfil/fulfill[vt.]，承诺=promise，责任=responsibility）",
      answers: [
        "Fulfilling a promise is my responsibility.",
        "Fulfilling promises is my responsibility.",
        "To fulfil a promise is my responsibility.",
        "To fulfill a promise is my responsibility.",
      ],
      explanation:
        "fulfil（英）/ fulfill（美）；promise 可数时常加 a 或用复数。",
    },
    {
      n: 18,
      prompt:
        "他的爱好是分析市场趋势。（爱好=hobby，分析=analyze/analyse[vt.]，市场=market，趋势=trend）",
      answers: [
        "His hobby is analyzing the market trend.",
        "His hobby is analysing the market trend.",
        "His hobby is to analyze the market trend.",
        "His hobby is to analyse the market trend.",
      ],
      explanation:
        "表长期爱好常用 doing；analyze/analyse 拼写均可。",
    },
    {
      n: 19,
      prompt:
        "保持好奇心能带来好处。（保持=maintain[vt.]，好奇心=curiosity，带来=bring[vt.]，好处=benefit）",
      answers: [
        "Maintaining curiosity can bring benefit.",
        "Maintaining curiosity can bring benefits.",
      ],
      explanation:
        "表持续状态用 maintaining；benefit 可数/不可数均可。",
    },
    {
      n: 20,
      prompt:
        "每周练习乐器能明显提高手指灵活性和音乐表达能力。（每周=every week/weekly，练习=practise[vt.]，乐器=musical instrument，明显地=significantly，提高=improve[vt.]，手指=finger，灵活性=dexterity，音乐表达能力=music expression）",
      answers: [
        "Practising a musical instrument weekly can significantly improve your finger dexterity and music expression.",
        "Practicing a musical instrument weekly can significantly improve your finger dexterity and music expression.",
      ],
      explanation:
        "英拼 practising；美拼 practicing；主语为 doing。",
    },
  ],
}
