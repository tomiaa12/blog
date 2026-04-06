import type { ExerciseIssue } from "./types"

export const issue14: ExerciseIssue = {
  id: "issue-14",
  menuTitle: "第14期 · 非谓语作定语",
  title: "第14期：非谓语1（非谓语作定语）",
  subtitle: "现在分词 / 过去分词 / having done 作后置定语",
  items: [
    {
      n: 1,
      prompt:
        "这个在教室里大笑的女孩是我女儿。（大笑=laugh[vi.]，女儿=daughter）",
      answers: ["The girl laughing in the classroom is my daughter."],
      explanation:
        "女孩与 laugh 为主动关系→现在分词 laughing；in the classroom 作状语，整体后置修饰 girl。",
    },
    {
      n: 2,
      prompt:
        "放在长椅上的葡萄很新鲜。（放=put[put/put][vt.]，长椅=bench，葡萄=grape，新鲜的=fresh[adj.]）",
      answers: ["The grapes put on the bench are fresh."],
      explanation:
        "葡萄与 put 为被动→过去分词 put；on the bench。",
    },
    {
      n: 3,
      prompt:
        "这位经理喜欢那些制定计划的员工们。（经理=manager，制定=make[vt.]，计划=plan，员工=employee）",
      answers: ["This manager likes those employees making plans."],
      explanation:
        "employees 与 make 为主动→making plans 后置。",
    },
    {
      n: 4,
      prompt:
        "参加会议的人们都很专注。（参加=attend[vt.]，会议=conference/meeting，都=all，专注的=focused[adj.]）",
      answers: [
        "The people attending the conference are all focused.",
        "The people attending the meeting are all focused.",
      ],
      explanation:
        "people 与 attend 为主动→attending the conference/meeting。",
    },
    {
      n: 5,
      prompt:
        "站在讲台上的硕士是我们的导师。（讲台=podium，硕士=master，导师=mentor）",
      answers: ["The master standing on the podium is our mentor."],
      explanation:
        "master 与 stand 为主动→standing on the podium。",
    },
    {
      n: 6,
      prompt:
        "昨天收到的包裹包含一份报告。（收到=receive[vt.]，包裹=parcel，包含=include[vt.]，报告=report）",
      answers: ["The parcel received yesterday includes a report."],
      explanation:
        "parcel 与 receive 为被动→received yesterday。",
    },
    {
      n: 7,
      prompt:
        "小明忘记了从大学里学到的技术。（大学=university，技术=technique，忘记=forget[forgot/forgotten][vt.]）",
      answers: [
        "Xiaoming forgot the techniques learned from the university.",
        "Xiaoming forgot the techniques learned in the university.",
      ],
      explanation:
        "techniques 与 learn 为被动→learned from/in the university。",
    },
    {
      n: 8,
      prompt:
        "这本被许多小学生读过的小说非常引人入胜。（许多=many，小学=primary school，学生=student，阅读=read，引人入胜的=fascinating[adj.]）",
      answers: [
        "This novel read by many primary school students is so fascinating.",
        "This novel read by many primary school students is very fascinating.",
      ],
      explanation:
        "novel 与 read 为被动→read by many primary school students。",
    },
    {
      n: 9,
      prompt:
        "已经完成项目的团队可以得到一份奖励。（项目=project，完成=finish/complete[vt.]，团队=team，奖励=reward）",
      answers: ["The team having completed the project can get a reward."],
      explanation:
        "“已经完成”→完成体非谓语 having completed，作 team 的后置定语。",
    },
    {
      n: 10,
      prompt:
        "这些更喜欢画画的女士很迷人。（更喜欢=prefer，画画=drawing/painting，女士=lady，迷人的=charming[adj.]）",
      answers: ["These ladies preferring drawing are charming."],
      explanation:
        "ladies 与 prefer 为主动→preferring drawing。",
    },
    {
      n: 11,
      prompt:
        "没人支持这些从这家网站上收集的信息。（没人=nobody，支持=support[vt.]，网站=website，收集=collect[vt.]，信息=information）",
      answers: ["Nobody supports the information collected from the website."],
      explanation:
        "information 与 collect 为被动→collected from the website。",
    },
    {
      n: 12,
      prompt:
        "经常做运动的孩子都很健康。（经常=often，做=do[vt.]，运动=sport，都=all，健康的=healthy[adj.]）",
      answers: [
        "The kids doing sports often are all healthy.",
        "The kids often doing sports are all healthy.",
      ],
      explanation:
        "often 为副词，可放在 doing sports 前或后；kids 与 do 为主动。",
    },
    {
      n: 13,
      prompt:
        "由这位官员培训的成员们拥有独特的能力。（官员=official，培训=train[vt.]，成员=member，独特的=unique[adj.]，能力=ability）",
      answers: ["The members trained by this official have unique abilities."],
      explanation:
        "members 与 train 为被动→trained by this official。",
    },
    {
      n: 14,
      prompt:
        "坐在餐桌旁的家人们正在吃饭。（餐桌=dining table，在桌子旁边用 at，家人们=family[集体名词]，吃饭=have dinner）",
      answers: ["The family sitting at the dining table are having dinner."],
      explanation:
        "family 与 sit 为主动→sitting at the dining table；集体名词作“家人”时常用复数谓语。",
    },
    {
      n: 15,
      prompt:
        "那位学者不相信那些在期刊里发布的文章。（学者=scholar，相信=believe/trust[vt.]，期刊=journal，发布=publish[vt.]，文章=article）",
      answers: [
        "That scholar doesn't trust those articles published in the journal.",
        "That scholar doesn't believe those articles published in the journal.",
      ],
      explanation:
        "articles 与 publish 为被动→published in the journal。",
    },
    {
      n: 16,
      prompt:
        "这个教他物理的老师是他女朋友。（教=teach[vt.]，物理=physics，女朋友=girlfriend）",
      answers: ["This teacher teaching him physics is his girlfriend."],
      explanation:
        "teacher 与 teach 为主动→teaching him physics。",
    },
    {
      n: 17,
      prompt:
        "这篇由小明写的作文被大家所认可。（写=write[wrote/written][vt.]，作文=composition，大家=everyone，认可=recognize[vt.]）",
      answers: [
        "This composition written by Xiaoming is recognized by everyone.",
      ],
      explanation:
        "composition 与 write 为被动→written by Xiaoming；主句需被动 is recognized。",
    },
    {
      n: 18,
      prompt:
        "这位驾驶卡车的车主非常富有。（驾驶=drive[vt.]，卡车=truck，车主=owner，富有的=rich/wealthy[adj.]）",
      answers: [
        "This truck owner driving the truck is very wealthy.",
        "This truck owner driving the truck is very rich.",
      ],
      explanation:
        "owner 与 drive 为主动→driving the truck。",
    },
    {
      n: 19,
      prompt:
        "真正懂化学的人不会骄傲。（真正的=true[adj.]，真正地=truly[adv.]，懂=understand[vt.]，化学=chemistry，骄傲的=proud[adj.]）",
      answers: ["The people truly understanding chemistry won't be proud."],
      explanation:
        "people 与 understand 为主动；truly 修饰 understanding。",
    },
    {
      n: 20,
      prompt:
        "这个被偷的花瓶由丝绸所装饰。（偷=steal[stole/stolen][vt.]，丝绸=silk，装饰=decorate[vt.]，花瓶=vase）",
      answers: [
        "This vase stolen is decorated by silk.",
        "This stolen vase is decorated by silk.",
      ],
      explanation:
        "vase 与 steal 为被动→后置 stolen 或前置 stolen 作形容词用法均可。",
    },
  ],
}
