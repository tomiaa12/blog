import type { ExerciseIssue } from "./types"

export const issue35: ExerciseIssue = {
  id: "issue-3-5",
  menuTitle: "第3.5期 · 名词性物主",
  title: "第3.5期（补）：你的、我的、他的（东西）",
  subtitle: "mine / yours / his / hers / ours / theirs",
  items: [
    {
      n: 1,
      prompt: "这是我的书，但那是你的（书=book，但=but）",
      answers: ["This is my book, but that is yours."],
      explanation:
        "这是我的书，但那是你的 = This is my book, but that is yours.\nbut 为连词，后接另一分句，需完整主谓结构。",
    },
    {
      n: 2,
      prompt:
        "他的铅笔很短，但我的很长（铅笔=pencil，短=short[adj.]，长=long[adj.]）",
      answers: ["His pencil is short, but mine is long."],
      explanation:
        "他的铅笔很短，但我的很长 = His pencil is short, but mine is long.\n主系表结构需用 be 动词；mine 指代“我的铅笔”。",
    },
    {
      n: 3,
      prompt:
        "她的裙子是红色的，但你的是蓝色的（裙子=dress，红色的=red，蓝色的=blue）",
      answers: ["Her dress is red, but yours is blue."],
      explanation:
        "她的裙子是红色的，但你的是蓝色的 = Her dress is red, but yours is blue.\nyours 指代“你的裙子”。",
    },
    {
      n: 4,
      prompt: "这些橙子是他们的（橙子=orange）",
      answers: ["These oranges are theirs."],
      explanation:
        "这些橙子是他们的 = These oranges are theirs.\ntheirs 指代“他们的橙子”。",
    },
    {
      n: 5,
      prompt:
        "他的包很重，但我的很轻（书包=bag，重的=heavy[adj.]，轻的=light[adj.]）",
      answers: ["His bag is heavy, but mine is light."],
      explanation:
        "他的包很重，但我的很轻 = His bag is heavy, but mine is light.\nmine 指代“我的包”。",
    },
    {
      n: 6,
      prompt:
        "她们的鞋子很漂亮，而我们的很便宜（鞋子=shoe，漂亮=beautiful，便宜=cheap；而=and）",
      answers: ["Their shoes are beautiful, and ours are cheap."],
      explanation:
        "她们的鞋子很漂亮，而我们的很便宜 = Their shoes are beautiful, and ours are cheap.\nours 指“我们的鞋子”，为复数概念，谓语用 are。",
    },
    {
      n: 7,
      prompt:
        "这只狐狸是她的，而他的在家里（狐狸=fox，在家里=at home；at=介词，home=名词）",
      answers: ["This fox is hers, but his is at home."],
      explanation:
        "这只狐狸是她的，而他的在家里 = This fox is hers, but his is at home.\nat home 为介词短语，需用 be：his is at home。",
    },
    {
      n: 8,
      prompt:
        "我的橡皮擦丢了，所以我拿了你的（橡皮擦=eraser，丢了=lost[adj.]，所以=so，拿了=take）",
      answers: ["My eraser is lost, so I take yours."],
      explanation:
        "我的橡皮擦丢了，所以我拿了你的 = My eraser is lost, so I take yours.\nso 为连词，后接新句。",
    },
    {
      n: 9,
      prompt: "那些骨头是它的（骨头=bone）",
      answers: ["Those bones are its.", "Those are its bones."],
      explanation:
        "那些骨头是它的 = Those bones are its.\nits 作名词性用法指代“它的骨头”；也可用 Those are its bones。",
    },
    {
      n: 10,
      prompt:
        "你们的雨伞很大，但我们的很小（雨伞=umbrella，大=big，小=small）",
      answers: ["Your umbrellas are big, but ours are small."],
      explanation:
        "你们的雨伞很大，但我们的很小 = Your umbrellas are big, but ours are small.\nours 指我们的雨伞，复数，用 are。",
    },
    {
      n: 11,
      prompt: "我的就是你的",
      answers: ["Mine is yours.", "Mine are yours."],
      explanation:
        "我的就是你的 = Mine is yours.\nmine、yours 为名词性物主代词；所指可单可复，is/are 皆可。",
    },
    {
      n: 12,
      prompt:
        "她的头发是黄的，但我的是绿的（头发=hair，黄的=yellow[adj.]，绿的=green[adj.]）",
      answers: ["Her hair is yellow, but mine is green."],
      explanation:
        "她的头发是黄的，但我的是绿的 = Her hair is yellow, but mine is green.\nmine 指代“我的头发”。",
    },
    {
      n: 13,
      prompt:
        "他们的房间很干净，但我们的很脏（房间=room，干净=clean[adj.]，脏=dirty[adj.]）",
      answers: [
        "Their rooms are clean, but ours are dirty.",
        "Their room is clean, but ours is dirty.",
      ],
      explanation:
        "他们的房间很干净，但我们的很脏 = Their rooms are clean, but ours are dirty.\n若强调共住一间可用单数 room；未指明情境时单复数皆可。",
    },
    {
      n: 14,
      prompt:
        "这只老虎是他的宠物，而我的是狮子（老虎=tiger，宠物=pet，狮子=lion）",
      answers: ["This tiger is his pet, and mine is a lion."],
      explanation:
        "这只老虎是他的宠物，而我的是狮子 = This tiger is his pet, and mine is a lion.\n用 a lion 表“一只狮子”这一类，而非特指某只。",
    },
    {
      n: 15,
      prompt:
        "你的分数很高，但他的很低（分数=score，高=high[adj.]，低=low[adj.]）",
      answers: ["Your score is high, but his is low."],
      explanation:
        "你的分数很高，但他的很低 = Your score is high, but his is low.\nhis 指代 his score。",
    },
    {
      n: 16,
      prompt:
        "它的饮料是水，而他们的是果汁（饮料=drink，水=water，果汁=juice）",
      answers: [
        "Its drink is water, and theirs is juice.",
        "Its drink is water, and theirs are juice.",
      ],
      explanation:
        "它的饮料是水，而他们的是果汁 = Its drink is water, and theirs is juice.\nwater、juice 为不可数，一般不加 a/the；theirs 单复数理解不同则 is/are 均可。",
    },
    {
      n: 17,
      prompt:
        "他的衣服很贵，但她的很便宜（衣服=clothes（复数），贵=expensive[adj.]，便宜=cheap[adj.]）",
      answers: ["His clothes are expensive, but hers are cheap."],
      explanation:
        "他的衣服很贵，但她的很便宜 = His clothes are expensive, but hers are cheap.\nclothes 常作复数，用 are；hers 指 her clothes。",
    },
    {
      n: 18,
      prompt:
        "他的手表很好，所以我买了他的（手表=watch，买=buy）",
      answers: ["His watch is good, so I buy his."],
      explanation:
        "他的手表很好，所以我买了他的 = His watch is good, so I buy his.\n第二个 his 为名词性，指 his watch。",
    },
    {
      n: 19,
      prompt:
        "我们的书很无聊，所以我们借了他们的（无聊=boring[adj.]，借了=borrow）",
      answers: ["Our books are boring, so we borrow theirs."],
      explanation:
        "我们的书很无聊，所以我们借了他们的 = Our books are boring, so we borrow theirs.\n也可视语境用 Our book is boring；books 更常指多本。",
    },
    {
      n: 20,
      prompt:
        "我的路很窄，但你们的很宽（路=road，窄=narrow[adj.]，宽=wide[adj.]）",
      answers: [
        "My road is narrow, but yours is wide.",
        "My road is narrow, but yours are wide.",
      ],
      explanation:
        "我的路很窄，但你们的很宽 = My road is narrow, but yours is wide.\nyours 若指一条路用 is，多条路用 are。",
    },
  ],
}
