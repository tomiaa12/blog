import type { ExerciseIssue } from "./types"

export const issue2122: ExerciseIssue = {
  id: "issue-21-22",
  menuTitle: "第21–22期 · 名词性成分",
  title: "第21–22期：名词性成分（综合练习）",
  subtitle: "动名词/不定式/名词性从句混用",
  items: [
    {
      n: 1,
      prompt: "早起是个好习惯。（起床=get up，早=early，习惯=habit）",
      answers: ["Getting up early is a good habit."],
      explanation:
        "动名词作主语。",
    },
    {
      n: 2,
      prompt:
        "旅游能开阔我的眼界。（旅游=travel，开阔=broaden，眼界=horizon）",
      answers: ["Traveling can broaden my horizon."],
      explanation:
        "Traveling 作主语；情态 can + broaden。",
    },
    {
      n: 3,
      prompt:
        "我们不关心这个小偷所偷的东西。（关心=care about，小偷=thief，偷=steal）",
      answers: ["We don't care about what this thief stole."],
      explanation:
        "what 引导介词宾语从句。",
    },
    {
      n: 4,
      prompt:
        "这条小径通向小明所住的地方。（小径=trail，通向=lead to，住=live）",
      answers: ["This trail leads to where Xiaoming lives."],
      explanation:
        "where 作介词 to 的宾语。",
    },
    {
      n: 5,
      prompt: "帮助别人就是拯救我们自己。（别人=others，拯救=save）",
      answers: [
        "Helping others is saving ourselves.",
        "To help others is to save ourselves.",
      ],
      explanation:
        "doing / to do 作名词性成分常可对换。",
    },
    {
      n: 6,
      prompt:
        "关键点在于他为啥杀死了小红。（关键的=key/critical，点=point，在于=lie in，杀死=kill）",
      answers: ["The key point lies in why he killed Xiaohong."],
      explanation:
        "why 引导宾语从句作 in 的宾语。",
    },
    {
      n: 7,
      prompt:
        "这些人正在嘲笑他们所鄙视的人。（嘲笑=laugh at，鄙视=disdain）",
      answers: ["These people are laughing at who they disdain."],
      explanation:
        "who 引导介词宾语从句。",
    },
    {
      n: 8,
      prompt:
        "他在哪里接受的教育与我无关。（接受=receive，教育=education，与……有关=concern）",
      answers: ["Where he received education does not concern me."],
      explanation:
        "where 主语从句；does not concern me。",
    },
    {
      n: 9,
      prompt:
        "怎样解决这个社会问题是我们共同的责任。（解决=solve，社会的=social，问题=problem，共同的=common，责任=responsibility）",
      answers: ["How to solve this social problem is our common responsibility."],
      explanation:
        "How to do 作主语。",
    },
    {
      n: 10,
      prompt:
        "什么时候实现目标取决于我们的合作程度。（实现=achieve，目标=goal，取决于=depend on，合作=cooperation，程度=level）",
      answers: ["When to achieve the goal depends on our cooperation level."],
      explanation:
        "When to do 作主语；depend on。",
    },
    {
      n: 11,
      prompt:
        "是否接受这个邀请取决于他是否已经做出安排。（接受=accept，邀请=invitation，做安排=make arrangements）",
      answers: [
        "Whether to accept this invitation depends on whether he has made arrangements.",
        "Whether to accept this invitation depends on whether he has made an arrangement.",
      ],
      explanation:
        "材料原用 arrangement 单数，更自然为 arrangements；双 whether。",
    },
    {
      n: 12,
      prompt:
        "我对“他在哪里购买那些原材料”很感兴趣。（对……感兴趣=be interested in，购买=buy/purchase，原材料=raw material）",
      answers: [
        "I am very interested in where he bought those raw materials.",
      ],
      explanation:
        "where 引导宾语从句作 in 的宾语。",
    },
    {
      n: 13,
      prompt:
        "没人知道是什么东西导致了这场灾难。（导致=cause，灾难=disaster）",
      answers: ["Nobody knows what caused this disaster."],
      explanation:
        "what 引导宾语从句。",
    },
    {
      n: 14,
      prompt:
        "他改变职业方向的原因引起了普遍的关注。（改变=change，职业=career，方向=direction，引起=cause，普遍的=public，关注=concern）",
      answers: ["Why he changed his career direction causes public concern."],
      explanation:
        "why 引导主语从句。",
    },
    {
      n: 15,
      prompt:
        "在比赛中获得奖品可以证明选手的实力。（比赛=match/competition，获得=get/obtain，证明=prove，选手=player，实力=strength）",
      answers: [
        "Getting a prize in the match can prove the player's strength.",
        "Getting a prize in the competition can prove the player's strength.",
      ],
      explanation:
        "动名词作主语。",
    },
    {
      n: 16,
      prompt:
        "如何提高表演技巧是这些演员需要去学习的东西。（提高=improve，表演=performance，技巧=skill，演员=actor）",
      answers: [
        "How to improve performance skills is what these actors need to learn.",
      ],
      explanation:
        "How to do 作主语；what 引导表语从句。",
    },
    {
      n: 17,
      prompt:
        "我们正在思考这个理论属于哪个体系。（思考=think about，理论=theory，属于=belong to，体系=system）",
      answers: ["We are thinking about which system this theory belongs to."],
      explanation:
        "which system + 陈述语序；介词 to 保留。",
    },
    {
      n: 18,
      prompt:
        "提升工作效率是员工们必须做的事情。（提升=improve/increase，效率=efficiency，员工=employee，必须=must）",
      answers: ["Increasing work efficiency is what the employees must do."],
      explanation:
        "what 引导表语从句。",
    },
    {
      n: 19,
      prompt:
        "“她在这场战斗中失败”让每个人都惊讶了。（战斗=fight，失败=fail，使……惊讶=surprise）",
      answers: [
        "It surprises everyone that she failed in the fight.",
        "That she failed in the fight surprises everyone.",
      ],
      explanation:
        "that 主从不可省；可用形式主语 it。",
    },
    {
      n: 20,
      prompt:
        "“这家银行将要面临一次公开指责”是一个谣言。（银行=bank，面临=face，公开的=open/public，谣言=rumor，指责=condemnation）",
      answers: [
        "It is a rumor that this bank will face an open condemnation.",
        "That this bank will face an open condemnation is a rumor.",
      ],
      explanation:
        "同位语性质用 that 从句；it 形式主语。",
    },
  ],
}
