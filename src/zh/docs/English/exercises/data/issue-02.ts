import type { ExerciseIssue } from "./types"

export const issue02: ExerciseIssue = {
  id: "issue-02",
  menuTitle: "第2期 · 形容词性物主",
  title: "第2期：你的、我的、他的（形容词性物主限定词）",
  subtitle: "my / your / his / her / its / our / their",
  items: [
    {
      n: 1,
      prompt: "我爱我的家（爱=love，家=home）",
      answers: ["I love my home."],
      explanation:
        "我爱我的家 = I love my home.\n主语 I，谓语 love，宾语 my home（my 为形容词性物主限定词）。",
    },
    {
      n: 2,
      prompt: "我知道你的名字（知道=know，名字=name）",
      answers: ["I know your name."],
      explanation:
        "我知道你的名字 = I know your name.\n宾语 your name 中 your 为形容词性物主限定词。",
    },
    {
      n: 3,
      prompt: "这是他的书（书=book）",
      answers: ["This is his book."],
      explanation:
        "这是他的书 = This is his book.\n“这是”常用 This is。",
    },
    {
      n: 4,
      prompt: "那是她的房子（房子=house）",
      answers: ["That is her house."],
      explanation:
        "那是她的房子 = That is her house.\nThat is 表“那是”。",
    },
    {
      n: 5,
      prompt: "我们看见它的食物（看见=see，食物=food）",
      answers: ["We see its food."],
      explanation:
        "我们看见它的食物 = We see its food.\n宾语 its food 中 its 为形容词性物主限定词。",
    },
    {
      n: 6,
      prompt: "他拿走我们的钱（拿走=take，钱=money）",
      answers: ["He takes our money."],
      explanation:
        "他拿走我们的钱 = He takes our money.\n主语 He 为第三人称单数，谓语 take 加 s。our money 中 our 为限定词。",
    },
    {
      n: 7,
      prompt: "我唱你们的歌（唱=sing，歌=song）",
      answers: ["I sing your song."],
      explanation:
        "我唱你们的歌 = I sing your song.\n宾语 your song 中 your 为限定词。",
    },
    {
      n: 8,
      prompt: "我讨厌他们的声音（讨厌=hate，声音=voice）",
      answers: [
        "I hate their voice.",
        "I hate their voices.",
      ],
      explanation:
        "我讨厌他们的声音 = I hate their voice.\nvoice 表单数整体人声或复数 voices 强调各人声音均可，视语境而定。",
    },
    {
      n: 9,
      prompt: "她穿着她的裙子（穿=wear，裙子=dress）",
      answers: ["She wears her dress."],
      explanation:
        "她穿着她的裙子 = She wears her dress.\n主语 She 为第三人称单数，谓语 wear 加 s。",
    },
    {
      n: 10,
      prompt: "我诉说我的故事（诉说=tell，故事=story）",
      answers: ["I tell my story."],
      explanation:
        "我诉说我的故事 = I tell my story.\n宾语 my story 中 my 为限定词。",
    },
    {
      n: 11,
      prompt: "我们找到他的钥匙（钥匙=key）",
      answers: ["We find his key."],
      explanation:
        "我们找到他的钥匙 = We find his key.\n宾语 his key 中 his 为限定词。",
    },
    {
      n: 12,
      prompt: "这条狗追它的尾巴（追=chase，尾巴=tail）",
      answers: ["The dog chases its tail.", "This dog chases its tail."],
      explanation:
        "这条狗追它的尾巴 = The dog chases its tail.\n主语为第三人称单数，chase 加 s；its tail 中 its 为限定词。",
    },
    {
      n: 13,
      prompt: "他记得我的生日（记得=remember，生日=birthday）",
      answers: ["He remembers my birthday."],
      explanation:
        "他记得我的生日 = He remembers my birthday.\n主语 He 为单三，remember 加 s。",
    },
    {
      n: 14,
      prompt: "她洗她的脸（洗=wash，脸=face）",
      answers: ["She washes her face."],
      explanation:
        "她洗她的脸 = She washes her face.\nwash 以 sh 结尾，第三人称单数加 es 得 washes。",
    },
    {
      n: 15,
      prompt: "我们共享我们的午餐（共享=share，午餐=lunch）",
      answers: ["We share our lunch."],
      explanation:
        "我们共享我们的午餐 = We share our lunch.\n指共享的一顿午餐时常用单数 lunch。",
    },
    {
      n: 16,
      prompt: "小猫吃它的鱼（小猫=kitten，吃=eat，鱼=fish）",
      answers: ["The kitten eats its fish.", "This kitten eats its fish."],
      explanation:
        "小猫吃它的鱼 = The kitten eats its fish.\nThe 表特指正在吃鱼的那只小猫；its fish 中 its 为限定词。",
    },
    {
      n: 17,
      prompt: "你拿起一把吉他（拿起=pick up，吉他=guitar）",
      answers: ["You pick up a guitar."],
      explanation:
        "你拿起一把吉他 = You pick up a guitar.\npick up 为短语动词；a guitar 中 a 为限定词。",
    },
    {
      n: 18,
      prompt: "我喜欢我们的教室（教室=classroom）",
      answers: ["I like our classroom."],
      explanation:
        "我喜欢我们的教室 = I like our classroom.\nour classroom 中 our 为限定词。",
    },
    {
      n: 19,
      prompt: "他骑他的自行车（骑=ride，自行车=bike）",
      answers: ["He rides his bike."],
      explanation:
        "他骑他的自行车 = He rides his bike.\n主语 He 为单三，ride 加 s。",
    },
    {
      n: 20,
      prompt: "我有我的兴趣（有（此处指拥有）=have，兴趣=interest）",
      answers: ["I have my interest.", "I have my interests."],
      explanation:
        "我有我的兴趣 = I have my interest.\n此处的“有”表“拥有”才用 have；interest 可数与否视表达而定。",
    },
  ],
}
