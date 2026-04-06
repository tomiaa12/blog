import type { ExerciseIssue } from "./types"

export const issue15: ExerciseIssue = {
  id: "issue-15",
  menuTitle: "第15期 · 非谓语作状语",
  title: "第15期：非谓语作状语",
  subtitle: "分词短语、不定式作状语；独立主格（原文在 14 与 17 期间未标期号，此处按顺序编为第15期）",
  items: [
    {
      n: 1,
      prompt: "他站在阳台上，手里拿着一个笔记本。",
      answers: [
        "He stands on the balcony, holding a notebook in his hand.",
        "Holding a notebook in his hand, he stands on the balcony.",
        "He, holding a notebook in his hand, stands on the balcony.",
      ],
      explanation:
        "一句一谓：主干“站”或“拿”其一；另一动作作现在分词状语。in his hand 可省。",
    },
    {
      n: 2,
      prompt: "他躺在沙发上，听着歌曲。",
      answers: [
        "He lies on the sofa, listening to the songs.",
        "Listening to the songs, he lies on the sofa.",
      ],
      explanation:
        "listen 不及物接宾语用 listen to。",
    },
    {
      n: 3,
      prompt: "她微笑着告诉我这个事实。",
      answers: [
        "Smiling, she tells me the truth.",
        "She tells me the truth, smiling.",
      ],
      explanation:
        "材料建议以 She tells me the truth 为主干，smiling 作状语。",
    },
    {
      n: 4,
      prompt: "这个老人坐在一块石头上喂鸽子。",
      answers: [
        "This old man, sitting on the rock, feeds the pigeons.",
        "This old man feeds the pigeons, sitting on the rock.",
      ],
      explanation:
        "喂鸽子为主干时常用插入 sitting on the rock。",
    },
    {
      n: 5,
      prompt: "他在公路上开车，打着电话。",
      answers: [
        "He, driving on the highway, is making a phone call.",
        "Driving on the highway, he is making a phone call.",
        "He is driving on the highway, making a phone call.",
      ],
      explanation:
        "两进行动作并列：开车与打电话，用分词或插入语衔接。",
    },
    {
      n: 6,
      prompt: "她深受感动，流下了眼泪。",
      answers: [
        "Deeply moved, she shed tears.",
        "She shed tears, deeply moved.",
        "She, deeply moved, shed tears.",
      ],
      explanation:
        "感动为被动→moved；材料建议以 She shed tears 为主干。",
    },
    {
      n: 7,
      prompt: "他高兴地点点头，鼓励她去分享想法。",
      answers: [
        "He nods happily, encouraging her to share the thoughts.",
        "Encouraging her to share the thoughts, he nods happily.",
      ],
      explanation:
        "encourage sb. to do；材料建议首选句末 encouraging…",
    },
    {
      n: 8,
      prompt: "她吃着一块饼干，走在桥上。",
      answers: [
        "She walks on the bridge, eating a biscuit.",
        "Eating a biscuit, she walks on the bridge.",
        "She, eating a biscuit, walks on the bridge.",
      ],
      explanation:
        "一走一动，一分词作伴随状语。",
    },
    {
      n: 9,
      prompt: "他坐在屏幕前写日记。",
      answers: [
        "He sits before the screen, writing a diary.",
        "Writing a diary, he sits before the screen.",
        "He sits before the screen to write a diary.",
        "To write a diary, he sits before the screen.",
      ],
      explanation:
        "表伴随常用 writing；表目的可用 to write（句末常无逗号）。",
    },
    {
      n: 10,
      prompt: "她走进房间，眼睛闪着光。",
      answers: ["She enters the room, her eyes sparkling."],
      explanation:
        "前后主语不同→独立主格：名词 + doing。",
    },
    {
      n: 11,
      prompt: "孩子们高声尖叫着跑过街道。",
      answers: [
        "The children run across the street, screaming loudly.",
        "Screaming loudly, the children run across the street.",
      ],
      explanation:
        "材料建议以跑为主干，尖叫为伴随分词。",
    },
    {
      n: 12,
      prompt: "被小明拒绝后，小红感到很失望。",
      answers: [
        "Rejected by Xiaoming, Xiaohong feels disappointed.",
        "Xiaohong feels disappointed, rejected by Xiaoming.",
        "Xiaohong was rejected by Xiaoming, feeling disappointed.",
      ],
      explanation:
        "被动用过去分词 rejected；或用被动谓语 + feeling disappointed。",
    },
    {
      n: 13,
      prompt: "Mary 被她男朋友拥抱后，哭了。",
      answers: [
        "Mary is hugged by her boyfriend, crying.",
        "Mary, hugged by her boyfriend, cries.",
        "Hugged by her boyfriend, Mary cries.",
        "Mary cries, hugged by her boyfriend.",
      ],
      explanation:
        "材料建议之一：先被拥抱再哭→is hugged…, crying。",
    },
    {
      n: 14,
      prompt: "这个厨师做着饭，与她奶奶说话。",
      answers: [
        "The chef, cooking, talks with her grandma.",
        "The chef is cooking, talking with her grandma.",
        "Cooking, the chef talks with her grandma.",
      ],
      explanation:
        "cooking 作插入或伴随；也可用双进行。",
    },
    {
      n: 15,
      prompt: "他独自坐在角落，被派对里的所有人忽视。",
      answers: [
        "Ignored by everyone in the party, he sits at the corner alone.",
        "He sits at the corner alone, ignored by everyone in the party.",
        "He, ignored by everyone in the party, sits at the corner alone.",
      ],
      explanation:
        "everyone in the party 作后置定语；ignore 被动 ignored。",
    },
    {
      n: 16,
      prompt: "这个男孩被来自爆炸的巨响吓到，把杯子掉了。",
      answers: [
        "This boy is shocked by the loud noise from the explosion, dropping his cup.",
        "Shocked by the loud noise from the explosion, this boy drops his cup.",
        "This boy, shocked by the loud noise from the explosion, drops his cup.",
      ],
      explanation:
        "材料认为先吓到再掉杯→is shocked…, dropping… 较顺。",
    },
    {
      n: 17,
      prompt: "他站在山顶上，俯瞰着山谷。",
      answers: [
        "He stands on the mountaintop, overlooking the valley.",
        "Overlooking the valley, he stands on the mountaintop.",
        "He, overlooking the valley, stands on the mountaintop.",
      ],
      explanation:
        "overlook 与主语主动关系→overlooking。",
    },
    {
      n: 18,
      prompt: "为了支持环境保护，他们做了个决定。",
      answers: [
        "To support environmental protection, they made a decision.",
        "They made a decision to support environmental protection.",
      ],
      explanation:
        "表目的用不定式；放句末一般不加逗号。",
    },
    {
      n: 19,
      prompt: "他们深受启发，开始去探索未知的领域。",
      answers: [
        "They are deeply inspired, starting to explore the unknown fields.",
        "Deeply inspired, they start to explore the unknown fields.",
        "They, deeply inspired, start to explore the unknown fields.",
      ],
      explanation:
        "先启发再开始→are deeply inspired, starting… 较贴动作顺序。",
    },
    {
      n: 20,
      prompt: "这个问题解决了，大家都感到很放松。",
      answers: [
        "The problem solved, everyone feels relaxed.",
        "Everyone feels relaxed, the problem solved.",
      ],
      explanation:
        "独立主格：The problem solved（省略 be）；或 everyone feeling relaxed, the problem is solved。",
    },
  ],
}
