import type { ExerciseIssue } from "./types"

export const issue03: ExerciseIssue = {
  id: "issue-03",
  menuTitle: "第3期 · be 动词",
  title: "第3期：be 动词的基本用法",
  subtitle: "am / is / are 与主语一致",
  items: [
    {
      n: 1,
      prompt: "我们是中国人（中国人=Chinese，单复数同型）",
      answers: ["We are Chinese."],
      explanation:
        "我们是中国人 = We are Chinese.\n主语我们 We = 第一人称复数，用 are。",
    },
    {
      n: 2,
      prompt: "这只猫是黑色的（黑色的=black[adj.]）",
      answers: ["This cat is black.", "The cat is black."],
      explanation:
        "这只猫是黑色的 = This cat is black.\n主语为第三人称单数，用 is。",
    },
    {
      n: 3,
      prompt: "那些花是红色的（花=flower，红色的=red[adj.]）",
      answers: ["Those flowers are red.", "The flowers are red."],
      explanation:
        "那些花是红色的 = Those flowers are red.\n主语为复数，用 are；flower 用复数 flowers。",
    },
    {
      n: 4,
      prompt: "他是一个医生（医生=doctor）",
      answers: ["He is a doctor."],
      explanation:
        "他是一个医生 = He is a doctor.\n主语 He 为第三人称单数，用 is。",
    },
    {
      n: 5,
      prompt: "她是一名护士（护士=nurse）",
      answers: ["She is a nurse."],
      explanation:
        "她是一名护士 = She is a nurse.\n主语 She 为第三人称单数，用 is。",
    },
    {
      n: 6,
      prompt: "我很难过（难过=sad[adj.]）",
      answers: ["I am sad.", "I am very sad."],
      explanation:
        "我很难过 = I am sad.\n主语 I 用 am。中文“很”为语气，译成英语可不加 very，加 very 也正确。",
    },
    {
      n: 7,
      prompt: "这些同学很累（同学=classmate，累=tired[adj.]）",
      answers: [
        "These classmates are tired.",
        "The classmates are tired.",
      ],
      explanation:
        "这些同学很累 = These classmates are tired.\n主语为复数，用 are；These 可换为 The。",
    },
    {
      n: 8,
      prompt: "这个男人很帅（男人=man，帅=handsome[adj.]）",
      answers: ["This man is handsome.", "The man is handsome."],
      explanation:
        "这个男人很帅 = This man is handsome.\n主语为第三人称单数，用 is。",
    },
    {
      n: 9,
      prompt: "那个女人很丑（女人=woman，丑=ugly[adj.]）",
      answers: ["That woman is ugly.", "The woman is ugly."],
      explanation:
        "那个女人很丑 = That woman is ugly.\n主语为第三人称单数，用 is。",
    },
    {
      n: 10,
      prompt: "这些是我的苹果",
      answers: ["These are my apples."],
      explanation:
        "这些是我的苹果 = These are my apples.\n主语 These 为复数，用 are；apple 用复数 apples。",
    },
    {
      n: 11,
      prompt: "那些是他们的梨（梨=pear）",
      answers: ["Those are their pears."],
      explanation:
        "那些是他们的梨 = Those are their pears.\n主语 Those 为复数，用 are；pear 用复数 pears。",
    },
    {
      n: 12,
      prompt: "他们是好人（好=good[adj.]，人=person[复数 people]）",
      answers: ["They are good people."],
      explanation:
        "他们是好人 = They are good people.\n主语 They 为复数，用 are；person 的复数常用 people。",
    },
    {
      n: 13,
      prompt: "我是一个天才（天才=genius）",
      answers: ["I am a genius."],
      explanation:
        "我是一个天才 = I am a genius.\n主语 I 用 am。",
    },
    {
      n: 14,
      prompt: "你们是日本人（日本人=Japanese，单复数同型）",
      answers: ["You are Japanese."],
      explanation:
        "你们是日本人 = You are Japanese.\n主语 You 为第二人称复数，用 are。",
    },
    {
      n: 15,
      prompt: "这张桌子很小（桌子=table，小=small[adj.]）",
      answers: ["This table is small.", "The table is small."],
      explanation:
        "这张桌子很小 = This table is small.\n主语为第三人称单数，用 is；This 可换 The。",
    },
    {
      n: 16,
      prompt: "那些椅子很高（椅子=chair，高=high[adj.]）",
      answers: ["Those chairs are high.", "The chairs are high."],
      explanation:
        "那些椅子很高 = Those chairs are high.\n主语为复数，用 are。",
    },
    {
      n: 17,
      prompt: "这盏灯很亮（灯=lamp，亮=shiny[adj.]）",
      answers: ["This lamp is shiny.", "The lamp is shiny."],
      explanation:
        "这盏灯很亮 = This lamp is shiny.\n主语为第三人称单数，用 is。",
    },
    {
      n: 18,
      prompt: "她很聪明（聪明=clever）",
      answers: ["She is clever."],
      explanation:
        "她很聪明 = She is clever.\n主语 She 为第三人称单数，用 is。",
    },
    {
      n: 19,
      prompt: "这人是我兄弟（兄弟=brother）",
      answers: ["This person is my brother.", "The person is my brother."],
      explanation:
        "这人是我兄弟 = This person is my brother.\n主语为第三人称单数，用 is。",
    },
    {
      n: 20,
      prompt: "那个同学是我儿子（同学=classmate，儿子=son）",
      answers: ["That classmate is my son.", "The classmate is my son."],
      explanation:
        "那个同学是我儿子 = That classmate is my son.\n主语为第三人称单数，用 is。",
    },
  ],
}
