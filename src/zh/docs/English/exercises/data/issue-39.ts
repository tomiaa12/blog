import type { ExerciseIssue } from "./types"

export const issue39: ExerciseIssue = {
  id: "issue-39",
  menuTitle: "第39期 · 名词定语",
  title: "第39期：名词作定语、状语与同位语",
  subtitle: "coffee cup / shoe shop / 同位语 / Mid-Autumn Festival",
  items: [
    {
      n: 1,
      prompt:
        "我家附近的那家书店有大量的书籍。（书店=bookstore，附近=near，大量的=a wide collection of，书籍=book）",
      answers: [
        "The bookstore near my home has a wide collection of books.",
        "The book store near my home has a wide collection of books.",
      ],
      explanation: "bookstore 或 book store；名词作定语。",
    },
    {
      n: 2,
      prompt:
        "她买了一个漂亮的咖啡杯作为礼物。（咖啡杯=coffee cup，作为=as，礼物=gift）",
      answers: ["She bought a beautiful coffee cup as a gift."],
      explanation: "coffee 修饰 cup。",
    },
    {
      n: 3,
      prompt:
        "公园里的花店满是五彩斑斓的花朵。（花店=flower store，满是=full of，五彩斑斓的=colorful）",
      answers: ["The flower store in the park is full of colorful flowers."],
      explanation: "flower store；in the park。",
    },
    {
      n: 4,
      prompt:
        "我叔叔作为经理在一家大型汽车厂工作。（叔叔=uncle，经理=manager，汽车厂=car factory，工作=work）",
      answers: ["My uncle works as a manager in a big car factory."],
      explanation: "as a manager；in a big car factory。",
    },
    {
      n: 5,
      prompt:
        "你需要出示学生证才能享受折扣。（出示=show，学生证=student card，享受=enjoy，折扣=discount）",
      answers: ["You need to show your student card to enjoy the discount."],
      explanation: "student card。",
    },
    {
      n: 6,
      prompt:
        "我们中国人通常在中秋节吃月饼。（中国人=Chinese，通常=usually，中秋节=Mid-Autumn Festival，月饼=moon cake）",
      answers: [
        "We Chinese usually eat moon cakes during the Mid-Autumn Festival.",
      ],
      explanation: "We Chinese 同位语；Mid-Autumn Festival 连字符。",
    },
    {
      n: 7,
      prompt:
        "我们去鞋店买双新运动鞋。（鞋店=shoe shop，一双=a pair of，运动鞋=sneaker）",
      answers: ["We go to the shoe shop to buy a new pair of sneakers."],
      explanation: "shoe shop。",
    },
    {
      n: 8,
      prompt: "你应该戴顶遮阳帽。（遮阳帽=sun hat，戴=wear）",
      answers: ["You should wear a sun hat."],
      explanation: "sun hat。",
    },
    {
      n: 9,
      prompt:
        "我的狗在院子里有一个舒适的狗窝。（院子=yard，舒适的=comfortable，狗窝=dog house）",
      answers: ["My dog has a comfortable dog house in the yard."],
      explanation: "dog house。",
    },
    {
      n: 10,
      prompt: "我们的老师王先生对我们很和蔼。（和蔼的=kind，对=to）",
      answers: [
        "Our teacher Mr. Wang is very kind to us.",
        "Our teacher Mr Wang is very kind to us.",
      ],
      explanation: "Mr. Wang 与 teacher 同位。",
    },
    {
      n: 11,
      prompt:
        "我的家乡南京，一座历史悠久的城市，每年都吸引着许多游客。（家乡=hometown，吸引=attract，游客=tourist）",
      answers: [
        "My hometown Nanjing, a city with a long history, attracts many tourists every year.",
      ],
      explanation: "同位语 a city with a long history。",
    },
    {
      n: 12,
      prompt:
        "他们的女儿 Lily 是一位有天赋的画家。（女儿=daughter，有天赋的=talented，画家=painter）",
      answers: ["Their daughter Lily is a talented painter."],
      explanation: "Lily 与 daughter 同位。",
    },
    {
      n: 13,
      prompt:
        "阿凡达，一部科幻电影，取得了巨大的成功。（科幻的=science-fiction，成功=success）",
      answers: [
        "Avatar, a science-fiction film, got a huge success.",
        "Avatar, a science-fiction film, was a huge success.",
      ],
      explanation: "同位语；got/was a huge success。",
    },
    {
      n: 14,
      prompt: "Jack 是我的朋友，一个篮球爱好者。（篮球=basketball，爱好者=lover）",
      answers: ["Jack is my friend, a basketball lover."],
      explanation: "a basketball lover 同位语。",
    },
    {
      n: 15,
      prompt:
        "小红，一位以其乡村音乐而闻名的女孩，有很多粉丝。（以……闻名=known for，乡村音乐=country music，粉丝=fan）",
      answers: [
        "Xiaohong, a girl known for her country music, has many fans.",
      ],
      explanation: "known for 作后置定语。",
    },
    {
      n: 16,
      prompt:
        "我妈妈把脏衣服放进洗衣机。（脏的=dirty，衣服=clothes，洗衣机=washing machine，放=put，进入=into）",
      answers: ["My mother puts the dirty clothes into the washing machine."],
      explanation: "washing machine。",
    },
    {
      n: 17,
      prompt: "他在电脑键盘上快速打字。（电脑键盘=computer keyboard，打字=type，快速地=quickly）",
      answers: ["He typed quickly on the computer keyboard."],
      explanation: "computer 修饰 keyboard。",
    },
    {
      n: 18,
      prompt:
        "一辆警车正在高速公路上追捕嫌疑人。（警车=police car，高速公路=highway，追捕=chase，嫌疑人=suspect）",
      answers: ["The police car was chasing the suspect on the highway."],
      explanation: "police car。",
    },
    {
      n: 19,
      prompt: "孩子们从牛奶盒里喝牛奶。（牛奶盒=milk carton，喝=drink）",
      answers: [
        "The children drink the milk from the milk cartons.",
        "The children drink milk from the milk cartons.",
      ],
      explanation: "milk cartons。",
    },
    {
      n: 20,
      prompt: "这块巧克力棒是从超市购买的。（巧克力棒=chocolate bar，购买=purchase，超市=supermarket）",
      answers: [
        "This chocolate bar was purchased from the supermarket.",
        "This chocolate bar was bought from the supermarket.",
      ],
      explanation: "被动 was purchased/bought。",
    },
  ],
}
