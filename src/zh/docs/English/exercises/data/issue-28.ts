import type { ExerciseIssue } from "./types"

export const issue28: ExerciseIssue = {
  id: "issue-28",
  menuTitle: "第28期 · 同位语从句",
  title: "第28期：同位语从句（穿插定语从句）",
  subtitle: "that 同位语 vs who/which/where 定语",
  items: [
    {
      n: 1,
      prompt:
        "户外教学将在下周开始的消息让学生们很兴奋。（户外的=outdoor，教学=teaching，开始=start，消息=news，使……兴奋=excite）",
      answers: [
        "The news that outdoor teaching will start next week excites the students.",
      ],
      explanation:
        "news 的内容用 that 同位语从句。",
    },
    {
      n: 2,
      prompt:
        "努力优于天赋的观点支撑他度过了那段艰难的时光。（努力=hardworking/efforts，优于=beat，天赋=talent，观点=view，支撑=support，度过=go through）",
      answers: [
        "The view that hardworking beats talent supports him to go through that tough time.",
      ],
      explanation:
        "同位语 that；support sb. to do。",
    },
    {
      n: 3,
      prompt:
        "火星曾包含液态水的证据引发了新的浪潮。（火星=Mars，包含=include，液态水=liquid water，证据=evidence，引发=spark，浪潮=wave）",
      answers: [
        "The evidence that Mars included liquid water sparked a new wave.",
      ],
      explanation:
        "evidence 后用 that。",
    },
    {
      n: 4,
      prompt:
        "一个男孩在山谷里探险的故事吸引了无数读者（山谷=valley，探险=make an adventure，故事=story，吸引=attract，无数的=countless，读者=reader）",
      answers: [
        "The story that a boy made an adventure in the valley attracts countless readers.",
      ],
      explanation:
        "story 后用 that 同位语。",
    },
    {
      n: 5,
      prompt:
        "这本记录旅行见闻的日记包含有趣的细节。（日记=diary，记录=record，旅行=travel，见闻=experience，包含=include，有趣的=interesting，细节=detail）",
      answers: [
        "The diary which records the travel experience includes interesting details.",
        "The diary that records the travel experience includes interesting details.",
      ],
      explanation:
        "“记录…”是定语从句，不是同位语。",
    },
    {
      n: 6,
      prompt:
        "那本介绍动物保护的书教育了很多人。（介绍=introduce，动物=animal，保护=protection，教育=educate）",
      answers: [
        "That book which introduces animal protection educates many.",
        "That book that introduces animal protection educates many.",
      ],
      explanation:
        "定语从句修饰 book。",
    },
    {
      n: 7,
      prompt:
        "明年将增加绿化面积的提议受到市民的欢迎。（增加=increase，绿化面积=green areas，提议=proposal，欢迎=welcome，市民=citizen）",
      answers: [
        "The proposal that the green areas will be increased next year is welcomed by citizens.",
      ],
      explanation:
        "proposal 后用 that；被动 will be increased。",
    },
    {
      n: 8,
      prompt: "经过小明修改的计划最终被采纳了。（修改=revise，计划=plan，采纳=adopt）",
      answers: [
        "The plan that is revised by Xiaoming is finally adopted.",
      ],
      explanation:
        "定语从句 that is revised。",
    },
    {
      n: 9,
      prompt:
        "那座曾发生过重要战役的古城受到很好的保护。（重要的=important，战役=battle，发生=happen，古代的=ancient，城市=city，保护=protect）",
      answers: [
        "The ancient city where important battles happened is well protected.",
      ],
      explanation:
        "地点用 where 定语从句。",
    },
    {
      n: 10,
      prompt:
        "大家必须遵守“我们不能在课上吵闹”的规定（必须=must，遵守=obey，课=class，吵闹=make noises）",
      answers: [
        "Everyone should obey the rule that we cannot make noises in class.",
      ],
      explanation:
        "rule 的内容→that 同位语。",
    },
    {
      n: 11,
      prompt:
        "我们已经解决如何获取利润的问题。（解决=solve，获取=gain，利润=profit，问题=question）",
      answers: [
        "We have solved the question how to gain profits.",
        "We have solved the question of how to gain profits.",
      ],
      explanation:
        "疑问词+to do 作同位语。",
    },
    {
      n: 12,
      prompt:
        "青少年不爱学习的现象需要重视。（青少年=teenager，现象=phenomenon，需要=require，重视=attention）",
      answers: [
        "The phenomenon that teenagers don't love studying requires attention.",
      ],
      explanation:
        "phenomenon 后用 that。",
    },
    {
      n: 13,
      prompt:
        "食物不应被浪费的理念影响了很多人。（食物=food，浪费=waste，理念=idea，影响=influence）",
      answers: [
        "The idea that food should not be wasted influences many.",
      ],
      explanation:
        "idea 后用 that。",
    },
    {
      n: 14,
      prompt:
        "经常送我饼干的老女人是她的姐姐。（老的=old，送=send，饼干=cookie，姐姐=sister）",
      answers: ["The old lady who often sends me cookies is her sister."],
      explanation:
        "人用 who 定语从句。",
    },
    {
      n: 15,
      prompt: "教我们数学的老师非常耐心。（教=teach，数学=maths/mathematics，耐心的=patient）",
      answers: [
        "The teacher who teaches us maths is so patient.",
        "The teacher who teaches us mathematics is so patient.",
      ],
      explanation:
        "who 定语从句。",
    },
    {
      n: 16,
      prompt:
        "我明天不需要早起的梦想终于实现了。（梦想=dream，需要=need，起床=get up，早早地=early，终于=finally，实现=fulfill）",
      answers: [
        "The dream that I don't need to get up early tomorrow is finally fulfilled.",
      ],
      explanation:
        "dream 后用 that 同位语。",
    },
    {
      n: 17,
      prompt:
        "国际会议将在下个月举行的消息已经传开。（国际的=international，会议=conference，举行=hold，下个月=next month，消息=news，传开=spread out）",
      answers: [
        "The news that the international conference will be held next month has been spread out.",
      ],
      explanation:
        "will be held；has been spread out。",
    },
    {
      n: 18,
      prompt: "我支持“大家都应该投票”的想法。（支持=support，投票=vote，想法=opinion）",
      answers: [
        "I support the opinion that everyone should vote.",
      ],
      explanation:
        "opinion 后用 that。",
    },
    {
      n: 19,
      prompt:
        "应采用新的营销策略的建议被管理层通过了。（应该=should，采用=adopt，营销=marketing，策略=strategy，建议=suggestion，通过=pass，管理层=management）",
      answers: [
        "The suggestion that a new marketing strategy should be adopted is passed by management.",
      ],
      explanation:
        "strategy should be adopted 同位语。",
    },
    {
      n: 20,
      prompt:
        "“人工智能可能会取代大量工作岗位”的担心是不合理的。（人工智能=AI，可能=may，取代=replace，工作岗位=job，不合理的=unreasonable，担心=concern）",
      answers: [
        "The concern that AI may replace a large number of jobs is unreasonable.",
      ],
      explanation:
        "concern 后用 that。",
    },
  ],
}
